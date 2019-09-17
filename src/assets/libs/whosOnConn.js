(function() {
    class WhosOnConnection extends EventEmitter {
        constructor() {
            super();

            var self = this;
            self.Socket = woServices.Socket;
            self.Socket.On("Opened", (e) => {
                self.Call("Connected", e);
            });

            self.Socket.On("Message", (e) => {
                var data = JSON.parse(e);
                console.log(data);
                switch(data.EventName) {
                    case "connected":
                        self.Call("LoggedIn", data);
                        break;
                    case "msg":
                        self.Call("MessageFromServer", data);
                        break;
                    case "rights":
                        self.Call("UserRights", data);
                        break;
                    case "nameduser":
                        self.Call("UserInfo", data);    
                        break;
                    case "sites": 
                        self.Call("UserSites", data);
                        break;
                    case "clients":
                        self.Call("CurrentUsers", data);
                        break;
                    case "chatting":
                        self.Call("CurrentChats", data);
                        break;
                    case "missedchats":
                        self.Call("MissedChats", data);
                        break;
                    case "skills":
                        self.Call("Skills", data);
                        break;
                    case "uploadedfiles":
                        self.Call("UploadedFiles", data);
                        break;
                    case "cannedresponses":
                        self.Call("CannedResponses", data);    
                        break;
                    case "fromclient":
                        self.Call("FromOperator", data);
                        break;
                    case "c1":
                        self.Call("CurrentOperatorTyping", data);
                        break;
                    case "c0":
                        self.Call("CurrentOperatorTypingStopped", data);
                        break;
                    case "clientevent":
                        self.Call("UserStatusChanged", data);
                        break;
                    case "clientremove":
                        self.Call("UserDisconnecting", data);
                        break;
                    case "chatchanged":
                        self.Call("ChatChanged", data);
                        break;
                    case "chatclosed":
                        self.Call("ChatClosed", data);
                        break;
                    case "chat":
                        self.Call("ChatRequested", data);
                        break;
                    case "chataccepted":
                        self.Call("ChatAccepted", data);
                        break;
                    case "acceptchat":
                        self.Call("ForcedChatAccepted", data);
                        break;
                    case "prechatsurvey":
                        self.Call("PreChatSurvey", data);
                        break;
                    case "currentchat":
                        self.Call("ExistingChat", data);
                        break;
                    case "transfer":
                        self.Call("ChatTransfered", data);
                        break;
                    case "message":
                        self.Call("ChatMessage", data);
                        break;
                    case "1":
                        self.Call("VisitorTyping", data);
                        break;
                    case "0":
                        self.Call("VisitorTypingOff", data);
                        break;
                    case "fileupload":
                        self.Call("CurrentVisitorUploadedFile", data);
                        break;
                    case "fileuploaded":
                        self.Call("FileUploaded", data);    
                        break;
                    case "monitoring":
                        self.Call("MonitoringSuccessful", data);
                        break;
                    case "monitoredchat":
                        self.Call("MonitoredChat", data);
                        break;
                    case "monitorc":
                        self.Call("MonitoredOpChatMessage", data);
                        break;
                    case "monitorv":
                        self.Call("MonitoredVisitorChatMessage", data);
                        break;
                    case "mc1":
                        self.Call("MonitoredOperatorTyping", data);
                        break;
                    case "mc0":
                        self.Call("MonitoredOperatorTypingOff", data);
                        break;
                    case "m1":
                        self.Call("MonitoredVisitorTyping", data);
                        break;
                    case "m0":
                        self.Call("MonitoredVisitorTypingOff", data);
                        break;
                    case "whisper":
                        self.Call("MonitoredWhisper", data);
                        break;
                    case "monitorstop":
                        self.Call("MonitoringStopped", data);
                        break;
                    case "chats":
                        self.Call("PreviousChats", data);
                        break;
                    case "prevchat":
                        self.Call("PreviousChat", data);
                        break;
                    case "chatcallbackevent":
                        self.Call("ChatCallbackStatus", data);
                        break;
                    case "cannedresponseupdated":
                        self.Call("CannedResponseUpdated", data);
                        break;
                    case "cannedresponsedeleted":
                        self.Call("CannedResponseDeleted", data);
                        break;
                    case "userphoto":
                        self.Call("UserPhoto", data);
                        break;
                    case "monthsummary":
                        self.Call("MonthSummary", data);
                        break;
                    case "ds":
                        self.Call("DailySummary", data);
                        break;
                    default:
                        console.log(`Unhandled message - ${data.EventName}`); 
                        break;
                }
            });

            self.Socket.On("Closed", (e) => {
                self.Call("Disconnected", e);
            });

            self.Socket.On("Error", (e) => {
                self.Call("Error", e);
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
})();