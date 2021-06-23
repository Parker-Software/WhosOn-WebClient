(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.CannedResponses, (e) => {
        state.cannedResponses = e.Data;
        state.cannedResponsesTree = cannedResponsesToTree(e.Data);
    });

    
})(woServices);