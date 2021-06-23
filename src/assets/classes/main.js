(function(services){

    var notification;

    class Main {
        constructor() {
            
            var hooks = services.Hooks;
            var connEvents = services.HookEvents.Connection;
            var events = services.HookEvents;

            var state = services.Store.state;
            var connection = services.WhosOnConn;

            connection.connect(state.connectionAddress);
            
            hooks.register(events.Socket.Closed, (e) => {
                connection.connect(state.connectionAddress);
            });

            hooks.register(connEvents.CurrentChats, (e) => {
                for(var i = 0; i < state.previousAcceptedChats.length; i++) {
                    var chatId = state.previousAcceptedChats[i];
                    var chat = state.chats.find(x => x.ChatUID == chatId);
                    if(chat != null && chat.TalkingToClientConnection == 0) {
                        hooks.call(events.ChatItem.AcceptClicked, { "Number": chat.Number, "ChatId": chat.ChatUID });
                    }
                }
            });

            hooks.register(connEvents.Error, (e) => {
                console.log("Error Occured");
            });

            hooks.register(events.Chat.MessageFromWaitingChat, (info) => {
                if (state.settings.ShowNotifications == false) {return;}

                if(notification != null) {notification.close();}
                notification = services.Notifications.CreateNotification(`Chat With ${info.name}`, info.msg.Data, () => {
                    window.focus();
                    hooks.call(events.ChatItem.AcceptClicked, { "Number": info.chat.Number, "ChatId": info.chat.ChatUID });
                });
            });

            hooks.register(events.Chat.ChatTransfered, (num) => {
                if (state.settings.ShowNotifications == false) {return;}

                if(notification != null) {notification.close();}
                notification = services.Notifications.CreateNotification("Chat Transfered", "");
            });

            hooks.register(events.Inactivity.Active, () => {
                if (state.userInfo != null && state.statusCanChangeAutomatically)
                {
                   if(woServices.Store.state.currentStatus != 0) connection.changeStatus("online");
                }
            });

            hooks.register(events.Inactivity.Inactive, () => {
                if (state.userInfo != null && state.statusCanChangeAutomatically) {connection.changeStatus("away");}
            });   

            hooks.register(events.Inactivity.ShouldLogOut, () => {
                connection.logout();
            });

            hooks.register(connEvents.ChatTransfered, (data) => {
                if (state.settings.ShowNotifications == false) {return;}

                var split = data.Data.split(":");
                var chatNum = split[0];
                var clientConn = split[1];
                var msg = split[2];
                var fromUser = state.users.find(x => x.Connection == clientConn);
                var chat = state.chats.find(x => x.Number == chatNum);
                if(notification != null) {notification.close();}

                notification = services.Notifications.CreateNotification("Transfer Request", msg || `User ${fromUser.Name} would like to transfer a chat with ${chat.Name}`, () => {
                    hooks.call(events.ChatItem.AcceptClicked, { "Number": chat.Number, "ChatId": chat.ChatUID });
                });
            });

            hooks.register(events.Chat.WrapUpNotCompleted, (notCompleted) => {
                if(notification != null) {notification.close();}
                if (notCompleted.IsFocused) {
                    hooks.call(events.Navigation.ClosedChatsClicked, notCompleted);
                    return;
                }
                notification = services.Notifications.CreateNotification("Chat Wrapup Required", "Please complete wrapup to close the chat", () => {
                    hooks.call(events.Chat.WrapUpClicked);
                });
            });

            hooks.register(events.Connection.UserInfo, () => {
                services.Inactivity.Start(state.settings);
            });


            hooks.register(events.Connection.SiteVisitors, (e) => {
                Object.keys(e.Data.Current).forEach((k) => {
                    var site = e.Data.Current[k];
                    services.Store.state.sitesVisitors[site.SiteKey] = site.Visitors;
                });

                services.Store.state.sitesVisitors = Copy(services.Store.state.sitesVisitors);
            });
        }
    }

    _ = new Main();
})(woServices);