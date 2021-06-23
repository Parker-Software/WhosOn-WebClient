(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.ChatAcquired, (e) => {
        var split = e.Data.split(":");
        var chatNumber = split[0];
        var opName = split[1];
        
        if(Number(chatNumber) == Number(state.currentChat.Number)) {
            var chat = state.chats.find(x => Number(x.Number) == Number(chatNumber));

            var msg = {
                code: 101,
                date: new Date().toLocaleTimeString(),
                msg: `Chat has been acquired by ${opName}`
            };

            state.chatMessages[chat.ChatUID].push(msg)
            state.currentChatMessages.push(msg);
            hooks.call(hook.Chat.ScrollChat);
        }
    });

})(woServices);