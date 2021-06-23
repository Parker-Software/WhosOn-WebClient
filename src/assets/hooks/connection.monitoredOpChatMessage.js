(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.MonitoredOpChatMessage, (message) => {
        var info = message.Header.split(":");
        var chatNum = info[0];

        var chat = state.chats.find(v => v.Number == chatNum);

        var chatObject = {
            code : 1,
            date : getDate(new Date()),
            msg : message.Data
        }
        if(state.chatMessages[chat.ChatUID] == null) {state.chatMessages[chat.ChatUID] = [];}
        state.chatMessages[chat.ChatUID].push(chatObject);
        state.currentChatMessages.push(chatObject);

    });

})(woServices);