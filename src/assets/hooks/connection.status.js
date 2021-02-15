// handle the server or another operator pushing me to offline
(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.Status, (e) => {
        if (state.currentStatus != e.Data) {
            state.currentStatus = e.Data;
            if (e.Data != 0) state.statusCanChangeAutomatically = false;
        }
    });
    
})(woServices);