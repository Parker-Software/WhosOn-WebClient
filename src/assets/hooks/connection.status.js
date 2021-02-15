// handle the server or another operator pushing me to offline
(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.Status, (e) => {
        var newState = e.Data;

        if (woServices.Store.state.currentStatus != newState) {
            woServices.Store.state.currentStatus = e.Data;
            if (e.Data != 0) state.statusCanChangeAutomatically = false;
        }
    });
    
})(woServices);