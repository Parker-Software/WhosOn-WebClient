(function(services){
    class ChatFactory {
        FromChatting(chats, sites, operators) {
            Object.keys(chats).forEach((key) => {
                var chat = chats[key];
                var site = sites[chat.SiteKey];
                chat.SiteName = site.Name; 

                if(chat.TalkingToClientConnection != null && chat.TalkingToClientConnection != 0) { 
                    var op = operators.find((v) => v.Connection == chat.TalkingToClientConnection); 
                    chat.TalkingTo = op.Username; 
                    chat.Status = `Talking to ${chat.TalkingTo}`; 
                } else {
                    chat.Status = chat.WaitedSecs.toFormattedWaitTime();
                }
            });

            return chats;
        }
    }

    services.Add("ChatFactory", new ChatFactory());
})(woServices);