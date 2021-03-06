(function(services) {
    var store = services.Store;
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;

    hooks.Register(events.Connection.ChatAccepted, (acceptedChat) => {
        var data = acceptedChat.Data;
        var split = data.split(":");
        var chatId = split[0];
        var chat = state.chats.find(x => x.ChatUID == chatId);

        chat.TalkingToClientConnection = state.currentConnectionId;

        store.commit("chatAccepted", chatId);

        var yourChats = state.chats.filter(x => x.TalkingToClientConnection == state.currentConnectionId);
        var reached = state.userInfo.MaxChats <= yourChats.length;

        if(state.userInfo.MaxChats != 0 && reached) {
            connection.ChangeStatus("busy");
            state.statusCanChangeAutomatically = false;
        } else {
            connection.ChangeStatus("online");
            state.statusCanChangeAutomatically = true;
        }
    });
})(woServices);