(function(){
    class Socket extends EventEmitter {
        constructor() {
            super();
            var self = this;
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
                self.Call("Opened", e);
            }
            self._socket.onmessage = (e) => {
                self.Call("Message", e.data);
            }
            self._socket.onclose = (e) => {
                self.Connected = false;

                self.Call("Closed", e);
            }
            self._socket.onerror = (e) => {
                self.Call("Error", e);
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