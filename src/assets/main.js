(function(services){
    class Main {
        constructor() {
            var self = this;

            var hooks = services.Hooks;
            var connEvents = services.HookEvents.Connection;

            self._state = services.Store.state;
            self._connection = services.WhosOnConn;
            
            self._connection.Connect(self._state.connectionAddress);

            hooks.Register(connEvents.Error, (e) => {
                console.log("Error Occured");
            });

            hooks.Register(connEvents.CurrentChats, (e) => {
                var rawChats = e.Data.Chats;
                var chats = {};

                for(var i = 0; i < rawChats.length; i++) {
                    var rawChat = rawChats[i];
                    chats[rawChat.ChatUid] = rawChat;
                }

                services.Store.commit("setChats", chats);
            });

            hooks.Register(connEvents.UserSites, (e) => {
                var rawSites = e.Data.Sites;
                var sites = {};

                for(var i = 0; i < rawSites.length; i++) {
                    var rawSite = rawSites[i];
                    sites[rawSite.SiteKey] = rawSite;
                }

                services.Store.commit("setSites", sites);
            });

            hooks.Register(connEvents.UserInfo, (e) => {
                services.Store.commit("setUserInfo", e.Data.MyUser);
            });

            hooks.Register(connEvents.CurrentUsersOnline, (e) => {
                services.Store.commit("setCurrentUsers", e.Data.Clients);
            });

            hooks.Register(connEvents.ChatClosed, (e) => {
                services.Store.commit("removeChat", e.Data);
            });

            hooks.Register(connEvents.ChatRequested, (e) => {
                services.Store.commit("addChat", e.Data);
            });

            hooks.Register(connEvents.ChatChanged, (e) => {
                services.Store.commit("chatChanged", e.Data);
            });
        }
    }

    var main = new Main();
})(woServices);