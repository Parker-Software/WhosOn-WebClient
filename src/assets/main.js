(function(){
    class Main {
        constructor() {
            var self = this;

            self._state = woServices.Vue._state;
            self._connection = woServices.WhosOnConn;
            self._auth = woServices.Authentication;

            self._loginView = woServices.LoginView;


            self._loginView.On("Loaded", () => {
                console.log("Login View Was Loaded");
            });

            self._connection.Connect(self._state.connectionAddress);

            self._connection.On("Connected", (e) => {
                if(self._state.userName != null && self._state.password != null) {
                    self._auth.Login(self._state.userName,
                        self._state.password,
                        self._state.displayName,
                        self._state.department);
                }
            });

            self._connection.On("LoggedIn", (e) => {
                console.log("Logged Into WhosOn");
            });

            self._connection.On("ChatClosed", (e) => {

            });
        }
    }

    var main = new Main();
})();