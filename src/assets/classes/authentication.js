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
            var loginStatus = 0;
            if (this._state.currentStatus && this._state.currentStatus > 0) {
                loginStatus = this._state.currentStatus;
                this._state.statusCanChangeAutomatically = false;
            } else if (this._state.settings.StartAway) {
                loginStatus = 3;
                this._state.currentStatus = 3;
                this._state.statusCanChangeAutomatically = false;
            }

            this._connection.login(
                "",
                "",
                dept,
                "",
                this._version,
                loginStatus,
                this._lang,
                this._platform,
                userName,
                password,
                this._key
            );
        }

        LoginAsSession(userName, token) {
            var loginStatus = 0;
            if (this._state.currentStatus && this._state.currentStatus > 0) {
                loginStatus = this._state.currentStatus;
                this._state.statusCanChangeAutomatically = false;
            } else if (this._state.settings.StartAway) {
                loginStatus = 3;
                this._state.currentStatus = 3;
                this._state.statusCanChangeAutomatically = false;
            }

            this._connection.authenticateBySession(
                userName,
                token,
                this._key
            );
        }

        LogOut() {

        }
    }

    services.Add("Authentication", new Authentication());
})(woServices);