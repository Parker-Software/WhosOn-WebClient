(function(){
    class Socket {
        constructor() {
            var self = this;

            self.Hooks = woServices.Hooks;
            self.SocketEvents = woServices.HookEvents.Socket;

            self.Connected = false;

            var address = window.location.hostname;
            self._connAddress =`ws://${address}:8013`;
        }

        Connect(address) {
            var self = this;
            var addressToConnectTo = address || self._connAddress;
            self._socket = new WebSocket(addressToConnectTo);
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

            self._socket.send(
                JSON.stringify(
                {
                    "Command": `${cmdName}`,
                    "Parameters" : params
                }
            ));
        }

        Close() {
            var self = this;
            self._socket.close(1000, "Socket Closing");
        }
    }

    woServices.Add("Socket", new Socket());
})();