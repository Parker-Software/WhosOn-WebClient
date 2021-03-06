(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    
    hooks.Register(hook.Chat.PreChatSurveysLoaded, () => {
        var currentChat = state.currentChat;
        var userName = state.userName;
        var visitorName = state.currentChat.Name;
        var email;
        var hasEmail = state.currentChatPreSurveys.find((v) => v.Name == "Email");
        if(hasEmail != null) {
            email = hasEmail.Value;
        }
        

        state.crmURL = `https://azurecrm.whoson.com/api/Auth?servername=${state.serverUID}&domain=${currentChat.Domain}&source=client&operator=${userName}&id=${currentChat.ChatUID}&name=${visitorName}&emailaddress=${email}&webchartsurl=https://dev3.whoson.com/whosoncharts/`;
        hooks.Call(hook.Chat.CRMIFrameChangedSrc, state.crmURL);
    });

})(woServices);