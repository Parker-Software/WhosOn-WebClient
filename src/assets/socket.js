(function(){
    class Socket {
        constructor() {
            var address = window.location.hostname;
            var connAddress =`ws://${address}:8013`;
            console.log(`connecting to ${connAddress}`);
            var _socket = new WebSocket(connAddress);
        }
    }

    woServices.Add("Socket", new Socket());
})();