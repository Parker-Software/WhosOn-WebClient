(function() {
    class VueApp {
        constructor() {

            var self = this;
            self._store = new Vuex.Store({
                state: {
                    authString: "PSLHOSTED",
                    version: "0.1",
                    lang: "en",
                    platform: "WebClient",
                    connectionAddress: "ws://192.168.10.152:8013",
                    userName: "Jamie",
                    password: "pslt0pmans",
                    displayName: "Jamie",
                    department: "dev",
                    loggedIn: false,
                    userInfo: null,
                    currentChat: null,
                    activeChatCount: 0,
                    users: null,
                    chats: null,
                    rights: null,
                    sites: null,
                    skills: null,
                    cannedResponses: null,
                    uploadedFiles: null
                },
                mutations: {
                    init(state) {

                        state.connectionAddress = state.connectionAddress || `ws://${window.location.hostname}:8013`;

                        var previousSettings = sessionStorage.getItem("woClient");
                        if(previousSettings) {
                            var settings = JSON.parse(previousSettings);
                            state.userName = settings.userName;
                            state.password = settings.password;
                            state.displayName = settings.displayName;
                            state.department = settings.department;
                        }
                    },
                    setChats(state, chats) {
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
                    }
                }
            });
            
            self._state = self._store.state;

            self._main = new Vue({
                el: "#app",
                store: self._store,
                beforeCreate() {
                    this.$store.commit("init");
                }
            }); 
        }
    }

    var vue = new VueApp();
    woServices.Add("Vue", vue);
})();