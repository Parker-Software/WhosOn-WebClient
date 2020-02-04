
(function(services) {
    services.Add("Store", new Vuex.Store({
        state: services.DefaultState(),
        mutations: {
            init(state) {
                state.previousAcceptedChats = [];

                var previousSettings = sessionStorage.getItem("woClient");
                if (previousSettings) {
                    var settings = JSON.parse(previousSettings);
                    state.userName = settings.userName;
                    state.password = settings.password;
                    state.department = settings.department;
                    state.previousAcceptedChats = settings.previousAcceptedChats || [];
                }
            },
            chatAccepted(state, chatId) {
                if(state.previousAcceptedChats.indexOf(chatId) == -1) {
                    state.previousAcceptedChats.push(chatId);
                }

                var previousSettings = JSON.parse(sessionStorage.getItem("woClient"));
                previousSettings.previousAcceptedChats = state.previousAcceptedChats;
                sessionStorage.setItem("woClient", JSON.stringify(previousSettings));
            },
            saveLoginDetails(state, loginDetails) {
                state.userName = loginDetails.userName;
                state.password = loginDetails.password;
                state.department = loginDetails.department;
                sessionStorage.setItem("woClient", JSON.stringify({
                    userName : loginDetails.userName,
                    password : loginDetails.password,
                    department : loginDetails.department,
                    previousAcceptedChats: state.previousAcceptedChats || []
                }))
            },
            replaceEntireState(state, newState) {
                Object.assign(state, newState);
            }
        }
    }));
})(woServices);