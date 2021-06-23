(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.register(hook.Connection.CurrentChat, (e) => {
        var chatInfo = e.Header.split(":");
        var siteKey = chatInfo[0];
        var ip = chatInfo[1];
        var sessId = chatInfo[2];
        var chatId = chatInfo[3];
        var chatNum = chatInfo[4];

        var chat = e.Data;
        var chatUID = e.Data.ChatUID;

        if(state.chatMessages[chatUID] == null || state.chatMessages[chatUID].length <= 0) {
            state.chatMessages[chatUID] = [];
            
            for(var i = 0; i < chat.Lines.length; i++) {
                var line = chat.Lines[i];
                var parsedDate = new Date(line.Dated);

                var isLink = false;
                if(line.Message.indexOf("<link>") != -1) {
                    isLink = true;
                }
                state.chatMessages[chatUID].push({ code:line.OperatorIndex, msg:line.Message, date: getDate(parsedDate), isLink});
            }

            state.chatMessages = Copy(state.chatMessages);
            state.currentChatMessages = Copy(state.chatMessages[chatUID]);
            state.currentChatPreSurveys = typeof(state.chatPreSurveys[chatNum]) !== "undefined" ?
                Copy(state.chatPreSurveys[chatNum]) :
                [];

            services.WhosOnConn.stopTypingStatus(state.currentChat.Number);
            services.WhosOnConn.getVisitorDetail(siteKey, ip, sessId, chatId);
        }
    });

})(woServices);