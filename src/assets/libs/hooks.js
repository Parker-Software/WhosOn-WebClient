(function(services) {
    var HookEvents = {
        Socket: {
            Opened: "socket.Opened",
            Closed: "socket.Closed",
            Message: "socket.Message",
            Error: "socket.Error"
        },
        Connection: {
            Connected: "ConnectionConnected",
            Disconnected: "ConnectionDisconnected",
            Error: "ConnectionError",
            NewChat: "NewChat",
            LoggedIn: "connected",
            MessageFromServer: "msg",
            CurrentUserRights: "rights",
            UserInfo: "user",
            UserSites: "sites",
            CurrentUsersOnline: "clients",
            CurrentChats: "chatting",
            MissedChats: "missedchats",
            Skills: "skills",
            UploadedFiles: "uploadedfiles",
            CannedResponses: "cannedresponses",
            FromOperator: "fromclient",
            CurrentOperatorTyping: "c1",
            CurrentOperatorTypingStopped: "c0",
            UserStatusChanged: "clientevent",
            UserDisconnecting: "clientremove",
            ChatChanged: "chatchanged",
            ChatClosed: "chatclosed",
            ChatRequested: "chat",
            ChatAccepted: "chataccepted",
            ForcedChatAccept: "acceptchat",
            PreChatSurvey: "prechatsurvey",
            CurrentChat: "currentchat",
            ChatTransfered: "transfer",
            ChatMessage: "message",
            VisitorTyping: "1",
            VisitorTypingOff: "0",
            CurrentVisitorUploadedFile: "fileupload",
            FileUploaded: "fileuploaded",
            MonitoringSuccessful: "monitoring",
            MonitoredChat: "monitoredchat",
            MonitoredOpChatMessage: "monitorc",
            MonitoredVisitorChatMessage: "monitorv",
            MonitoredOperatorTyping: "mc1",
            MonitoredOperatorTypingOff: "mc0",
            MonitoredWhisper: "whisper",
            MonitoringStopped: "monitorstop",
            PreviousChats: "chats",
            PreviousChat: "prevchat",
            ChatCallbackStatus: "chatcallbackevent",
            CannedResponseUpdated: "cannedresponseupdated",
            CannedResponseDeleted: "cannedresponsedeleted",
            UserPhoto: "userphoto",
            MonthSummary: "monthsummary",
            DailySummary: "ds"
        },
        Login: {
            SubmitClicked: "login.SubmitClicked"
        },
        Navigation: {
            ButtonClicked: "navigation.ButtonClicked",
            MyStatusClicked: "navigation.MyStatusClicked",
            ChatsClicked: "navigation.ChatsClicked",
            TeamClicked: "navigation.TeamClicked",
            OptionsClicked: "navigation.OptionsClicked"
        },
        Chat: {
            ShowNoActiveChats: "home.chat.ShowNoActiveChats",
            ShowActiveChats: "home.chat.ShowActiveChats",
            ChatClicked: "home.chat.ChatClicked",
            SendMessage: "home.chat.SendMessage",
            AcceptChat: "home.chat.AcceptChat",
            CloseChat: "home.chat.CloseChat",
            PreChatSurveysLoaded: "home.chat.PreChatSurveysLoaded",
            ScrollChat: "home.chat.ScrollChat",
            MonitorChat: "home.chat.MonitorChat",
            TabClicked: "home.chat.TabClicked",
            CRMIFrameChangedSrc: "home.chat.CRMIFrameChangedSrc",
            CRMIFrameLoaded: "home.chat.CRMIFrameLoaded"
        },
        Home: {
            StatusClosed: "home.StatusClosed",
            StatusChanged: "home.StatusChanged"
        }
    }
    
    class Hooks {
        constructor() {
            var self = this;

            self._hooks = [];
        }

        Register(name, callback) {
            var self = this;
            if('undefined' == typeof(self._hooks[name])) self._hooks[name] = [];
            self._hooks[name].push(callback);
        }

        Call(name, args) { 
            var self = this;
            if('undefined' != typeof(self._hooks[name]))
            {
                for(var i = 0; i < self._hooks[name].length; i++)
                {
                    var result = self._hooks[name][i](args);
                    if(typeof(args) != null && result != null) args = result;
                }
            }
            if(typeof(args) != null) return args;
        }
    }

    services.Add("Hooks", new Hooks());
    services.Add("HookEvents", HookEvents);
})(woServices);