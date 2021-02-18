(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    var notification;

    hooks.Register(hook.Connection.NewChat, (chat) => {
        if (state.settings.ShowNotifications == false) 
            return;

        if(notification != null) 
            notification.close();

        notification = services
            .Notifications
            .CreateNotification(
                "WhosOn Chat Request",
                `Visitor ${chat.Name} on ${chat.SiteName} wants to chat`,
                () => {
                    window.focus();
                    hooks.Call(hook.ChatItem.AcceptClicked,
                        { 
                            "Number": chat.Number,
                            "ChatId": chat.ChatUID
                        }
                    );
                });
    });

})(woServices);