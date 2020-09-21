(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Chat.ChatLeft, (num) => {
        state.currentChat = {};

        var chat = state.chats.find(x => x.Number == num);
        if(chat != null) {
            chat.IsActiveChat = false;
        }
    });

})(woServices);