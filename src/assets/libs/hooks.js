(function(services) {
    var HookEvents = {
        Socket: {
            Opened: "socket.Opened",
            Closed: "socket.Closed",
            Message: "socket.Message",
            Error: "socket.Error",
            AckTimer: "socket.AckTimerElapsed"
        },
        Connection: {
            Connected: "ConnectionConnected",
            Disconnected: "ConnectionDisconnected",
            ConnectionError: "ConnectionError",
            CurrentChatClosed: "CurrentChatClosed",
            NewChat: "NewChat",
            LoggedIn: "connected",
            MessageFromServer: "msg",
            CurrentUserRights: "rights",
            UserInfo: "user",
            UserSites: "sites",
            UserSitesNew: "sitesdata",
            CurrentUsersOnline: "clients",
            CurrentChats: "chatting",
            MissedChats: "missedchats",
            Skills: "skills",
            UploadedFiles: "uploadedfiles",
            CannedResponses: "cannedresponses",
            FromOperator: "fromclient",
            OperatorTyping: "c1",
            OperatorTypingStopped: "c0",
            UserChanged: "clientevent",
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
            MonitoredVisitorTyping: "m1",
            MonitoredVisitorTypingOff: "m0",
            MonitoredWhisper: "whisper",
            MonitoringStopped: "monitorstop",
            PreviousChats: "chats",
            PreviousChat: "prevchat",
            ChatCallbackStatus: "chatcallbackevent",
            CannedResponseUpdated: "cannedresponseupdated",
            CannedResponseDeleted: "cannedresponsedeleted",
            UserPhoto: "userphoto",
            MonthSummary: "monthsummary",
            DailySummary: "ds",
            PasswordChanged: "passwordchanged",
            Error: "error",
            Visitor: "visitor",
            OperatorChat: "clientchat",
            OperatorLink: "linkfromclient",
            SiteVisitors: "ct",
            ChatAcquired: "chataquired",
            TransferConfirmed: "transferconfirmed",
            ListeningClient: "listenc",
            ListeningVisitor: "listenv",
            MissedChat: "missedchat",
            MissedChatClosed: "missedchatclosed",
            Status: "status",
            VisitorDetails: "visitdetailchat",
            Ack: "ack",
            AckFailed: "ack.failed"
        },
        Login: {
            SubmitClicked: "login.SubmitClicked"
        },
        Navigation: {
            ButtonClicked: "navigation.ButtonClicked",
            MyStatusClicked: "navigation.MyStatusClicked",
            ChatsClicked: "navigation.ChatsClicked",
            ClosedChatsClicked: "navigation.ClosedChatsClicked",
            TeamClicked: "navigation.TeamClicked",
            OptionsClicked: "navigation.OptionsClicked",
            MonitorClicked: "navigation.MonitorClicked",
            SitesClicked: "navigation.SitesClicked",
            MissedChatsClicked: "navigation.MissedChatsClicked"
        },
        Team: {
            UserClicked: "team.userClicked",
            CloseChatClicked: "team.closeChatClicked",
            MessagedAdded: "team.messagesAdded",
            OtherUserClicked: "team.otherUserClicked",
            NotificationClicked: "team.notificationClicked",
            CannedResponses : {
                Clicked: "team.cannedResponses.Clicked"
            }
        },
        Chat: {
            SuggestionFromServer: "home.chat.SuggestionFromServer",
            SuggestionSent: "home.chat.SuggestionSent",
            SuggestionNotUsed: "home.chat.SuggestionNotUsed",
            HideAll: "home.chat.HideAll",
            ShowNoActiveChats: "home.chat.ShowNoActiveChats",
            ShowActiveChats: "home.chat.ShowActiveChats",
            ChatClicked: "home.chat.ChatClicked",
            SendMessage: "home.chat.SendMessage",
            ChatLeft: "home.chat.ChatLeft",
            CloseChatClicked: "home.chat.CloseChatClicked",
            SoftCloseChatClicked: "home.chat.SoftCloseChatClicked",
            PreChatSurveysLoaded: "home.chat.PreChatSurveysLoaded",
            ScrollChat: "home.chat.ScrollChat",
            TabClicked: "home.chat.TabClicked",
            CRMIFrameChangedSrc: "home.chat.CRMIFrameChangedSrc",
            CRMIFrameLoaded: "home.chat.CRMIFrameLoaded",
            ClickTab: "home.chat.ClickTab",
            SendFileClicked: "home.chat.SendFileClicked",
            PickAFileClosed: "home.chat.PickAFileClosed",
            CannedResponsesClicked: "home.chat.CannedResponsesClicked",
            CannedResponsesClosed: "home.chat.CannedResponsesClosed",
            RequestedFileUpload: "home.chat.RequestedFileUpload",
            EmojiMenuClicked: "home.chat.EmojiMenuClicked",
            MessageFromWaitingChat: "home.chat.MessageFromWaitingChat",
            TransferClicked: "home.chat.TransferClicked",
            ChatTransfered: "home.chat.ChatTransfered",
            WrapUpClicked: "home.chat.WrapUpClicked",
            WrapUpNotCompleted: "home.chat.WrapUpNotCompleted",
            CloseChatFinalised: "home.chat.CloseChatFinalised",
            AquireChatClicked: "home.chat.AquireChatClicked",
            CannedResponses : {
                Clicked: "chat.cannedResponses.Clicked"
            }
        },
        ClosedChat: {
            CloseChatClicked: "home.closedchat.CloseChatClicked"
        },
        ChatItem: {
            AcceptClicked: "chatItem.AcceptClicked",
            MonitorClicked: "chatItem.MonitorClicked",
            ClosedChatClicked: "chatItem.ClosedChatClicked",
        },
        ChatModal: {
            CloseChatConfirmed: "chatModal.CloseChatConfirmed",
            StopMonitoringChatConfirmed: "chatModal.StopMonitoringChatConfirmed",
            SoftCloseChatConfirmed: "chatModal.SoftCloseChatConfirmed"
        },
        FileUploader: {
            FileItemClicked: "fileuploader.FileItemClicked",
            Yes: "fileuploader.Yes",
            Successful: "fileuploader.Successful",
            Failed: "fileuploader.Failed"
        },
        Options: {
            LogoutClicked: "home.options.LogoutClicked",
            TabClicked: "home.options.TabClicked",
            SaveClicked: "home.options.SaveClicked",
            CancelClicked: "home.options.CancelClicked"
        },
        EmojiMenu: {
            Clicked: "emojiMenu.Clicked"
        },
        Home: {
            StatusClosed: "home.StatusClosed",
            StatusChanged: "home.StatusChanged",
            UserImagesNeedUpdating: "home.UserImagesNeedUpdating"
        },
        Transfer: {
            Clicked: "transfer.Clicked"
        },
        Inactivity: {
            Active: "inactivity.active",
            Inactive: "inactivity.inactive",
            ShouldLogOut: "inactivity.shouldLogOut"
        },
        Sites: {
            Clicked: "sites.clicked"
        }
    }
    
    class Hooks {
        constructor() {
            var self = this;
            self._showHookCall = false;
            self._hooks = [];
        }

        Register(name, callback) {
            var self = this;
            if("undefined" == typeof(self._hooks[name])) {self._hooks[name] = [];}
            self._hooks[name].push(callback);
        }

        Call(name, args) { 
            var self = this;
            if(self._showHookCall) {console.log(name);} 
            if("undefined" != typeof(self._hooks[name]))
            {
                for(var i = 0; i < self._hooks[name].length; i++)
                {
                    var result = self._hooks[name][i](args);
                    if(typeof(args) != null && result != null) {args = result;}
                }
            } else {
                console.log(`No hooks registered for - ${name}`);
            }
            if(typeof(args) != null) {return args;}
        }
    }

    services.Add("Hooks", new Hooks());
    services.Add("HookEvents", HookEvents);
})(woServices);