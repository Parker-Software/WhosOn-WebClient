
(function(services) {
    services.Add("Store", new Vuex.Store({
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
            users: null,
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
                for(var i = 0; i < chats.length; i++) { 
                    var chat = chats[i]; 

                    var site = state.sites.find((v) => v.SiteKey == chat.SiteKey); 
                    chat.SiteName = site.Name; 

                    if(chat.TalkingToClientConnection != null && chat.TalkingToClientConnection != 0) { 
                        var op = state.users.find((v) => v.Connection == chat.TalkingToClientConnection); 
                        chat.TalkingTo = op.Username; 
                        chat.Status = `Talking to ${chat.TalkingTo}`; 
                    } 
                } 

                state.chats = chats; 
                state.activeChatCount = state.chats.length; 
            }, 
            setSites(state, sites) { 
                state.sites = sites; 
            }, 
            setUserInfo(state, info) { 
                state.userInfo = info; 
            }, 
            setCurrentUsers(state, users) { 
                state.users = users; 
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
})(woServices);