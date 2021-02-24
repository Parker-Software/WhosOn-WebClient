(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var store = services.Store;

    hooks.Register(events.Chat.WrapUpCompleted, (chatdata) => {
        var thisChat = state.chats.find((v) => v.ChatUID == chatdata.ChatUID);
        if (!thisChat) thisChat = state.chatsClosed.find((v) => v.ChatUID == chatdata.ChatUID);
        if (thisChat) {
            thisChat.WrapUpCompleted = true;
            thisChat.WrapUpValue = chatdata.Value;
            if (thisChat.Closed) {
                // chat has already closed, so store it again with the completed wrapup state.
                store.commit("chatClosed", thisChat.ChatUID);
            }
        }
    });

})(woServices);