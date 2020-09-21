(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.ChatRequested, (e) => {
        var data = e.Data;
        var info = data.split(":");
        var chatNum = info[0];
        var domain = info[1];
        var visitorName = info[2];
        var dept = info[3];
        state.preRenderedChats[chatNum] = {visitorName, domain, dept};
    });
})(woServices);