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

            self._connection.Login(
                "",
                "",
                dept,
                "",
                self._version,
                "0",
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