(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.CurrentUsersOnline, (e) => {
        var users = e.Data.Clients;
        for(var i = 0; i < users.length; i++) {
            var client = users[i];
            client.HasPhoto = true;
            services.WhosOnConn.getUserPhoto(client.Username);
        }

        state.users = users; 
        var clientUser = state.users.find((v) => v.Username == state.userName);
        if(clientUser != null) {state.currentConnectionId = clientUser.Connection;}
        else {state.isSuperAdmin = true;}
    });
    
})(woServices);