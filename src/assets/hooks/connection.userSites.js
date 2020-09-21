(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    
    hooks.Register(hook.Connection.UserSites, (e) => {
        var sites = {};
        for (var index = 0; index < e.Data.Sites.length; index++)
        {
            sites[e.Data.Sites[index].SiteKey] = e.Data.Sites[index];
        }
        state.sites = sites; 
    });
    
})(woServices);