(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.TransferConfirmed, (e) => {
        var chat = state.chats.find(x => Number(x.Number) == Number(e.Data));

        if(chat) {
            var msg = {
                code: 101,
                date: new Date().toLocaleTimeString(),
                msg: `Chat acquired from ${state.aquiringChatFrom}`
            };

            state.chatMessages[chat.ChatUID].push(msg)
            state.currentChatMessages.push(msg);
    
            state.aquiringChatFrom = "";
            hooks.Call(hook.Chat.ScrollChat);
        }
    });
})(woServices);