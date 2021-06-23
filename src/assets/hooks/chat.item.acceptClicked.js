(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.ChatItem.AcceptClicked, (chatInfo) => {
        var chats = state.chats;
        Object.keys(chats).forEach((key) => {
            var chat = chats[key];
            if (chat.ChatUID == chatInfo.ChatId) {
                chat.IsActiveChat = true;
                chat.BeingMonitoredByYou = false;
                state.currentChat = chat;
                state.currentChatSite = state.sites[chat.SiteKey];

                if (state.chatMessages[chat.ChatUID] != null) {
                    state.currentChatMessages = Copy(state.chatMessages[chat.ChatUID]);
                } else {
                    state.currentChatMessages = Copy([]);
                }

                if (state.chatPreSurveys[chat.Number] != null) {
                    state.currentChatPreSurveys = Copy(state.chatPreSurveys[chatInfo.Number]);
                    hooks.call(hook.Chat.PreChatSurveysLoaded);
                } else {
                    state.currentChatPreSurveys = [];
                }
                services.WhosOnConn.acceptChat(chatInfo.Number);
                hooks.call(hook.Chat.ClickTab, "conversation");
            } else {
                chat.IsActiveChat = false;
            }
        });
    });

})(woServices);