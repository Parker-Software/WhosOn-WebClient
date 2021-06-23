(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    var store = services.Store;

    hooks.register(hook.Connection.UserSession, (e) => {
        state.t = e.Data;
        store.commit("saveLoginDetails", {
            userName: state.userName,
            t: state.t,
            department: state.department
        });
    });


})(woServices);