woServices.Add("DefaultState", function(){ 
    return {
        serverUID: null,
        version: "0.1",
        lang: "en",
        platform: "WebClient",
        connectionAddress: "ws://192.168.10.152:8013",
        settingsPortalURL: "http://192.168.10.152/settings",
        webChartsURL: null,
        chatURL: null,
        userName: null,
        password: null,
        department: "dev",
        loggedIn: false,
        users: [],
        userInfo: null,
        currentStatus: 0,
        currentChat: {},
        currentConnectionId: null,
        preRenderedChats: [],
        currentChatMessages: [],
        currentChatPreSurveys: [],
        currentChatTypingstate: false,
        crmURL: null, 
        chats: [],
        chatMessages: {},
        chatPreSurveys: {},
        uploadedFiles: [],
        uploadedFilesSearchResult: [],
        rights: {
            LoginToSettingsPortal: false,
            ViewReports: false,
            ViewDailySummary: false,
            EditLocalSettings: false,
            TakeChats: false,
            SendChatInvites: false,
            RespondToMissedChats: false,
            ChatToOtherOperators: false,
            MonitorChats: false,
            ChangeOwnName: false,
            DeleteChats: false,
            SeeUsersOutsideOfOwnDepartment: false,
            TransferChatsToOutsideOwnDepartment:false,
            CreateTickets: false,
            StartVideoChats: false,
            UserToUserStoredInDatase: false,
            StartRemoteControl: false,
            SingleUseFile: 0,
            SuperAdmin: false,
            Invisible: false
        },
        sites: null,
        skills: [],
        cannedResponses: [],
        cannedResponsesTree: {},
        settingsPortalAddress: null,
        loginViewName: "loginview",
        homeViewName: "homeview",
        connectingViewName: "connectingview"
    };
});