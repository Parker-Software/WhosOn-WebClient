(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.MonitoredChat, (info) => {
        var monitoredChat = info.Data;

        Object.keys(state.chats).forEach(key => {
            var chat = state.chats[key];
            chat.IsActiveChat = false;
            
            if(chat.ChatUID == monitoredChat.ChatUID) {
                chat.BeingMonitoredByYou = true;
                chat.IsActiveChat = true;
                state.currentChat = chat;
                state.currentChatSite = state.sites[chat.SiteKey];
                state.chatMessages[chat.ChatUID] = [];
                for(var i = 0; i < monitoredChat.Lines.length; i++) {
                    var line = monitoredChat.Lines[i];
                    var parsedDate = new Date(line.Dated);

                    var isLink = false;
                    if(line.Message.indexOf("<link>") != -1) {
                        isLink = true;
                    }

                    state.chatMessages[chat.ChatUID].push({ code:line.OperatorIndex, msg:line.Message, date: getDate(parsedDate), isLink});
                }
                
                state.currentChatMessages = Copy(state.chatMessages[chat.ChatUID]);
                state.chatMessages = Copy(state.chatMessages);

                state.chatPreSurveys[chat.Number] = [];
                for(var i = 0; i < monitoredChat.PreChatSurvey.length; i++) {
                    var survey = monitoredChat.PreChatSurvey[i];
                    state.chatPreSurveys[chat.Number].push({Name: survey.FieldName, Value: survey.FieldValue});
                }
                state.currentChatPreSurveys = Copy(state.chatPreSurveys[chat.Number]);
                hooks.call(hook.Chat.PreChatSurveysLoaded);
            }
        });
    });

})(woServices);