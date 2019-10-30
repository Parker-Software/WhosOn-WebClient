
(function(services) {
    class StoreUpdater {
        constructor() {
            var hooks = services.Hooks;
            var events = services.HookEvents;
            var connEvents = events.Connection;
            var connection = services.WhosOnConn;
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
                if(e.Data.User != null) {
                    state.userInfo = e.Data.User;
                } else state.userInfo = e.Data;

                var split = state.userInfo.Rights.split("");
                state.rights.LoginToSettingsPortal = YNToBool(split[0]);
                state.rights.ViewReports = YNToBool(split[1]);
                state.rights.ViewDailySummary = YNToBool(split[2]);
                state.rights.EditLocalSettings = YNToBool(split[3]);
                state.rights.TakeChats = YNToBool(split[4]);
                state.rights.SendChatInvites = YNToBool(split[5]);
                state.rights.RespondToMissedChats = YNToBool(split[6]);
                state.rights.ChatToOtherOperators = YNToBool(split[7]);
                state.rights.MonitorChats = YNToBool(split[8]);
                state.rights.ChangeOwnName = YNToBool(split[9]);
                state.rights.DeleteChats = YNToBool(split[10]);
                state.rights.SeeUsersOutsideOfOwnDepartment = YNToBool(split[11]);
                state.rights.TransferChatsToOutsideOwnDepartment = YNToBool(split[12]);
                state.rights.CreateTickets = YNToBool(split[13]);
                state.rights.StartVideoChats = YNToBool(split[14]);
                state.rights.UserToUserStoredInDatase = YNToBool(split[15]);
                state.rights.StartRemoteControl = YNToBool(split[16]);
                state.rights.SingleUseFile = split[17];
                state.rights.SuperAdmin = split.indexOf("S") != -1;
                state.rights.Invisible = split.indexOf("I") != -1;
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
                if(clientUser != null) state.currentConnectionId = clientUser.Connection;
                else state.isSuperAdmin = true;
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

            hooks.Register(events.ChatModal.StopMonitoringChatConfirmed, (chatNum) => {
                var chat = state.chats.find((v) => v.Number == chatNum);
                if (chat != null) {
                    chat.BeingMonitoredByYou = false;
                    chat.IsActiveChat = false;
                }
                state.currentChat = {};
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
                    
                    var doesExist = state.chats.find(x => x.ChatUID == data.ChatUID);
                    if(doesExist != null) return;
                    
                    var chat = services.ChatFactory.FromChatChangedNew(data, newChat, state.sites, state.users);
                    state.chats.push(chat);
                    state.activeChatCount = Object.keys(state.chats).length;
                    Vue.delete(state.preRenderedChats, data.Number);
                    hooks.Call(events.Connection.NewChat, chat);
                } else {
                    var oldChat = state.chats.find((v) => v.ChatUID == data.ChatUID);
                    if(oldChat != null) services.ChatFactory.FromChatChangedOld(data, oldChat, state.sites, state.users);
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

            hooks.Register(connEvents.UserChanged, (e) => {
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
                    hooks.Call(events.Home.UserImagesNeedUpdating);
                } else {
                    changedUser.HasPhoto = true;
                    state.users.push(changedUser);
                    connection.GetUserPhoto(changedUser.Username);
                }
            });

            hooks.Register(connEvents.UserDisconnecting, (e) => {
                var userConn = e.Data;
                var user = state.users.find((v) => v.Connection == userConn);
                if(user != null) {
                    var idx = state.users.indexOf(user);
                    state.users.splice(idx, 1);
                    
                    hooks.Call(events.Home.UserImagesNeedUpdating);
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

                services.WhosOnConn.GetVisitorDetail(siteKey, ip, sessId, chatId);
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

            hooks.Register(events.ChatItem.AcceptClicked, (chatInfo) => { 
                var chats = state.chats;
                Object.keys(chats).forEach((key) => {
                    var chat = chats[key];
                    if(chat.ChatUID == chatInfo.ChatId) {
                        chat.IsActiveChat = true;
                        chat.BeingMonitoredByYou = false;
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

            hooks.Register(events.ChatItem.MonitorClicked, (chatInfo) => {
                var foundChat;
                Object.keys(state.chats).forEach(key => {
                    var chat = state.chats[key];
                    chat.IsActiveChat = false;
                    if(chat.ChatUID == chatInfo.ChatId && chat.BeingMonitoredByYou) {
                        foundChat = chat;
                       
                    }
                });

                if(foundChat != null) {
                    foundChat.IsActiveChat = true;
                    state.currentChat = foundChat;

                    if(state.chatMessages[foundChat.ChatUID] != null) {
                        state.currentChatMessages = Copy(state.chatMessages[foundChat.ChatUID]);
                    } else {
                        state.currentChatMessages = Copy([]);
                    }

                   if (state.chatPreSurveys[foundChat.Number] != null) {
                        state.currentChatPreSurveys = Copy(state.chatPreSurveys[chatInfo.Number]);
                        hooks.Call(events.Chat.PreChatSurveysLoaded);
                    } else {
                        state.currentChatPreSurveys = {};
                    }
                    hooks.Call(events.Chat.ClickTab, "conversation");
                } else services.WhosOnConn.MonitorChat(chatInfo.Number);
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
                    "msg" : message.Text,
                    isWhisper: message.Whisper,
                }

                if(chatObject.isWhisper) {
                    chatObject.Name = "You"
                }

                if(state.chatMessages[message.ChatId] == null) state.chatMessages[message.ChatId] = [];
                state.chatMessages[message.ChatId].push(chatObject);
                state.currentChatMessages.push(chatObject)
                if(message.Whisper != true) services.WhosOnConn.SendMessage(message.Num, message.Text); 
                else services.WhosOnConn.Whisper(message.ToConnection, message.Num, message.Text); 
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

            hooks.Register(events.Chat.ChatLeft, (num) => {
                state.currentChat = {};

                var chat = state.chats.find(x => x.Number == num);
                if(chat != null) {
                    chat.IsActiveChat = false;
                }
            });

            hooks.Register(events.Connection.Skills, (e) => {
                state.skills = [];
                Object.keys(e.Data).forEach(x => {
                    var skill = e.Data[x];
                    state.skills.push(skill);
                });
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
                
                if(state.chatMessages[chatBelongingTo.ChatUID] == null) state.chatMessages[chatBelongingTo.ChatUID] = [];
                state.chatMessages[chatBelongingTo.ChatUID].push(message);
                state.chatMessages = Copy(state.chatMessages);

                var hasCurrentChat = Object.keys(state.currentChat).length != 0;
                if(hasCurrentChat) {
                    if(state.currentChat.ChatUID == chatBelongingTo.ChatUID) {
                        state.currentChatTypingstate = false;
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
                    "code" : 1,
                    "date" : getDate(new Date()),
                    "msg" : message.Data
                }
                if(state.chatMessages[chat.ChatUID] == null) state.chatMessages[chat.ChatUID] = [];
                state.chatMessages[chat.ChatUID].push(chatObject);
                state.currentChatMessages.push(chatObject);

            });

            hooks.Register(events.Connection.MonitoredVisitorChatMessage, (message) => {
                var info = message.Header.split(":");
                var chatNum = info[0];
                var name = info[1];
                hooks.Call(events.Connection.ChatMessage, {Header:chatNum, Data:message.Data});
            });
        }
    }
    services.Add("StoreUpdater", new StoreUpdater());
})(woServices);