(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.ForcedChatAccept, (forcedChat) => {
        var data = forcedChat.Data;
        var split = data.split(":");
        var number = split[0];
        var chat = state.chats.find(x => x.Number == number);
        var validCurrentChat = state.currentChat != null && Object.keys(state.currentChat).length > 0;

        if(chat != null) {
            if(validCurrentChat == false) {
                hooks.Call(hook.ChatItem.AcceptClicked, {ChatId:chat.ChatUID, Number:number});
            } else {
                services.WhosOnConn.AcceptChat(number);
            }
        }
    });
})(woServices);