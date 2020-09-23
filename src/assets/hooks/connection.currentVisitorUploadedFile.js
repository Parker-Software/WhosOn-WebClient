(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.CurrentVisitorUploadedFile, (e) => {
        var chatBelongingTo = state.chats.find((v) => v.Number == e.Header);
        if(chatBelongingTo == null) {return;}

        var chatId = chatBelongingTo.ChatUID;
        var msg = {code:0, msg:e.Data, date: getDate(new Date()), isLink: true};
        
        if(state.chatMessages[chatId] == null) {state.chatMessages[chatId] = [];}
        state.chatMessages[chatId].push(msg);
        state.chatMessages = Copy(state.chatMessages);

        var hasCurrentChat = Object.keys(state.currentChat).length != 0;

        if(hasCurrentChat) {
            if(state.currentChat.ChatUID == chatId) {
                state.currentChatMessages = Copy(state.chatMessages[chatId]);
                hooks.Call(hook.Chat.ScrollChat, "");
            }
        }
    });
})(woServices);