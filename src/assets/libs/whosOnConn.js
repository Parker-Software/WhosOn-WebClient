(function(services) {
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var socketEvents = services.HookEvents.Socket;
    var serverEvents = services.HookEvents.Connection;


    class WhosOnConnection {
        constructor() {
            var self = this;

            self.Socket = services.Socket;

        
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
                    {console.log(`Unhandled message - ${data.EventName}`);} 
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

        Login(auth, displayName, department, phone, version, status, lang, platform, userName, password, apiKey) {
            var self = this;

            self.Socket.Send("login", [
                auth, displayName, department, phone, version, status, lang, userName, password, platform, apiKey
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

        TransferChat(chatNum, connectionIds, message) {
            var self = this;

            if(Array.isArray(connectionIds) == false){
                console.log("ConnectionIds needs to be an array");
                return;
            }

            var connectionsToTransferTo = connectionIds.join(",");

            self.Socket.Send("transfer", [
                chatNum,
                connectionsToTransferTo,
                message
            ]);

            hooks.Call(events.Chat.ChatTransfered, chatNum);
            this.LeaveChat(chatNum);
        }

        TransferChatToDept(chatNum, department, message)
        {
            var self = this;
            self.Socket.Send("transferdept", [
                chatNum,
                department,
                message
            ]);

            hooks.Call(events.Chat.ChatTransfered, chatNum);
            this.LeaveChat(chatNum);
        }

        TransferChatToSkill(chatNum, skillId, message)
        {
            var self = this;
            self.Socket.Send("transferskills", [
                chatNum,
                skillId,
                message
            ]);

            hooks.Call(events.Chat.ChatTransfered, chatNum);
            this.LeaveChat(chatNum);
        }


        LeaveChat(chatNum) {
            var self = this;

            self.Socket.Send("leave", [
                chatNum
            ]);

            hooks.Call(events.Chat.ChatLeft, chatNum);
        }

        MonitorChat(chatNum) {
            var self = this;

            self.Socket.Send("monitor", [
                chatNum
            ]);
        }

        StopMonitoringChat(chatNum) {
            var self = this;

            self.Socket.Send("stopmonitor", [
                chatNum
            ]);
        }

        Whisper(connectionId, chatNum, text) {
            var self = this;

            self.Socket.Send("whisper", [
                connectionId,
                chatNum,
                text
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

        GetSkills() {
            var self = this;
            self.Socket.Send("getSkills", null);
        }

        GetDailySummary() {
            var self = this;
            self.Socket.Send("GetDS");
        }

        GetMonthlySummary(siteKey) {
            var self = this;
            self.Socket.Send("GetMonthSummary", [siteKey]);
        }

        GetPreviousChats(sitekey, date) {
            var self = this;
            self.Socket.Send("GetChats", [
                sitekey,
                date
            ]);
        }

        GetPreviousChat(sitekey, chatid) {
            var self = this;
            self.Socket.Send("GetPrevChat ", [
                sitekey,
                chatid
            ]);
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

        GetVisitorDetail(siteKey, ip, sessionId, chatId) {
            var self = this;

            self.Socket.Send("getchatvisit", [
                siteKey,
                ip,
                sessionId,
                chatId
            ]);
        }

        CompleteWrapUp(siteKey, chatId, value) {
            var self = this;

            self.Socket.Send("ChatWrapUpComplete", [
                siteKey, 
                chatId,
                value
            ]);
        }

        ClientOptions(options) {
            var self = this;

            var newOptions = "";
            Object.keys(options).forEach((k) => {
                newOptions += `${k}=${options[k]}\n`
            });

            self.Socket.Send("ClientOptions", [
                newOptions
            ]);
        }

        ChangePassword(userName, oldpassword, newpassword) {
            var self = this;

            self.Socket.Send("changepassword", [
                userName,
                oldpassword,
                newpassword
            ]);
        }

        StartVisitorEvents() {
            var self = this;
            self.Socket.Send("StartVisitorEvents", null);
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