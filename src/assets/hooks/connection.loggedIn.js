(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.LoggedIn, (e) => {
        state.appTitle = e.Data.AppTitle;
        state.serverBuild = e.Data.ServerBuild;
        state.registeredUser = e.Data.RegisteredUser;
        state.serverUID = e.Data.ServerUid;
        state.webChartsURL = e.Data.WebChartsUrl;
        state.chatURL = e.Data.ChatUrl;
    });
    
})(woServices);