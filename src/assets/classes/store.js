(function(services) {

    var hooks = services.Hooks;
    var events = services.HookEvents;

    hooks.Register(events.Connection.Status, (e) => {
        if (services.Store.state.currentStatus != e.Data) {
            services.Store.commit("statusChanged", e.Data);
        }
    });

    hooks.Register(events.Home.StatusChanged, (status) => {
        var newStatus = -1;
        switch(status) {
            case "online":
                newStatus = 0;
                break;
            case "busy":
                newStatus = 1;
                break;
            case "brb":
                newStatus = 2;
                break;
            case "away":
                newStatus = 3;
                break;
            default:
                newStatus = 0;
        }
        services.Store.commit("statusChanged", newStatus);
    });

    var storageHelper = {
        // persist the current state
        saveState(state) {
            var previousSettings = JSON.parse(sessionStorage.getItem("woClient"));
            previousSettings.previousAcceptedChats = state.previousAcceptedChats;
            previousSettings.chatsClosed = state.chatsClosed;
            previousSettings.currentStatus = state.currentStatus;
            previousSettings.statusCanChangeAutomatically = state.statusCanChangeAutomatically;
            sessionStorage.setItem("woClient", JSON.stringify(previousSettings));
        },

        /**
         * Load the local settings from local storage so that any that apply
         * to the initial connection can be recovered
         * @param {*} state the state object to put settings in
         */
        loadSettings(state) {
            var settings = JSON.parse(localStorage.getItem("settings"));
            if (settings) {
                state.settings = settings;
            }
        },

        /**
         * save the current settings to local storage
         * @param {*} state the state object to pull settings from
         */
        saveSettings(state) {
            localStorage.setItem("settings", JSON.stringify(state.settings));
        }
    }

    services.Add("Store", new Vuex.Store({
        state: services.DefaultState(),
        actions: {
            storeSettings(context) {
                storageHelper.saveSettings(this.state);
            }
        },
        mutations: {
            init(state) {
                state.previousAcceptedChats = [];
                storageHelper.loadSettings(state);
                var previousSettings = sessionStorage.getItem("woClient");
                if (previousSettings) {
                    var settings = JSON.parse(previousSettings);

                    let key = `${settings.userName}${settings.time.toString()}`;
                    let t = CryptoJS.AES.decrypt(
                        settings.t,
                        key
                    );
                    
                    state.currentStatus = settings.currentStatus;
                    state.userName = settings.userName;
                    state.t = t.toString(CryptoJS.enc.Utf8);
                    state.department = settings.department;
                    state.previousAcceptedChats = settings.previousAcceptedChats || [];
                    state.chatsClosed = settings.chatsClosed || [];
                    state.statusCanChangeAutomatically = settings.statusCanChangeAutomatically;
                    state.openid = settings.openid;
                    state.server = settings.server;
                    state.auth = settings.auth;
                }
            },

            chatAccepted(state, chatId) {
                if(state.previousAcceptedChats.indexOf(chatId) == -1) {
                    state.previousAcceptedChats.push(chatId);
                }

                storageHelper.saveState(state);
            },

            chatClosed(state, chatId) {
                storageHelper.saveState(state);                
            },

            statusChanged(state, status) {
                state.currentStatus = status;
                storageHelper.saveState(state);
            },

            saveLoginDetails(state, loginDetails) {
                let t = "";
                let time = Date.now();
                state.userName = loginDetails.userName;
                state.server = loginDetails.server;
                state.auth = loginDetails.auth;

                if (loginDetails.t) {
                    // password auth
                    state.t = loginDetails.t;
                    state.department = loginDetails.department;

                    let key = `${loginDetails.userName}${time.toString()}`;
                    t = CryptoJS.AES.encrypt(
                        loginDetails.t,
                        key
                    );

                } else {
                    // openid
                    state.t = "";
                    state.openid = loginDetails.openid;
                }

                sessionStorage.setItem("woClient", JSON.stringify({
                    userName : loginDetails.userName,
                    t: t.toString(),
                    time,
                    department : loginDetails.department,
                    previousAcceptedChats: state.previousAcceptedChats || [],
                    chatsClosed: state.chatsClosed || [],
                    currentStatus: state.currentStatus,
                    statusCanChangeAutomatically: state.statusCanChangeAutomatically,
                    server: state.server,
                    auth: state.auth,
                    openid: state.openid
                }));

                state.settings.RememberLogin = loginDetails.RememberLogin;

                rg4js('setUser', {
                    identifier: state.userName,
                    isAnonymous: false
                  });
            },

            replaceEntireState(state, newState) {
                Object.assign(state, newState);
            }
        }
    }));
})(woServices);