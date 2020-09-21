(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.ChatItem.MonitorClicked, (chatInfo) => {
        var foundChat;
        Object.keys(state.chats).forEach(key => {
            var chat = state.chats[key];
            chat.IsActiveChat = false;
            if (chat.ChatUID == chatInfo.ChatId && chat.BeingMonitoredByYou) {
                foundChat = chat;
            }
        });

        if (foundChat != null) {
            foundChat.IsActiveChat = true;
            state.currentChat = foundChat;
            state.currentChatSite = state.sites[foundChat.SiteKey];

            if (state.chatMessages[foundChat.ChatUID] != null) {
                state.currentChatMessages = Copy(state.chatMessages[foundChat.ChatUID]);
            } else {
                state.currentChatMessages = Copy([]);
            }

            if (state.chatPreSurveys[foundChat.Number] != null) {
                state.currentChatPreSurveys = Copy(state.chatPreSurveys[chatInfo.Number]);
                hooks.Call(hook.Chat.PreChatSurveysLoaded);
            } else {
                state.currentChatPreSurveys = [];
            }
            hooks.Call(hook.Chat.ClickTab, "conversation");
        } else {services.WhosOnConn.MonitorChat(chatInfo.Number);}
    });
})(woServices);