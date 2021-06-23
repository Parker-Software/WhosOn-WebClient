(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.PreviousChat, (e) => {
        var chat = state.chats.find(x => x.ChatUID == e.Data.ChatUID);

        if(chat) {
            state.chatPreSurveys[chat.Number] = e.Data.PreChatSurvey;
            state.chatPreSurveys = Copy(state.chatPreSurveys);

            state.chatMessages[chat.ChatUID] = e.Data.Lines;
            state.chatMessages = Copy(state.chatMessages);
        }
    });

})(woServices);