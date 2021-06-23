(function(services) {

    var hooks = services.Hooks;
    var events = services.HookEvents;

    hooks.register(events.Connection.Status, (e) => {
        if (services.Store.state.currentStatus != e.Data) {
            services.Store.commit("statusChanged", e.Data);
        }
    });

    hooks.register(events.Home.StatusChanged, (status) => {
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
                    state.currentStatus = settings.currentStatus;
                    state.userName = settings.userName;
                    state.t = settings.t;
                    state.department = settings.department;
                    state.previousAcceptedChats = settings.previousAcceptedChats || [];
                    state.chatsClosed = settings.chatsClosed || [];
                    state.statusCanChangeAutomatically = settings.statusCanChangeAutomatically;
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
                state.userName = loginDetails.userName;
                state.department = loginDetails.department;

                if(loginDetails.t != null) state.t = loginDetails.t;

                sessionStorage.setItem("woClient", JSON.stringify({
                    userName : loginDetails.userName,
                    t: state.t,
                    department : loginDetails.department,
                    previousAcceptedChats: state.previousAcceptedChats || [],
                    chatsClosed: state.chatsClosed || [],
                    currentStatus: state.currentStatus,
                    statusCanChangeAutomatically: state.statusCanChangeAutomatically,
                }));

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