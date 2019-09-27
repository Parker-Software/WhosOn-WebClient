(function(services){
    class Main {
        constructor() {
            var self = this;

            var hooks = services.Hooks;
            var connEvents = services.HookEvents.Connection;
            var events = services.HookEvents;

            var state = services.Store.state;
            var connection = services.WhosOnConn;

            connection.Connect(state.connectionAddress);
            hooks.Register(events.Socket.Closed, (e) => {
                connection.Connect(state.connectionAddress);
            })

            hooks.Register(connEvents.Error, (e) => {
                console.log("Error Occured");
            });

            hooks.Register(connEvents.NewChat, (chatInfo) => {
                services.Notifications.CreateNotification("WhosOn Chat Request", `Visitor ${chatInfo.Name} on ${chatInfo.SiteName} wants to chat`, () => {
                    window.focus();
                    hooks.Call(events.Chat.AcceptChat, { "Number": chatInfo.Number, "ChatId": chatInfo.ChatUID });
                });
            });
        }
    }

    var main = new Main();
})(woServices);