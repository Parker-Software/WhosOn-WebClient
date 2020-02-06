(function(services){
    class Socket {
        constructor() {
            var self = this;

            self.Hooks = services.Hooks;
            self.SocketEvents = services.HookEvents.Socket;

            self.Connected = false;
            var address = window.location.hostname;
            self._connAddress =`ws://${address}:8013`;
        }

        Connect(address) {
            var self = this;
            var addressToConnectTo = address || self._connAddress;
            try {
                self._socket = new WebSocket(addressToConnectTo);
            } catch(ex) {
                console.log(`Web Socket Exception ${ex}`);
            }

            self._socket.onopen = (e) => {
                self.Connected = true;
                self.Hooks.Call(self.SocketEvents.Opened, e);
            }

            self._socket.onmessage = (e) => {
                self.Hooks.Call(self.SocketEvents.Message, e.data);
            }

            self._socket.onclose = (e) => {
                self.Connected = false;
                self.Hooks.Call(self.SocketEvents.Closed, e);
            }

            self._socket.onerror = (e) => {
                self.Hooks.Call(self.SocketEvents.Error, e);
            }
        }

        Send(cmdName, params) {
            var self = this;
            var msg = {
                "Command": `${cmdName}`,
                "Parameters" : params
            };
            self._socket.send(JSON.stringify(msg));
        }

        Close() {
            var self = this;
            self._socket.close(1000, "Socket Closing");
        }
    }

    services.Add("Socket", new Socket());
})(woServices);