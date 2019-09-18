(function(){
    class Main {
        constructor() {
            var self = this;

            var hooks = woServices.Hooks;
            var connEvents = woServices.HookEvents.Connection;
            var auth = woServices.Authentication;

            self._state = woServices.Vue._state;
            self._connection = woServices.WhosOnConn;
            
            self._connection.Connect(self._state.connectionAddress);

            hooks.Register(connEvents.Error, (e) => {
                console.log("Error Occured");
            });

            hooks.Register(connEvents.Connected, (e) => {
                console.log("Connected");

                if(self._state.userName != null && self._state.password != null) {
                    auth.Login(self._state.userName,
                        self._state.password,
                        self._state.displayName,
                        self._state.department);
                }
            });
        }
    }

    var main = new Main();
})();