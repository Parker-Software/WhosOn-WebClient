
(function() {
    woServices.Add("Store", new Vuex.Store({
        state: {
            authString: "PSLHOSTED",
            version: "0.1",
            lang: "en",
            platform: "WebClient",
            connectionAddress: "ws://10.10.1.171:8013",
            userName: null,
            password: null,
            displayName: null,
            department: "dev",
            loggedIn: false,
            userInfo: null,
            currentChat: null,
            chats: null,
            rights: null,
            sites: null,
            skills: null,
            cannedResponses: null,
            uploadedFiles: null,
            settingsPortalAddress: null,
            loginViewName: "loginview",
            homeViewName: "homeview",
            connectingViewName: "connectingview"
        },
        mutations: {
            init(state) {

                state.connectionAddress = state.connectionAddress || `ws://${window.location.hostname}:8013`;
                state.settingsPortalAddress = state.settingsPortalAddress || `https://${window.location.hostname}/settings/ForgottenPassword.aspx`;

                var previousSettings = sessionStorage.getItem("woClient");
                if (previousSettings) {
                    var settings = JSON.parse(previousSettings);
                    state.userName = settings.userName;
                    state.password = settings.password;
                    state.displayName = settings.displayName;
                    state.department = settings.department;
                }
            },
            setChats(state, chats) {
                state.chats = chats;
            },
            saveLoginDetails(state, loginDetails) {
                state.userName = loginDetails.userName;
                state.password = loginDetails.password;
                state.displayName = loginDetails.displayName;
                state.department = loginDetails.department;
                sessionStorage.setItem("woClient", JSON.stringify(loginDetails))
            }
        }
    }));
})();