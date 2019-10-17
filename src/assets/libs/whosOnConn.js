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

        AcceptChat(chatNum) {
            var self = this;
            self.Socket.Send("Chat", [
                chatNum
            ]);
        }

        CloseChat(chatNum) {
            var self = this;
            self.Socket.Send("closechat", [
                chatNum
            ]);
        }

        SendMessage(chatNum, message) {
            var self = this;

            self.Socket.Send("sendto", [
                chatNum,
                message
            ]);
        }

        SendTypingStatus(chatNum) {
            var self = this;

            self.Socket.Send("1", [
                chatNum
            ]);
        }

        StopTypingStatus(chatNum) {
            var self = this;

            self.Socket.Send("0", [
                chatNum
            ]);
        }

        GetUserPhoto(userName) {
            var self = this;

            self.Socket.Send("getuserphotos", [
                userName
            ]);
        }

        ChangeStatus(newstatus) {
            var self = this;
            var status = 0;
            switch(newstatus) {
                case "online":
                    status = 0;
                    break;
                case "away":
                    status = 3;
                    break;
                case "brb":
                    status = 2;
                    break;
                case "busy":
                    status = 1;
                    break;
            }

            self.Socket.Send("status", [
                status,
                ""
            ]);
        }

        GetCannedResponses()
        {
            var self = this;
            self.Socket.Send("getcannedresponses");
        }


        GetFiles() {
            var self = this;
            self.Socket.Send("getfiles", null);
        }

        RequestFile(chatNum) {
            var self = this;
            self.Socket.Send("filerequest", [
                chatNum
            ]);
        }

        SendFile(chatNum, fileName, url)
        {
            var self = this;
            var params = [
                chatNum,
                fileName,
                url
            ];
            self.Socket.Send("sendfileto", params);
        }

        Logout() {
            var self = this;
            self.Socket.Close();
        }

        Disconnect() {
            var self = this;
            self.Socket.Close();
        }
    }
    services.Add("WhosOnConn", new WhosOnConnection());
})(woServices);