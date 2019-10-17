
(function(services) {
    var hooks = services.Hooks;
    var events = services.HookEvents;
    services.Add("Store", new Vuex.Store({
        state: services.DefaultState(),
        mutations: {
            init(state) {
                state.connectionAddress = state.connectionAddress || `ws://${window.location.hostname}:8013`;
                state.settingsPortalAddress = state.settingsPortalAddress || `https://${window.location.hostname}/settings/ForgottenPassword.aspx`;
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
                state.previousAcceptedChats.push(chatId);
                var previousSettings = JSON.parse(sessionStorage.getItem("woClient"));
                previousSettings.previousAcceptedChats = state.previousAcceptedChats;
                sessionStorage.setItem("woClient", JSON.stringify(previousSettings));
            },
            saveLoginDetails(state, loginDetails) {
                state.userName = loginDetails.userName;
                state.password = loginDetails.password;
                state.department = loginDetails.department;
                sessionStorage.setItem("woClient", JSON.stringify(loginDetails))
            },
            replaceEntireState(state, newState) {
                Object.assign(state, newState);
            }
        }
    }));
})(woServices);