(function(services) {
    class Inactivity {
        constructor() {
            var self = this;

            self._inactive = null;
            self._logout = null;
        }

        Start(settings) {
            var self = this;

            self.Reset(settings);
            document.onclick = (e) => {
                self.Reset(settings);
            }

            document.onkeypress = (e) => {
                self.Reset(settings);
            }
        }

        Reset(settings) {
            var self = this;
            this.Active();

            if(self.inactive != null) {clearTimeout(self.inactive);}
            if(settings.AutoAwayEnabled) {
                self.inactive = setTimeout(this.SetToAway, Number(settings.AutoAwayMins) * 1000 * 60);
            }

            
            if(self.logout != null) {clearTimeout(self.logout);}
            if(settings.AutoLogoutEnabled) {
                self.logout = setTimeout(this.Logout, Number(settings.AutoLogoutMins) * 1000 * 60);
            }
            
        }

        Active() {
            services.Hooks.call(services.HookEvents.Inactivity.Active);
        }

        SetToAway() {
            services.Hooks.call(services.HookEvents.Inactivity.Inactive);
        }

        Logout() {
            services.Hooks.call(services.HookEvents.Inactivity.ShouldLogOut);
        }
    }
    
    services.Add("Inactivity", new Inactivity());
})(woServices);