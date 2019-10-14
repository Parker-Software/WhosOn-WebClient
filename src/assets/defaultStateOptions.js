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
        rights: null,
        sites: null,
        skills: null,
        cannedResponses: null,
        settingsPortalAddress: null,
        loginViewName: "loginview",
        homeViewName: "homeview",
        connectingViewName: "connectingview"
    };
});