(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.ChatMessage, (e) => {
        var msg = e;
        var chatBelongingTo = state.chats.find((v) => v.Number == msg.Header);
        if(chatBelongingTo == null) {
            return;
        }

        if (chatBelongingTo.TalkingToClientConnection == 0) {
            hooks.Call(
                hook.Chat.MessageFromWaitingChat,
                {
                    name:chatBelongingTo.Name,
                    msg,
                    chat:chatBelongingTo
                }
            );
        }


        var chatId = chatBelongingTo.ChatUID;
        var messages = state.chatMessages[chatId];
        if (messages == null) {state.chatMessages[chatId] = [];}
        var message = { 
            code: 0,
            msg: msg.Data,
            date: getDate(new Date())
        };


        var suggestionTag = "<Suggest>";
        var suggestionEndingTag = "</Suggest>";
        var anySuggestions = msg.Data.indexOf(suggestionTag);

        if (anySuggestions != -1) {
            var endingSuggestion = msg.Data.indexOf(suggestionEndingTag)
            var suggestion = msg.Data.substring(
                anySuggestions + suggestionTag.length,
                endingSuggestion
            );

            if (chatId == state.currentChat.ChatUID) 
            {
                hooks.Call(
                    hook.Chat.SuggestionFromServer,
                    suggestion
                );
            } 
            else 
            {
                if (!chatBelongingTo.SavedInputText) {
                    chatBelongingTo.SavedInputText = suggestion;
                }
            }

            message = {
                code: 0,
                msg: msg.Data.substring(0, anySuggestions),
                date: getDate(new Date())
            };
        }

        state.chatMessages[chatId].push(message);
        state.chatMessages = Copy(state.chatMessages);
        
        var hasCurrentChat = Object.keys(state.currentChat).length != 0;
        if(hasCurrentChat) {
            if(state.currentChat.ChatUID == chatId) {
                state.currentChatMessages = Copy(state.chatMessages[chatId]);
                hooks.Call(hook.Chat.ScrollChat);
            }
        }
    }); 
})(woServices);