(function(services) {
    var HookEvents = {
        Socket: {
            Opened: "socket.opened",
            Closed: "socket.closed",
            Message: "socket.message",
            Error: "socket.error",
            AckTimer: "socket.ack.timer.elapsed"
        },
        Connection: {            
            Connected: "socket.opened",
            Disconnected: "socket.closed",
            ConnectionError: "socket.error",
            UserSession: "connection.usersession",
            LoggedIn: "connection.connected",
            UserInfo: "connection.user",
            UserSites: "connection.sites",
            UserSitesNew: "connection.sitesdata",
            CurrentUsersOnline: "connection.clients",
            CurrentChats: "connection.chatting",
            MissedChats: "connection.missedchats",
            Skills: "connection.skills",
            UploadedFiles: "connection.uploadedfiles",
            CannedResponses: "connection.cannedresponses",
            FromOperator: "connection.fromclient",
            OperatorTyping: "connection.c1",
            OperatorTypingStopped: "connection.c0",
            UserChanged: "connection.clientevent",
            UserDisconnecting: "connection.clientremove",
            ChatChanged: "connection.chatchanged",
            ChatClosed: "connection.chatclosed",
            ChatRequested: "connection.chat",
            ChatAccepted: "connection.chataccepted",
            ForcedChatAccept: "connection.acceptchat",
            PreChatSurvey: "connection.prechatsurvey",
            NewChat: "connection.newchat",
            MessageFromServer: "connection.msg",
            CurrentChatClosed: "connection.currentChatClosed",
            CurrentChat: "connection.currentchat",
            ChatTransfered: "connection.transfer",
            ChatMessage: "connection.message",
            VisitorTyping: "connection.1",
            VisitorTypingOff: "connection.0",
            CurrentVisitorUploadedFile: "connection.fileupload",
            FileUploaded: "connection.fileuploaded",
            MonitoringSuccessful: "connection.monitoring",
            MonitoredChat: "connection.monitoredchat",
            MonitoredOpChatMessage: "connection.monitorc",
            MonitoredVisitorChatMessage: "connection.monitorv",
            MonitoredOperatorTyping: "connection.mc1",
            MonitoredOperatorTypingOff: "connection.mc0",
            MonitoredVisitorTyping: "connection.m1",
            MonitoredVisitorTypingOff: "connection.m0",
            MonitoredWhisper: "connection.whisper",
            MonitoringStopped: "connection.monitorstop",
            PreviousChats: "connection.chats",
            PreviousChat: "connection.prevchat",
            ChatCallbackStatus: "connection.chatcallbackevent",
            CannedResponseUpdated: "connection.cannedresponseupdated",
            CannedResponseDeleted: "connection.cannedresponsedeleted",
            UserPhoto: "connection.userphoto",
            MonthSummary: "connection.monthsummary",
            DailySummary: "connection.ds",
            PasswordChanged: "connection.passwordchanged",
            Error: "connection.error",
            Visitor: "connection.visitor",
            OperatorChat: "connection.clientchat",
            OperatorLink: "connection.linkfromclient",
            SiteVisitors: "connection.ct",
            ChatAcquired: "connection.chataquired",
            TransferConfirmed: "connection.transferconfirmed",
            ListeningClient: "connection.listenc",
            ListeningVisitor: "connection.listenv",
            MissedChat: "connection.missedchat",
            MissedChatClosed: "connection.missedchatclosed",
            Status: "connection.status",
            VisitorDetails: "connection.visitdetailchat",
            Ack: "connection.ack",
            AckFailed: "connection.ack.failed"
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
            WrapUpCompleted: "home.chat.WrapUpCompleted",
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
    
    services.Add("HookEvents", HookEvents);
})(woServices);