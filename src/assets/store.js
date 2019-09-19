
(function(services) {
    services.Add("Store", new Vuex.Store({
        state: {
            authString: "PSLHOSTED",
            version: "0.1",
            lang: "en",
            platform: "WebClient",
            connectionAddress: "ws://192.168.10.152:8013",
            userName: null,
            password: null,
            displayName: null,
            department: "dev",
            loggedIn: false,
            users: null,
            userInfo: null,
            currentChat: null,
            preRenderedChats: {},
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
            setChat(state, chat) {
                state.chats[chat.ChatUid] = chat;
            },
            setChats(state, chats) { 
                state.chats = services.ChatFactory.FromChatting(chats, state.sites, state.users);
                state.activeChatCount = Object.keys(state.chats).length; 
            }, 
            removeChat(state, data) {
                var chat = state.chats[data];
                if(chat != null) {
                    Vue.delete(state.chats, data);
                    state.activeChatCount = Object.keys(state.chats).length;
                }
            },
            addChat(state, data) {
                var info = data.split(":");
                var chatNum = info[0];
                var domain = info[1];
                var visitorName = info[2];
                var dept = info[3];

                state.preRenderedChats[chatNum] = {visitorName, domain, dept};
            },
            chatChanged(state, data) {
                console.log("Chat Changed");
                console.log(data);

                var newChat = state.preRenderedChats[data.Number];
                if (newChat != null) {
                    console.log(newChat);
                    Vue.delete(state.preRenderedChats, data.Number);
                } else {
                    var chat = state.chats[data.ChatUID];
                    console.log(chat);
                }

                state.chats.push(data);
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
                console.log(loginDetails);
                console.log(state);
                sessionStorage.setItem("woClient", JSON.stringify(loginDetails))
            }
        }
    }));
})(woServices);