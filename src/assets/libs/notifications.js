(function(services) {
    class Notifications {
        constructor() {
            var self = this;


            self.NotficationsAllowed = false;

            if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    self.NotficationsAllowed = true;
                }
                else if (Notification.permission !== 'denied') {
                    Notification.requestPermission(function (permission) {
                        if (permission === "granted") {
                            self.NotficationsAllowed = true;
                        }
                    });
                }
            } 
        }

        CreateNotification(title, text, onclickFunc, timeToClose) {
            var self = this;

            if(timeToClose == null) timeToClose = -1;

            if(self.NotficationsAllowed) {
                var notification = new Notification(title, { body: text, icon: "/assets/images/128x128.png" });

                if(onclickFunc != null) {
                    notification.onclick = onclickFunc;
                }

                if(timeToClose != -1) {
                    setTimeout(() => {
                        notification.close.bind(notification);
                    }, timeToClose);
                }
            }
        }
    }

    services.Add("Notifications", new Notifications());
})(woServices);