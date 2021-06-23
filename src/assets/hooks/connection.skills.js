(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.Skills, (e) => {
        state.skills = [];
        Object.keys(e.Data).forEach(x => {
            var skill = e.Data[x];
            state.skills.push(skill);
        });
    });
    
})(woServices);