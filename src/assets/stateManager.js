(function(services) {
    
    class StateManager {
        constructor() {
            var hooks = services.Hooks;
            var connEvents = services.HookEvents.Connection;
            var homeView = document.getElementById(services.Store.state.homeViewName);
            var loginView = document.getElementById(services.Store.state.loginViewName);

            homeView.style.display = "none";

            hooks.Register(connEvents.LoggedIn, () => {                       
                loginView.style.display = "none";
                homeView.style.display = "block";
            });
        };   
    }

    services.Add("StateManager", new StateManager());
})(woServices);