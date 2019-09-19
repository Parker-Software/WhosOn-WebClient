(function(services){
    class Main {
        constructor() {
            var self = this;

            var hooks = services.Hooks;
            var connEvents = services.HookEvents.Connection;
            var auth = services.Authentication;

            self._state = services.Store.state;
            self._connection = services.WhosOnConn;
            
            self._connection.Connect(self._state.connectionAddress);

            hooks.Register(connEvents.Error, (e) => {
                console.log("Error Occured");
            });

            hooks.Register(connEvents.CurrentChats, (e) => {
                var chats = e.Data.Chats;

                services.Store.commit("setChats", chats);
            });

            hooks.Register(connEvents.UserSites, (e) => {
                services.Store.commit("setSites", e.Data.Sites);
            });

            hooks.Register(connEvents.UserInfo, (e) => {
                services.Store.commit("setUserInfo", e.Data.MyUser);
            });

            hooks.Register(connEvents.CurrentUsersOnline, (e) => {
                services.Store.commit("setCurrentUsers", e.Data.Clients);
            });
        }
    }

    var main = new Main();
})(woServices);