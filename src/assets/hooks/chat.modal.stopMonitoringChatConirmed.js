(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.ChatModal.StopMonitoringChatConfirmed, (chatNum) => {
        var chat = state.chats.find((v) => v.Number == chatNum);
        if (chat != null) {
            chat.BeingMonitoredByYou = false;
            chat.IsActiveChat = false;
        }
        state.currentChat = {};
    });

})(woServices);