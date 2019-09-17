(function(){
    class WhosOnEventWatcher {
        constructor() {
            var self = this;
            self._connection = woServices.WhosOnConn;
            self._connection.On("CurrentChats", self.OnCurrentChats);
        }
        
        OnCurrentChats(e) {
            console.log("CurrentChats");
        }
    }

    woServices.Add("EventWatcher", new WhosOnEventWatcher());
})();