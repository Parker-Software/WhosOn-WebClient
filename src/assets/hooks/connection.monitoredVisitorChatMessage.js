(function(services) {
    var hooks = services.Hooks;
    var events = services.HookEvents;

    hooks.Register(events.Connection.MonitoredVisitorChatMessage, (message) => {
        var info = message.Header.split(":");
        var chatNum = info[0];
        hooks.Call(events.Connection.ChatMessage, {Header:chatNum, Data:message.Data});
    });
})(woServices);