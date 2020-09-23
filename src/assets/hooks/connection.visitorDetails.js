(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.VisitorDetails, (e) => {
        let info = e.Header.split(":");
        let chatId = info[3];

        state.visitorDetail[chatId] = e.Data;
        state.visitorDetail = Copy(state.visitorDetail);

    });

})(woServices);