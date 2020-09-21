(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;


    hooks.Register(hook.Chat.RequestedFileUpload, () => {
        state.currentChatMessages.push({
            code: 1,
            msg: "File Upload Request Sent.",
            date: getDate(new Date()),
            isLink: false
        });

        hooks.Call(hook.Chat.ScrollChat);
    });

})(woServices);