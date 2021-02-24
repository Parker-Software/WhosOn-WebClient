(function(services) {
    var storageHelper = {
        // persist the current state
        saveState(state) {
            var previousSettings = JSON.parse(sessionStorage.getItem("woClient"));
            previousSettings.previousAcceptedChats = state.previousAcceptedChats;
            previousSettings.chatsClosed = state.chatsClosed;
            sessionStorage.setItem("woClient", JSON.stringify(previousSettings));
        }
    }

    services.Add("Store", new Vuex.Store({
        state: services.DefaultState(),
        mutations: {
            init(state) {
                state.previousAcceptedChats = [];

                var previousSettings = sessionStorage.getItem("woClient");
                if (previousSettings) {
                    var settings = JSON.parse(previousSettings);

                    let key = `${settings.userName}${settings.time.toString()}`;
                    let t = CryptoJS.AES.decrypt(
                        settings.t,
                        key
                    );

                    state.userName = settings.userName;
                    state.t = t.toString(CryptoJS.enc.Utf8);
                    state.department = settings.department;
                    state.previousAcceptedChats = settings.previousAcceptedChats || [];
                    state.chatsClosed = settings.chatsClosed || [];
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

            saveLoginDetails(state, loginDetails) {
                state.userName = loginDetails.userName;
                state.t = loginDetails.t;
                state.department = loginDetails.department;

                let time = Date.now();
                
                let key = `${loginDetails.userName}${time.toString()}`;
                let t = CryptoJS.AES.encrypt(
                    loginDetails.t,
                    key
                );

                sessionStorage.setItem("woClient", JSON.stringify({
                    userName : loginDetails.userName,
                    t: t.toString(),
                    time,
                    department : loginDetails.department,
                    previousAcceptedChats: state.previousAcceptedChats || [],
                    chatsClosed: state.chatsClosed || []
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