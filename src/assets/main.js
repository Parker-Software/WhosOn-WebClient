(function(){
    class Main {
        constructor(rdyCallback) {
            var self = this;

            self._state = woServices.Vue._state;
            self._connection = woServices.WhosOnConn;
            self._auth = woServices.Authentication;

            self._connection.Connect(self._state.connectionAddress);

            self._connection.On("Connected", (e) => {
               if(rdyCallback != null) rdyCallback(); 
            });

            self._connection.On("LoggedIn", (e) => {
                console.log("Logged Into WhosOn");
            });

            self._connection.On("ChatClosed", (e) => {

            });
        }
    }

    var main = new Main(() => {
        woServices.Authentication.Login("Jamie", "pslt0pmans", "Jamie", "Dev");
    });
})();