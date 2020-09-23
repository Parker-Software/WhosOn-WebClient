(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    var connection = services.WhosOnConn;

    hooks.Register(hook.Connection.ListeningClient, (data) => {
        var info = data.Header.split(":");
        var chatuid = info[1];

        var chat = state.chats.find(x => x.ChatUID == chatuid);

        if(state.chatMessages[chatuid] == null) {
            connection.GetPreviousChat(chat.SiteKey, chatuid);
        } else {

            if(chat.TalkingToClientConnection == state.currentConnectionId || chat.BeingMonitoredByYou) {return;}

            state.chatMessages[chatuid].push({
                date: new Date(),
                code: 1,
                msg: data.Data
            });
            state.chatMessages = Copy(state.chatMessages);
        }
    });

})(woServices);