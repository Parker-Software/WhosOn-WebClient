(function(services) {
    class StateManager {
        constructor() {
            var hooks = services.Hooks;
            var socketEvents = services.HookEvents.Socket;
            var connEvents = services.HookEvents.Connection;
            var homeView = document.getElementById(services.Store.state.homeViewName);
            var loginView = document.getElementById(services.Store.state.loginViewName);
            var connectingView = document.getElementById(services.Store.state.connectingViewName);
            
            loginView.style.display = "none";
            homeView.style.display = "none";

            hooks.Register(connEvents.LoggedIn, () => { 
                loginView.style.display = "none";   
                connectingView.style.display = "none"; 
                homeView.style.display = "block";
            });

            hooks.Register(socketEvents.Opened, (e) => {
                connectingView.style.display = "none";                  
                loginView.style.display = "block";
            });

            hooks.Register(socketEvents.Error, (e) => {
                homeView.style.display = "none";
                loginView.style.display = "none";   
                connectingView.style.display = "flex"; 
            }); 
            
            hooks.Register(socketEvents.Closed, (e) => {
                homeView.style.display = "none";
                loginView.style.display = "block"; 
            });
        };   
    }

    services.Add("StateManager", new StateManager());
})(woServices);