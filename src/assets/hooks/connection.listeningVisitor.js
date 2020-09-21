(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    var connection = services.WhosOnConn;
    
    hooks.Register(hook.Connection.ListeningVisitor, (data) => {
        var info = data.Header.split(":");
        var chatNumber = info[0];
        var chatuid = info[1];

        var chat = state.chats.find(x => x.ChatUID == chatuid);

        if(state.chatMessages[chatuid] == null) {
            connection.GetPreviousChat(chat.SiteKey, chatuid);
        } else {
            if(chat.TalkingToClientConnection == state.currentConnectionId || chat.BeingMonitoredByYou) {return;}

            hooks.Call(hook.Connection.ChatMessage, {Header:chatNumber, Data:data.Data});
        }
    });

})(woServices);