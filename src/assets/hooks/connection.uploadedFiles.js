(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.UploadedFiles, (e) => {
        state.uploadedFiles = e.Data;
    });
    
})(woServices);