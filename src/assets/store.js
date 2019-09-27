
(function(services) {
    var hooks = services.Hooks;
    var events = services.HookEvents;
    services.Add("Store", new Vuex.Store({
        state: services.DefaultState(),
        mutations: {
            init(state) {
                state.connectionAddress = state.connectionAddress || `ws://${window.location.hostname}:8013`;
                state.settingsPortalAddress = state.settingsPortalAddress || `https://${window.location.hostname}/settings/ForgottenPassword.aspx`;

                var previousSettings = sessionStorage.getItem("woClient");
                if (previousSettings) {
                    var settings = JSON.parse(previousSettings);
                    state.userName = settings.userName;
                    state.password = settings.password;
                    state.department = settings.department;
                }
            },
            setChats(state, chats) { 
                state.chats = services.ChatFactory.FromChatting(chats, state.sites, state.users);
                state.activeChatCount = Object.keys(state.chats).length; 
            }, 
            removeChat(state, data) {
                var chat = state.chats.find((v) => v.ChatUID == data);
                if(chat != null) {

                    if(state.currentChat.ChatUID == chat.ChatUID) {
                        state.currentChat.Closed = true;
                    }

                    Object.keys(state.chatMessages).forEach((v) => {
                        if(v == chat.Number)
                        {
                            var chatMessages = state.chatMessages[v];
                            Vue.delete(state.chatMessages, v);
                        }
                    });

                    var idx = state.chats.indexOf(chat);
                    state.chats.splice(idx, 1);

                    state.activeChatCount = Object.keys(state.chats).length;

                  
                }
            },
            addChat(state, data) {
                var info = data.split(":");
                var chatNum = info[0];
                var domain = info[1];
                var visitorName = info[2];
                var dept = info[3];


                state.preRenderedChats[chatNum] = {visitorName, domain, dept};
            },
            chatChanged(state, data) {
               var newChat = state.preRenderedChats[data.Number];
                if (newChat != null) {
                    var chat = services.ChatFactory.FromChatChangedNew(data, newChat, state.sites, state.users);
                    state.chats.push(chat);
                    state.activeChatCount = Object.keys(state.chats).length;
                    Vue.delete(state.preRenderedChats, data.Number);

                    hooks.Call(events.Connection.NewChat, chat);
                } else {
                    var oldChat = state.chats.find((v) => v.ChatUID == data.ChatUID);

                    if(oldChat != null) services.ChatFactory.FromChatChangedOld(data, oldChat, state.sites, state.users);
                }
            },
            setSites(state, sites) { 
                state.sites = sites; 
            }, 
            setUserInfo(state, info) { 
                state.userInfo = info; 
            }, 
            setCurrentUsers(state, users) { 
                state.users = users; 
                
                var clientUser = state.users.find((v) => v.Username == state.userName);
                state.currentConnectionId = clientUser.Connection;
            },
            userChanged(state, changedUser) {
                var user = state.users.find((v) => v.Username == changedUser.Username);
                if(user != null) {
                    user.Status = changedUser.Status;
                    user.Chats = changedUser.Chats;
                    user.Admin = changedUser.Admin;
                    user.IPAddress = changedUser.IPAddress;
                    user.Lang = changedUser.Lang;
                    user.MaxChats = changedUser.MaxChats;
                    user.Name = changedUser.Name;
                    user.Connection = changedUser.Connection;


                    if(user.Username == state.userName) {
                        state.currentStatus = user.Status;
                    }
                } else {
                    state.users.push(changedUser);
                }
            },
            chatMessage(state, msg) {
                var chatBelongingTo = state.chats.find((v) => v.Number == msg.Header);
                if(chatBelongingTo == null) return;


                var chatId = chatBelongingTo.ChatUID;
                var messages = state.chatMessages[chatId];
                if(messages == null) state.chatMessages[chatId] = [];

                var message = { code:0, msg:msg.Data, date: getDate(new Date())};

                state.chatMessages[chatId].push(message);
                state.chatMessages = JSON.parse(JSON.stringify(state.chatMessages));
                

                var hasCurrentChat = Object.keys(state.currentChat).length != 0;

                if(hasCurrentChat) {
                    if(state.currentChat.ChatUID == chatId) {
                        state.currentChatTypingstate = false;
                        state.currentChatMessages = JSON.parse(JSON.stringify(state.chatMessages[chatId]));
                        hooks.Call(events.Chat.ScrollChat, "");
                    }
                }
            },
            preChatSurvey(state, msg) {
                
                state.chatPreSurveys[msg.Header] = msg.Data;

                var hasCurrentChat = Object.keys(state.currentChat).length != 0;

                if(hasCurrentChat) {
                    if(state.currentChat.Number == msg.Header) {
                        state.currentChatPreSurveys =  JSON.parse(JSON.stringify(state.chatPreSurveys[msg.Header]));
                    }
                    hooks.Call(events.Chat.PreChatSurveysLoaded);
                }

            },
            visitorTyping(state, msg)
            {
                var hasCurrentChat = Object.keys(state.currentChat).length != 0;

                if(hasCurrentChat) {
                    if(state.currentChat.Number == msg.Data) {
                        state.currentChatTypingstate = true;
                    }
                }
            },
            visitorTypingOff(state, msg)
            {
                var hasCurrentChat = Object.keys(state.currentChat).length != 0;

                if(hasCurrentChat) {
                    if(state.currentChat.Number == msg.Data) {
                        state.currentChatTypingstate = false;
                    }
                }
            },
            currentChat(state, info) {
                var chatNum = info.chatNum;
                var chat = info.data;
                var chatUID = info.data.ChatUID;


                state.chatMessages[chatUID] = [];

                for(var i = 0; i < chat.Lines.length; i++) {
                    var line = chat.Lines[i];
                    var parsedDate = new Date(line.Dated);
                    state.chatMessages[chatUID].push({ code:line.OperatorIndex, msg:line.Message, date: getDate(parsedDate)});
                }
                
                state.chatMessages = JSON.parse(JSON.stringify(state.chatMessages));
                state.currentChatMessages = JSON.parse(JSON.stringify(state.chatMessages[chatUID]));
                state.currentChatPreSurveys = typeof(state.chatPreSurveys[chatNum]) !== 'undefined' ? JSON.parse(JSON.stringify(state.chatPreSurveys[chatNum])) : {};
                state.currentChatTypingstate = false;
            },
            successfulLogin(state, details) {
                state.serverUID = details.ServerUid;
            },
            saveLoginDetails(state, loginDetails) {
                state.userName = loginDetails.userName;
                state.password = loginDetails.password;
                state.department = loginDetails.department;
                sessionStorage.setItem("woClient", JSON.stringify(loginDetails))
            },
            replaceEntireState(state, newState) {
                Object.assign(state, newState);
            }
        }
    }));

    function getDate(timeStamp)
    {
        var h = (timeStamp.getHours() < 10 ? '0' : '') + timeStamp.getHours();
        var m = (timeStamp.getMinutes() < 10 ? '0' : '') + timeStamp.getMinutes();
        var s = (timeStamp.getSeconds() < 10 ? '0' : '') + timeStamp.getSeconds();

        return h + ':' + m + ':' + s;
    }
})(woServices);