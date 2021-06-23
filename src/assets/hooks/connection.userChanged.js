(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.UserChanged, (e) => {
        var changedUser = e.Data;
        var user = state.users.find((v) => v.Username == changedUser.Username);
        if(user != null) {
            user.Status = changedUser.Status;
            user.Chats = changedUser.Chats;
            user.Admin = changedUser.Admin;
            user.IPAddress = changedUser.IPAddress;
            user.Lang = changedUser.Lang;
            user.MaxChats = changedUser.MaxChats;
            user.Name = changedUser.Name;
            user.Connection = changedUser.Connection;
            if(user.Username == state.userName) {
                state.currentStatus = user.Status;
            }
            hooks.call(hook.Home.UserImagesNeedUpdating);
        } else {
            changedUser.HasPhoto = true;
            state.users.push(changedUser);
            services.WhosOnConn.getUserPhoto(changedUser.Username);
        }
    });
    
})(woServices);