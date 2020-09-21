(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    
    hooks.Register(hook.Connection.PreChatSurvey, (e) => {
        var chatInfo = e.Header.split(":");
        e.Header = chatInfo[3]; //[chatInfo[0], chatInfo[1], chatInfo[2], chatInfo[4], chatInfo[3]].join(":"); 

         var msg = e;

         state.chatPreSurveys[msg.Header] = msg.Data;
         state.chatPreSurveys = Copy(state.chatPreSurveys);


         var hasCurrentChat = Object.keys(state.currentChat).length != 0;
         if(hasCurrentChat) {
             if(state.currentChat.Number == msg.Header) {
                 state.currentChatPreSurveys = Copy(state.chatPreSurveys[msg.Header]);
             }
             hooks.Call(hook.Chat.PreChatSurveysLoaded);
         }   
     });
})(woServices);