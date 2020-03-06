(function(services) {
    var store = services.Store;
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;

    
    hooks.Register(events.Connection.CurrentChats, (e) => {
        var chats = e.Data;
        state.chats = services.ChatFactory.FromChatting(chats, state.sites, state.users);
        state.activeChatCount = Object.keys(state.chats).length; 
    });


    hooks.Register(events.Connection.ChatClosed, (e) => {
        var data = e.Data;
        var chat = state.chats.find((v) => v.ChatUID == data);
        if(chat != null) {
            if(state.currentChat.ChatUID == chat.ChatUID) {
                hooks.Call(events.Connection.CurrentChatClosed);
                state.currentChat.Closed = true;
            }

            Object.keys(state.chatMessages).forEach((v) => {
                if(v == chat.Number)
                {
                    Vue.delete(state.chatMessages, v);
                }
            });

            var idx = state.chats.indexOf(chat);
            state.chats.splice(idx, 1);

            state.activeChatCount = Object.keys(state.chats).length;
        }
    });

    hooks.Register(events.Connection.ChatRequested, (e) => {
        var data = e.Data;
        var info = data.split(":");
        var chatNum = info[0];
        var domain = info[1];
        var visitorName = info[2];
        var dept = info[3];
        state.preRenderedChats[chatNum] = {visitorName, domain, dept};
    });

    hooks.Register(events.Connection.ChatChanged, (e) => {
        var data = e.Data;
        var newChat = state.preRenderedChats[data.Number];
        if (newChat != null) {
            
            var doesExist = state.chats.find(x => x.ChatUID == data.ChatUID);
            if(doesExist != null) {return;}
            
            var chat = services.ChatFactory.FromChatChangedNew(data, newChat, state.sites, state.users);
            state.chats.push(chat);
            state.activeChatCount = Object.keys(state.chats).length;
            Vue.delete(state.preRenderedChats, data.Number);
            hooks.Call(events.Connection.NewChat, chat);
        } else {
            var oldChat = state.chats.find((v) => v.ChatUID == data.ChatUID);
            if(oldChat != null) {services.ChatFactory.FromChatChangedOld(data, oldChat, state.sites, state.users);}
            else {
                var site = state.sites[data.SiteKey];
                var chat = services.ChatFactory.FromChatChangedNew(data, {
                    visitorName: data.VisitorName, domain: site.Domain 
                }, state.sites, state.users);
                state.chats.push(chat);
                state.activeChatCount = Object.keys(state.chats).length;
                hooks.Call(events.Connection.NewChat, chat);
            }
        }
    });

    hooks.Register(events.Connection.ChatMessage, (e) => {
        var msg = e;
        var chatBelongingTo = state.chats.find((v) => v.Number == msg.Header);
        if(chatBelongingTo == null) {
            return;
        }

        if (chatBelongingTo.TalkingToClientConnection == 0) {
            hooks.Call(events.Chat.MessageFromWaitingChat, {name:chatBelongingTo.Name, msg, chat:chatBelongingTo});
        }


        var chatId = chatBelongingTo.ChatUID;
        var messages = state.chatMessages[chatId];
        if(messages == null) {state.chatMessages[chatId] = [];}

        var suggestionTag = "<Suggest>";
        var suggestionEndingTag = "</Suggest>";

        var message;
        var anySuggestions = msg.Data.indexOf(suggestionTag);
        if(anySuggestions != -1) {
            var endingSuggestion = msg.Data.indexOf(suggestionEndingTag)
            var suggestion = msg.Data.substring(anySuggestions + suggestionTag.length, endingSuggestion);
            hooks.Call(events.Chat.SuggestionFromServer, suggestion);
            message = { code:0, msg:msg.Data.substring(0, anySuggestions), date: getDate(new Date())};
        } else {
            message = { code:0, msg:msg.Data, date: getDate(new Date())};
        }

        state.chatMessages[chatId].push(message);
        state.chatMessages = Copy(state.chatMessages);
        

        var hasCurrentChat = Object.keys(state.currentChat).length != 0;
        if(hasCurrentChat) {
            if(state.currentChat.ChatUID == chatId) {
                state.currentChatMessages = Copy(state.chatMessages[chatId]);
                hooks.Call(events.Chat.ScrollChat);
            }
        }
    });       

    hooks.Register(events.Connection.TransferConfirmed, (e) => {
        var chat = state.chats.find(x => Number(x.Number) == Number(e.Data));

        if(chat) {
            var msg = {
                code: 101,
                date: new Date().toLocaleTimeString(),
                msg: `Chat acquired from ${state.aquiringChatFrom}`
            };

            state.chatMessages[chat.ChatUID].push(msg)
            state.currentChatMessages.push(msg);
    
            state.aquiringChatFrom = "";
            hooks.Call(events.Chat.ScrollChat);
        }
    });


    hooks.Register(events.Connection.ChatAcquired, (e) => {
        var split = e.Data.split(":");
        var chatNumber = split[0];
        var opName = split[1];
        
        if(Number(chatNumber) == Number(state.currentChat.Number)) {
            var chat = state.chats.find(x => Number(x.Number) == Number(chatNumber));

            var msg = {
                code: 101,
                date: new Date().toLocaleTimeString(),
                msg: `Chat has been acquired by ${opName}`
            };

            state.chatMessages[chat.ChatUID].push(msg)
            state.currentChatMessages.push(msg);
            hooks.Call(events.Chat.ScrollChat);
        }
    });



    hooks.Register(events.Connection.CurrentVisitorUploadedFile, (e) => {
        var chatBelongingTo = state.chats.find((v) => v.Number == e.Header);
        if(chatBelongingTo == null) {return;}

        
        var chatId = chatBelongingTo.ChatUID;

        var msg = {code:0, msg:e.Data, date: getDate(new Date()), isLink: true};
        
        if(state.chatMessages[chatId] == null) {state.chatMessages[chatId] = [];}
        state.chatMessages[chatId].push(msg);
        state.chatMessages = Copy(state.chatMessages);

        var hasCurrentChat = Object.keys(state.currentChat).length != 0;

        if(hasCurrentChat) {
            if(state.currentChat.ChatUID == chatId) {
                state.currentChatMessages = Copy(state.chatMessages[chatId]);
                hooks.Call(events.Chat.ScrollChat, "");
            }
        }
    });

    hooks.Register(events.Connection.CurrentChat, (e) => {
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

            services.WhosOnConn.StopTypingStatus(state.currentChat.Number);
            services.WhosOnConn.GetVisitorDetail(siteKey, ip, sessId, chatId);
        }
    });

    
    hooks.Register(events.Connection.PreChatSurvey, (e) => {
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
             hooks.Call(events.Chat.PreChatSurveysLoaded);
         }   
     });

    hooks.Register(events.Connection.MonitoredChat, (info) => {
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
                hooks.Call(events.Chat.PreChatSurveysLoaded);
            }
        });
    });

    hooks.Register(events.Connection.ChatAccepted, (acceptedChat) => {
        var data = acceptedChat.Data;
        var split = data.split(":");
        var chatId = split[0];
        
        store.commit("chatAccepted", chatId);
    });

    
    hooks.Register(events.Connection.MonitoredWhisper, (whisper) => {
        var info = whisper.Header.split(":");
        var chatNum = info[0];
        var opName = info[1];

        var chatBelongingTo = state.chats.find((v) => v.Number == chatNum);
        if(chatBelongingTo == null) {
            return;
        }

        
        var message = { code:1, msg:whisper.Data, date: getDate(new Date()), isWhisper: true, Name: opName};
        
        if(state.chatMessages[chatBelongingTo.ChatUID] == null) {state.chatMessages[chatBelongingTo.ChatUID] = [];}
        state.chatMessages[chatBelongingTo.ChatUID].push(message);
        state.chatMessages = Copy(state.chatMessages);

        var hasCurrentChat = Object.keys(state.currentChat).length != 0;
        if(hasCurrentChat) {
            if(state.currentChat.ChatUID == chatBelongingTo.ChatUID) {
                state.currentChatMessages = Copy(state.chatMessages[chatBelongingTo.ChatUID]);
                hooks.Call(events.Chat.ScrollChat);
            }
        }
    });

    hooks.Register(events.Connection.MonitoredOpChatMessage, (message) => {
        var info = message.Header.split(":");
        var chatNum = info[0];
        var name = info[1];

        var chat = state.chats.find(v => v.Number == chatNum);

        var chatObject = {
            code : 1,
            date : getDate(new Date()),
            msg : message.Data
        }
        if(state.chatMessages[chat.ChatUID] == null) {state.chatMessages[chat.ChatUID] = [];}
        state.chatMessages[chat.ChatUID].push(chatObject);
        state.currentChatMessages.push(chatObject);

    });

    hooks.Register(events.Connection.MonitoredVisitorChatMessage, (message) => {
        var info = message.Header.split(":");
        var chatNum = info[0];
        var name = info[1];
        hooks.Call(events.Connection.ChatMessage, {Header:chatNum, Data:message.Data});
    });

    hooks.Register(events.Connection.ListeningClient, (data) => {
        var info = data.Header.split(":");
        var chatNumber = info[0];
        var chatuid = info[1];

        var chat = state.chats.find(x => x.ChatUID == chatuid);

        if(state.chatMessages[chatuid] == null) {
            connection.GetPreviousChat(chat.SiteKey, chatuid);
        } else {

            if(chat.TalkingToClientConnection == state.currentConnectionId || chat.BeingMonitoredByYou) {return;}

            state.chatMessages[chatuid].push({
                date: new Date(),
                code: 1,
                msg: data.Data
            });
            state.chatMessages = Copy(state.chatMessages);
        }
    });
    
    hooks.Register(events.Connection.ListeningVisitor, (data) => {
        var info = data.Header.split(":");
        var chatNumber = info[0];
        var chatuid = info[1];

        var chat = state.chats.find(x => x.ChatUID == chatuid);

        if(state.chatMessages[chatuid] == null) {
            connection.GetPreviousChat(chat.SiteKey, chatuid);
        } else {
            if(chat.TalkingToClientConnection == state.currentConnectionId || chat.BeingMonitoredByYou) {return;}

            hooks.Call(events.Connection.ChatMessage, {Header:chatNumber, Data:data.Data});
        }
    });

    hooks.Register(events.Connection.PreviousChat, (e) => {
        var chat = state.chats.find(x => x.ChatUID == e.Data.ChatUID);

        if(chat) {
            state.chatPreSurveys[chat.Number] = e.Data.PreChatSurvey;
            state.chatPreSurveys = Copy(state.chatPreSurveys);

            state.chatMessages[chat.ChatUID] = e.Data.Lines;
            state.chatMessages = Copy(state.chatMessages);
        }
    });

})(woServices);