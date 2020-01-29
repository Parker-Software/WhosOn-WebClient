(function(services){

    var notification;

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
            });

            hooks.Register(connEvents.LoggedIn, (e) => {
                connection.GetFiles();  
                connection.GetCannedResponses();
                connection.GetSkills();
                //connection.StartVisitorEvents();
            });

            hooks.Register(connEvents.CurrentChats, (e) => {
                for(var i = 0; i < state.previousAcceptedChats.length; i++) {
                    var chatId = state.previousAcceptedChats[i];
                    var chat = state.chats.find(x => x.ChatUID == chatId);
                    if(chat != null && chat.TalkingToClientConnection == 0) {
                        hooks.Call(events.ChatItem.AcceptClicked, { "Number": chat.Number, "ChatId": chat.ChatUID });
                    }
                }
            });

            hooks.Register(connEvents.Error, (e) => {
                console.log("Error Occured");
            });

            hooks.Register(connEvents.NewChat, (chatInfo) => {
                if (state.settings.ShowNotifications == false) {return;}

                if(notification != null) {notification.close();}
                notification = services.Notifications.CreateNotification("WhosOn Chat Request", `Visitor ${chatInfo.Name} on ${chatInfo.SiteName} wants to chat`, () => {
                    window.focus();
                    hooks.Call(events.ChatItem.AcceptClicked, { "Number": chatInfo.Number, "ChatId": chatInfo.ChatUID });
                });
            });

            hooks.Register(events.Chat.MessageFromWaitingChat, (info) => {
                if (state.settings.ShowNotifications == false) {return;}

                if(notification != null) {notification.close();}
                notification = services.Notifications.CreateNotification(`Chat With ${info.name}`, info.msg.Data, () => {
                    window.focus();
                    hooks.Call(events.ChatItem.AcceptClicked, { "Number": info.chat.Number, "ChatId": info.chat.ChatUID });
                });
            });

            hooks.Register(events.Chat.ChatTransfered, (num) => {
                if (state.settings.ShowNotifications == false) {return;}

                if(notification != null) {notification.close();}
                notification = services.Notifications.CreateNotification("Chat Transfered", "", () => {

                });
            });

            hooks.Register(events.Inactivity.Active, () => {
                if(state.userInfo != null && state.statusCanChangeAutomatically) {connection.ChangeStatus("online");}
            });

            hooks.Register(events.Inactivity.Inactive, () => {
                if(state.userInfo != null && state.statusCanChangeAutomatically) {connection.ChangeStatus("away");}
            });   

            hooks.Register(events.Inactivity.ShouldLogOut, () => {
                connection.Logout();
            });

            hooks.Register(connEvents.ChatTransfered, (data) => {
                if (state.settings.ShowNotifications == false) {return;}

                var split = data.Data.split(":");
                var chatNum = split[0];
                var clientConn = split[1];
                var msg = split[2];
                var fromUser = state.users.find(x => x.Connection == clientConn);
                var chat = state.chats.find(x => x.Number == chatNum);
                if(notification != null) {notification.close();}

            

                notification = services.Notifications.CreateNotification("Transfer Request", msg || `User ${fromUser.Name} would like to transfer a chat with ${chat.Name}`, () => {
                    hooks.Call(events.ChatItem.AcceptClicked, { "Number": chat.Number, "ChatId": chat.ChatUID });
                });
            });

            hooks.Register(events.Chat.WrapUpNotCompleted, () => {
                if(notification != null) {notification.close();}
                notification = services.Notifications.CreateNotification("Chat Wrapup Required", "Please complete wrapup to close the chat", () => {
                    hooks.Call(events.Chat.WrapUpClicked);
                });
            });

            hooks.Register(events.Connection.UserInfo, () => {
                services.Inactivity.Start(state.settings);
            });
        }
    }

    var main = new Main();
})(woServices);