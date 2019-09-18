(function(){
    class Authentication {

        constructor() {
            var self = this;

            self._connection = woServices.WhosOnConn;
            self._state = woServices.Vue._state;

            self._authString = self._state.authString;
            self._version = self._state.version;
            self._lang = self._state.lang;
            self._platform = self._state.platform;
        }


        Login(userName, password, displayName, dept) {
            var self = this;

            self._connection.Login(
                self._authString,
                displayName,
                dept,
                "",
                self._version,
                "0",
                self._lang,
                self._platform,
                userName,
                password
            )
        }

        LogOut() {

        }
    }

    woServices.Add("Authentication", new Authentication());
})();