(function (services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var store = services.Store;

    hooks.Register(events.ChatModal.StopMonitoringChatConfirmed, (chatNum) => {
        var chat = state.chats.find((v) => v.Number == chatNum);
        if (chat != null) {
            chat.BeingMonitoredByYou = false;
            chat.IsActiveChat = false;
        }
        state.currentChat = {};
    });


    hooks.Register(events.Chat.RequestedFileUpload, () => {
        state.currentChatMessages.push({
            code: 1,
            msg: "File Upload Request Sent.",
            date: getDate(new Date()),
            isLink: false
        });

        hooks.Call(events.Chat.ScrollChat);
    });


    hooks.Register(events.ChatItem.AcceptClicked, (chatInfo) => {
        var chats = state.chats;
        Object.keys(chats).forEach((key) => {
            var chat = chats[key];
            if (chat.ChatUID == chatInfo.ChatId) {
                chat.IsActiveChat = true;
                chat.BeingMonitoredByYou = false;
                state.currentChat = chat;
                state.currentChatSite = state.sites[chat.SiteKey];

                if (state.chatMessages[chat.ChatUID] != null) {
                    state.currentChatMessages = Copy(state.chatMessages[chat.ChatUID]);
                } else {
                    state.currentChatMessages = Copy([]);
                }

                if (state.chatPreSurveys[chat.Number] != null) {
                    state.currentChatPreSurveys = Copy(state.chatPreSurveys[chatInfo.Number]);
                    hooks.Call(events.Chat.PreChatSurveysLoaded);
                } else {
                    state.currentChatPreSurveys = [];
                }
                services.WhosOnConn.AcceptChat(chatInfo.Number);
                hooks.Call(events.Chat.ClickTab, "conversation");
            } else {
                chat.IsActiveChat = false;
            }
        });
    });

    hooks.Register(events.ChatItem.MonitorClicked, (chatInfo) => {
        var foundChat;
        Object.keys(state.chats).forEach(key => {
            var chat = state.chats[key];
            chat.IsActiveChat = false;
            if (chat.ChatUID == chatInfo.ChatId && chat.BeingMonitoredByYou) {
                foundChat = chat;
            }
        });

        if (foundChat != null) {
            foundChat.IsActiveChat = true;
            state.currentChat = foundChat;
            state.currentChatSite = state.sites[foundChat.SiteKey];

            if (state.chatMessages[foundChat.ChatUID] != null) {
                state.currentChatMessages = Copy(state.chatMessages[foundChat.ChatUID]);
            } else {
                state.currentChatMessages = Copy([]);
            }

            if (state.chatPreSurveys[foundChat.Number] != null) {
                state.currentChatPreSurveys = Copy(state.chatPreSurveys[chatInfo.Number]);
                hooks.Call(events.Chat.PreChatSurveysLoaded);
            } else {
                state.currentChatPreSurveys = [];
            }
            hooks.Call(events.Chat.ClickTab, "conversation");
        } else {services.WhosOnConn.MonitorChat(chatInfo.Number);}
    });

    
    hooks.Register(events.Chat.PreChatSurveysLoaded, () => {
        var currentChat = state.currentChat;
        var userName = state.userName;
        var visitorName = state.currentChat.Name;
        var email;

  
       
            var hasEmail = state.currentChatPreSurveys.find((v) => v.Name == "Email");
            if(hasEmail != null) {
                email = hasEmail.Value;
            }
        

        state.crmURL = `https://whosoncrmfuncs.azurewebsites.net/api/Auth?servername=${state.serverUID}&domain=${currentChat.Domain}&source=client&operator=${userName}&id=${currentChat.ChatUID}&name=${visitorName}&emailaddress=${email}&webchartsurl=https://dev3.whoson.com/whosoncharts/`;
        hooks.Call(events.Chat.CRMIFrameChangedSrc, state.crmURL);
    });

    hooks.Register(events.Chat.SendMessage, (message) => {
        var chatObject = {
            "code" : 1,
            "date" : getDate(new Date()),
            "msg" : message.Text,
            isWhisper: message.Whisper,
        }

        if(chatObject.isWhisper) {
            chatObject.Name = "You"
        }

        if(state.chatMessages[message.ChatId] == null) {state.chatMessages[message.ChatId] = [];}
        state.chatMessages[message.ChatId].push(chatObject);
        state.currentChatMessages.push(chatObject)
        if(message.Whisper != true) {services.WhosOnConn.SendMessage(message.Num, message.Text);} 
        else {services.WhosOnConn.Whisper(message.ToConnection, message.Num, message.Text);} 
        hooks.Call(events.Chat.ScrollChat, "");
    });

    
    hooks.Register(events.Chat.ChatLeft, (num) => {
        state.currentChat = {};

        var chat = state.chats.find(x => x.Number == num);
        if(chat != null) {
            chat.IsActiveChat = false;
        }
    });

})(woServices);