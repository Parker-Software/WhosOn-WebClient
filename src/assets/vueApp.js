(function() {
    class VueApp extends EventEmitter {
        constructor() {
            super();

            var self = this;
            self._store = new Vuex.Store({
                state: {
                    authString: "PSLHOSTED",
                    version: "0.1",
                    lang: "en",
                    platform: "WebClient",
                    connectionAddress: "ws://192.168.10.152:8013",
                    userName: null,
                    password: null,
                    displayName: null,
                    department: null,
                    loggedIn: false,
                    userInfo: null,
                    currentChat: null,
                    chats: null,
                    rights: null,
                    sites: null,
                    skills: null,
                    cannedResponses: null,
                    uploadedFiles: null
                },
                mutations: {
                    getPreviousLoginInfo(state) {
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
                    }
                }
            });
            
            self._state = self._store.state;

            self._main = new Vue({
                el: "#app",
                store: self._store,
                beforeCreate() {
                    this.$store.commit("getPreviousLoginInfo");
                }
            }); 
        }
    }

    var vue = new VueApp();
    woServices.Add("Vue", vue);
})();