(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.CurrentUsersOnline, (e) => {
        var users = e.Data.Clients;

        for(var i = 0; i < users.length; i++) {
            var client = users[i];
            client.HasPhoto = true;
            services.WhosOnConn.GetUserPhoto(client.Username);
        }

        state.users = users; 
        var clientUser = state.users.find((v) => v.Username == state.userName);
        if(clientUser != null) {state.currentConnectionId = clientUser.Connection;}
        else {state.isSuperAdmin = true;}
    });
    
})(woServices);