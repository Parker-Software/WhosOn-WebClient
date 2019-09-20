
(function(services) {
    class StoreUpdater {
        constructor() {
            var hooks = services.Hooks;
            var connEvents = services.HookEvents.Connection;

            hooks.Register(connEvents.CurrentChats, (e) => {
                services.Store.commit("setChats", e.Data.Chats);
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

            hooks.Register(connEvents.ChatClosed, (e) => {
                services.Store.commit("removeChat", e.Data);
            });

            hooks.Register(connEvents.ChatRequested, (e) => {
                services.Store.commit("addChat", e.Data);
            });

            hooks.Register(connEvents.ChatChanged, (e) => {
                services.Store.commit("chatChanged", e.Data);
            });

            hooks.Register(connEvents.UserStatusChanged, (e) => {
                services.Store.commit("userChanged", e.Data);
            });

            hooks.Register(connEvents.ChatMessage, (e) => {
                services.Store.commit("chatMessage", e);
            });

            hooks.Register(connEvents.CurrentChat, (e) => {
                var chatInfo = e.Header.split(":");
                var siteKey = chatInfo[0];
                var ip = chatInfo[1];
                var sessId = chatInfo[2];
                var chatId = chatInfo[3];
                var chatNum = chatInfo[4];

                services.Store.commit("currentChat", { chatNum, data: e.Data});
            })
        }
    }

    services.Add("StoreUpdater", new StoreUpdater());
})(woServices);