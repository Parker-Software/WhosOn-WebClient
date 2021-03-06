(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.UserDisconnecting, (e) => {
        var userConn = e.Data;
        var user = state.users.find((v) => v.Connection == userConn);
        if(user != null) {
            var idx = state.users.indexOf(user);
            state.users.splice(idx, 1);
            
            hooks.Call(hook.Home.UserImagesNeedUpdating);
        }
    });
    
})(woServices);