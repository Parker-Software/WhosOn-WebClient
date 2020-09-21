(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    
    hooks.Register(hook.Connection.MonitoredWhisper, (whisper) => {
        var info = whisper.Header.split(":");
        var chatNum = info[0];
        var opName = info[1];

        var chatBelongingTo = state.chats.find((v) => v.Number == chatNum);
        if(chatBelongingTo == null) {
            return;
        }

        
        var message = { code:1, msg:whisper.Data, date: getDate(new Date()), isWhisper: true, Name: opName};
        
        if(state.chatMessages[chatBelongingTo.ChatUID] == null) {state.chatMessages[chatBelongingTo.ChatUID] = [];}
        state.chatMessages[chatBelongingTo.ChatUID].push(message);
        state.chatMessages = Copy(state.chatMessages);

        var hasCurrentChat = Object.keys(state.currentChat).length != 0;
        if(hasCurrentChat) {
            if(state.currentChat.ChatUID == chatBelongingTo.ChatUID) {
                state.currentChatMessages = Copy(state.chatMessages[chatBelongingTo.ChatUID]);
                hooks.Call(hook.Chat.ScrollChat);
            }
        }
    });

})(woServices);