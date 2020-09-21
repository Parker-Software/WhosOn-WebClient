(function(services) {
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    var store = services.Store;
    var connection = services.WhosOnConn;

    hooks.Register(hook.Socket.Closed, (e) => {
        if (connection.LoggedOut) {
            sessionStorage.clear();
            store.commit("replaceEntireState", services.DefaultState());
        }
    });
    
})(woServices);