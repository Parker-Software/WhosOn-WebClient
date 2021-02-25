(function(services){
    class Authentication {

        constructor() {
            var self = this;

            self._connection = services.WhosOnConn;
            self._state = services.Store.state;

            self._version = self._state.version;
            self._lang = self._state.lang;
            self._platform = self._state.platform;
            self._key = self._state.key;
        }


        Login(userName, password, dept) {
            var self = this;

            var loginStatus = 0;
            if (self._state.currentStatus && self._state.currentStatus > 0) {
                loginStatus = self._state.currentStatus;
                self._state.statusCanChangeAutomatically = false;
            } else if (self._state.settings.StartAway) {
                loginStatus = 3;
                self._state.currentStatus = 3;
                self._state.statusCanChangeAutomatically = false;
            }

            self._connection.Login(
                "",
                "",
                dept,
                "",
                self._version,
                loginStatus,
                self._lang,
                self._platform,
                userName,
                password,
                self._key
            )
        }

        LogOut() {

        }
    }

    services.Add("Authentication", new Authentication());
})(woServices);