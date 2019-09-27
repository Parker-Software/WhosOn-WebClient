
(function(services) {
    class StoreUpdater {
        constructor() {
            var hooks = services.Hooks;
            var events = services.HookEvents;
            var connEvents = events.Connection;
            var store = services.Store;
            var state = services.Store.state;

            hooks.Register(connEvents.LoggedIn, (e) => {
                services.Store.commit("successfulLogin", e.Data);
            });

            hooks.Register(connEvents.CurrentChats, (e) => {
                services.Store.commit("setChats", e.Data.Chats);
            });

            hooks.Register(connEvents.UserSites, (e) => {
                var sites = {};
                for (var index = 0; index < e.Data.Sites.length; index++)
                {
                    sites[e.Data.Sites[index].SiteKey] = e.Data.Sites[index];
                }
                services.Store.commit("setSites", sites);
            });

            hooks.Register(connEvents.UserInfo, (e) => {
                services.Store.commit("setUserInfo", e.Data.User);
            });

            hooks.Register(connEvents.CurrentUsersOnline, (e) => {
                for(var i = 0; i < e.Data.Clients.length; i++) {
                    var client = e.Data.Clients[i];
                    client.HasPhoto = true;
                    services.WhosOnConn.GetUserPhoto(client.Username);
                }

                services.Store.commit("setCurrentUsers", e.Data.Clients);
            });

            hooks.Register(connEvents.ChatClosed, (e) => {
                services.Store.commit("removeChat", e.Data);
            });

            hooks.Register(connEvents.ChatRequested, (e) => {
                services.Store.commit("addChat", e.Data);
            });

            hooks.Register(connEvents.ChatChanged, (e) => {
                services.Store.commit("chatChanged", e.Data);
            });

            hooks.Register(connEvents.UserStatusChanged, (e) => {
                services.Store.commit("userChanged", e.Data);
            });

            hooks.Register(connEvents.ChatMessage, (e) => {
                services.Store.commit("chatMessage", e);
            });           

            hooks.Register(connEvents.CurrentChat, (e) => {
                var chatInfo = e.Header.split(":");
                var siteKey = chatInfo[0];
                var ip = chatInfo[1];
                var sessId = chatInfo[2];
                var chatId = chatInfo[3];
                var chatNum = chatInfo[4];

                services.Store.commit("currentChat", { chatNum, data: e.Data});
            });

            hooks.Register(connEvents.PreChatSurvey, (e) => {
               var chatInfo = e.Header.split(":");
               e.Header = chatInfo[3]; //[chatInfo[0], chatInfo[1], chatInfo[2], chatInfo[4], chatInfo[3]].join(":"); 
               services.Store.commit("preChatSurvey", e);     
            });

            hooks.Register(connEvents.VisitorTyping, (e) => {
                services.Store.commit("visitorTyping", e)
            });

            hooks.Register(connEvents.VisitorTypingOff, (e) => {
                services.Store.commit("visitorTypingOff", e)
            });

            hooks.Register(events.Chat.AcceptChat, (chatInfo) => { 
                var chats = state.chats;
                Object.keys(chats).forEach((key) => {
                    var chat = chats[key];
                    if(chat.ChatUID == chatInfo.ChatId) {
                        chat.IsActiveChat = true;
                        state.currentChat = chat;

                        if(state.chatMessages[chat.ChatUID] != null) {
                            state.currentChatMessages = JSON.parse(JSON.stringify(state.chatMessages[chat.ChatUID]));
                        } else {
                            state.currentChatMessages = JSON.parse(JSON.stringify([]));
                        }

                        if (state.chatPreSurveys[chat.Number] != null) {
                            state.currentChatPreSurveys = JSON.parse(JSON.stringify(state.chatPreSurveys[chatInfo.Number]));
                            hooks.Call(events.Chat.PreChatSurveysLoaded);
                        } else {
                            state.currentChatPreSurveys = {};
                        }
                        services.WhosOnConn.AcceptChat(chatInfo.Number);
                        hooks.Call(events.Chat.ClickTab, "conversation");
                        hooks.Call(events.Chat.ScrollChat, "");
                    } else {
                        chat.IsActiveChat = false;
                    }
                });

            });

            hooks.Register(events.Chat.CloseChat, (chatNum) => {
                services.WhosOnConn.CloseChat(chatNum);                   
                var currentChat = state.currentChat; 
                state.currentChat = {};        

                state.chats.forEach(function(chat){
                    if (chat.TalkingTo == woServices.Store.state.userName && chat.ChatUID != currentChat.ChatUID) {
                        hooks.Call(events.Chat.AcceptChat, {"Number": chat.Number, "ChatId": chat.ChatUID});
                    }
                })

            });

            
            hooks.Register(events.Chat.PreChatSurveysLoaded, () => {
                var currentChat = state.currentChat;
                var userName = state.userName;
                var visitorName = state.currentChat.Name;
                var email = state.currentChatPreSurveys.find((v) => v.Name == "Email").Value;

                state.crmURL = `https://whosoncrmfuncs.azurewebsites.net/api/Auth?servername=${state.serverUID}&domain=${currentChat.Domain}&source=client&operator=${userName}&id=${currentChat.ChatUID}&name=${visitorName}&emailaddress=${email}&webchartsurl=https://dev3.whoson.com/whosoncharts/`;
                hooks.Call(events.Chat.CRMIFrameChangedSrc, state.crmURL);
            });

            hooks.Register(events.Chat.SendMessage, (message) => {
                var chatObject = {
                    "code" : 1,
                    "date" : getDate(new Date()),
                    "msg" : message.Text
                }

                if(services.Store.state.chatMessages[message.ChatId] == null) services.Store.state.chatMessages[message.ChatId] = [];

                services.Store.state.chatMessages[message.ChatId].push(chatObject);
                services.Store.state.currentChatMessages.push(chatObject)
                services.WhosOnConn.SendMessage(message.Num, message.Text);

                hooks.Call(events.Chat.ScrollChat, "");
            });

            hooks.Register(events.Socket.Closed, (e) => {
                sessionStorage.clear();
                services.Store.commit("replaceEntireState", services.DefaultState());
            });
        }
    }

    

    function getDate(timeStamp)
    {
        var h = (timeStamp.getHours() < 10 ? '0' : '') + timeStamp.getHours();
        var m = (timeStamp.getMinutes() < 10 ? '0' : '') + timeStamp.getMinutes();
        var s = (timeStamp.getSeconds() < 10 ? '0' : '') + timeStamp.getSeconds();

        return h + ':' + m + ':' + s;
    }

    services.Add("StoreUpdater", new StoreUpdater());
})(woServices);