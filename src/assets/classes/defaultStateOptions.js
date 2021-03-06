woServices.Add("DefaultState", function(){ 
    return {
        appTitle: "WhosOn",

        serverBuild: null,

        registeredUser: null,

        serverUID: null,

        version: "$version",

        lang: "en",

        platform: "WebClient",

        key: "3yhqII6Zntve73GngYJQCbwADEKUty03",

        discoveryAddress: "https://discoveryfuncs.azurewebsites.net/api/Discover",

        webChartsURL: null,

        chatURL: null,

        userName: null,

        t: null,

        department: "dev",

        loggedIn: false,

        users: [],

        userInfo: null,

        currentStatus: 0,

        statusCanChangeAutomatically: true,

        aquiringChatFrom: "",

        currentChat: {},

        currentChatSite: {},

        currentConnectionId: null,

        preRenderedChats: [],

        currentChatMessages: [],

        currentChatPreSurveys: [],

        crmURL: null, 

        selectedOperatorToOperatorUser: null,

        currentOperatorChatMessages: [],

        operatorMessages: {},

        visitors: [],

        visitorDetail: {},

        chats: [],

        chatMessages: {},

        chatPreSurveys: {},

        uploadedFiles: [],

        missedChats: [],

        settings: {
            Theme: 0,
            AutoAwayEnabled: true,
            AutoAwayMins: 5,
            AutoLogoutEnabled: false,
            AutoLogoutMins: 30,
            ShowNotifications: true,
            ShowNotificationsVisitors: false,
            ShowSuggestions: true,
            ShowAutoResponse: true,
            ShowEmoji: true,
            ShowOtherUsersChats: true,
            UILang: "en",
            Greeting: "Good %TimeOfDay% %Name%. My name is %MyName% how can I help you?",
            TransferMessage: "Please pick up the chat session for visitor %Name%.",
            ListenModeActive: false
        },

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
        
        sites: {},

        sitesVisitors: {},

        skills: [],

        cannedResponses: [],

        cannedResponsesTree: {},

        openingMessage: null,

        settingsPortalAddress: null,

        loginViewName: "loginview",
        homeViewName: "homeview",
        connectingViewName: "connectingview"
    };
});