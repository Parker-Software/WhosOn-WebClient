(function(services) {
    class WhosOnConnection {
        constructor() {
            var self = this;

            self.Socket = services.Socket;

            var hooks = services.Hooks;
            var socketEvents = services.HookEvents.Socket;
            var serverEvents = services.HookEvents.Connection;

            hooks.Register(socketEvents.Opened, (e) => {
                hooks.Call(serverEvents.Connected, e);
            });

            hooks.Register(socketEvents.Message, (e) => {
                var data = JSON.parse(e);
                console.log(data);

                var validMessageType = false;
                Object.keys(serverEvents).forEach((v) => {
                    var item = serverEvents[v];
                    if(item == data.EventName) {
                        validMessageType = true;
                    }
                });

                if(validMessageType == false) 
                    console.log(`Unhandled message - ${data.EventName}`); 
                else {
                    hooks.Call(data.EventName, data);
                }
            })

            hooks.Register(socketEvents.Closed, (e) => {
                hooks.Call(serverEvents.Disconnected, e);
            });

            hooks.Register(socketEvents.Error, (e) => {
                hooks.Call(serverEvents.Disconnected, e);
            });
        }

        Connect(address) {
            var self = this;
            self.Socket.Connect(address);
        }

        Login(auth, displayName, department, phone, version, status, lang, platform, userName, password) {
            var self = this;

            self.Socket.Send("login", [
                auth, displayName, department, phone, version, status, lang, userName, password, platform
            ]);
        }

        Logout() {
            var self = this;

            self.Socket.Send("close", null);
        }

        Disconnect() {
            var self = this;

            self.Socket.Close();
        }
    }
    woServices.Add("WhosOnConn", new WhosOnConnection());
})(woServices);