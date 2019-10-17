
(function(services) {
    class StoreUpdater {
        constructor() {
            var hooks = services.Hooks;
            var events = services.HookEvents;
            var connEvents = events.Connection;
            var store = services.Store;
            var state = services.Store.state;

            hooks.Register(connEvents.LoggedIn, (e) => {
                state.serverUID = e.Data.ServerUid;
                state.webChartsURL = e.Data.WebChartsUrl;
                state.chatURL = e.Data.ChatUrl;
            });

            hooks.Register(connEvents.CurrentChats, (e) => {
                var chats = e.Data;
                state.chats = services.ChatFactory.FromChatting(chats, state.sites, state.users);
                state.activeChatCount = Object.keys(state.chats).length; 
            });

            hooks.Register(connEvents.UserSites, (e) => {
                var sites = {};
                for (var index = 0; index < e.Data.Sites.length; index++)
                {
                    sites[e.Data.Sites[index].SiteKey] = e.Data.Sites[index];
                }
                state.sites = sites; 
            });

            hooks.Register(connEvents.UserInfo, (e) => {
                state.userInfo = e.Data.User; 
            });

            hooks.Register(connEvents.CurrentUsersOnline, (e) => {
                var users = e.Data.Clients;

                for(var i = 0; i < users.length; i++) {
                    var client = users[i];
                    client.HasPhoto = true;
                    services.WhosOnConn.GetUserPhoto(client.Username);
                }

                state.users = users; 
                var clientUser = state.users.find((v) => v.Username == state.userName);
                state.currentConnectionId = clientUser.Connection;
            });

            hooks.Register(connEvents.ChatClosed, (e) => {
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

            hooks.Register(connEvents.ChatRequested, (e) => {
                var data = e.Data;
                var info = data.split(":");
                var chatNum = info[0];
                var domain = info[1];
                var visitorName = info[2];
                var dept = info[3];
                state.preRenderedChats[chatNum] = {visitorName, domain, dept};
            });

            hooks.Register(connEvents.ChatChanged, (e) => {
                var data = e.Data;
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
            });

            hooks.Register(connEvents.UserStatusChanged, (e) => {
                var changedUser = e.Data;
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
            });

            hooks.Register(connEvents.ChatMessage, (e) => {
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
                if(messages == null) state.chatMessages[chatId] = [];

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
                        state.currentChatTypingstate = false;
                        state.currentChatMessages = Copy(state.chatMessages[chatId]);
                        hooks.Call(events.Chat.ScrollChat);
                    }
                }
            });       
            
            

            hooks.Register(events.Chat.RequestedFileUpload, () => {
                state.currentChatMessages.push({
                    code:1,
                    msg: "File Upload Request Sent.",
                    date: getDate(new Date()),
                    isLink: false
                });

                hooks.Call(events.Chat.ScrollChat);
            });
            
            hooks.Register(connEvents.CurrentVisitorUploadedFile, (e) => {
                var chatBelongingTo = state.chats.find((v) => v.Number == e.Header);
                if(chatBelongingTo == null) return;

                
                var chatId = chatBelongingTo.ChatUID;

                var msg = {code:0, msg:e.Data, date: getDate(new Date()), isLink: true};
                
                if(state.chatMessages[chatId] == null) state.chatMessages[chatId] = [];
                state.chatMessages[chatId].push(msg);
                state.chatMessages = Copy(state.chatMessages);

                var hasCurrentChat = Object.keys(state.currentChat).length != 0;

                if(hasCurrentChat) {
                    if(state.currentChat.ChatUID == chatId) {
                        state.currentChatTypingstate = false;
                        state.currentChatMessages = Copy(state.chatMessages[chatId]);
                        hooks.Call(events.Chat.ScrollChat, "");
                    }
                }
            });

            hooks.Register(connEvents.CurrentChat, (e) => {
                var chatInfo = e.Header.split(":");
                var siteKey = chatInfo[0];
                var ip = chatInfo[1];
                var sessId = chatInfo[2];
                var chatId = chatInfo[3];
                var chatNum = chatInfo[4];

                store.commit("chatAccepted", chatId);

                var chat = e.Data;
                var chatUID = e.Data.ChatUID;
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
                state.currentChatPreSurveys = typeof(state.chatPreSurveys[chatNum]) !== 'undefined' ?
                    Copy(state.chatPreSurveys[chatNum]) :
                    {};
                state.currentChatTypingstate = false;
                services.WhosOnConn.StopTypingStatus(state.currentChat.Number);
            });

            hooks.Register(connEvents.PreChatSurvey, (e) => {
               var chatInfo = e.Header.split(":");
               e.Header = chatInfo[3]; //[chatInfo[0], chatInfo[1], chatInfo[2], chatInfo[4], chatInfo[3]].join(":"); 

                var msg = e;

                state.chatPreSurveys[msg.Header] = msg.Data;
                var hasCurrentChat = Object.keys(state.currentChat).length != 0;
                if(hasCurrentChat) {
                    if(state.currentChat.Number == msg.Header) {
                        state.currentChatPreSurveys = Copy(state.chatPreSurveys[msg.Header]);
                    }
                    hooks.Call(events.Chat.PreChatSurveysLoaded);
                }   
            });

            hooks.Register(connEvents.VisitorTyping, (e) => {
                var msg = e;
                var hasCurrentChat = Object.keys(state.currentChat).length != 0;

                if(hasCurrentChat) {
                    if(state.currentChat.Number == msg.Data) {
                        state.currentChatTypingstate = true;
                    }
                }
            });

            hooks.Register(connEvents.VisitorTypingOff, (e) => {
                var msg = e;
                var hasCurrentChat = Object.keys(state.currentChat).length != 0;

                if(hasCurrentChat) {
                    if(state.currentChat.Number == msg.Data) {
                        state.currentChatTypingstate = false;
                    }
                }
            });

            hooks.Register(events.Chat.AcceptChat, (chatInfo) => { 
                var chats = state.chats;
                Object.keys(chats).forEach((key) => {
                    var chat = chats[key];
                    if(chat.ChatUID == chatInfo.ChatId) {
                        chat.IsActiveChat = true;
                        state.currentChat = chat;

                        if(state.chatMessages[chat.ChatUID] != null) {
                            state.currentChatMessages = Copy(state.chatMessages[chat.ChatUID]);
                        } else {
                            state.currentChatMessages = Copy([]);
                        }

                        if (state.chatPreSurveys[chat.Number] != null) {
                            state.currentChatPreSurveys = Copy(state.chatPreSurveys[chatInfo.Number]);
                            hooks.Call(events.Chat.PreChatSurveysLoaded);
                        } else {
                            state.currentChatPreSurveys = {};
                        }
                        services.WhosOnConn.AcceptChat(chatInfo.Number);
                        hooks.Call(events.Chat.ClickTab, "conversation");
                    } else {
                        chat.IsActiveChat = false;
                    }
                });

            });

            hooks.Register(events.Chat.CloseChat, (chatNum) => {
                services.WhosOnConn.CloseChat(chatNum);               
                state.chats.forEach(function(chat){
                    if (chat.TalkingTo == woServices.Store.state.userName && chat.ChatUID != state.currentChat.ChatUID) {
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

            hooks.Register(events.Connection.UploadedFiles, (e) => {
                state.uploadedFiles = e.Data;
                state.uploadedFilesSearchResult = state.uploadedFiles;
            });

            hooks.Register(events.Connection.CannedResponses, (e) => {
                state.cannedResponses = e.Data;
                state.cannedResponsesTree = cannedResponsesToTree(e.Data);
            });
        }
    }
    services.Add("StoreUpdater", new StoreUpdater());
})(woServices);