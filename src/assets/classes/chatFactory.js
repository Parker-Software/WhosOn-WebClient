(function(services){

    var state = services.Store.state;

    class Chat {
        constructor(
            chatId,
            dept,
            domain,
            lang,
            location,
            name,
            number,
            queuePos,
            siteKey,
            skills,
            talkingToClientConnection,
            translation,
            ipaddress,
            sessionId,
            waitedSecs,
            monitoredby,
            channel) {
            
            //Raw Data From Server
            this.ChatUID = chatId; 
            this.Dept = dept;
            this.Domain = domain;
            this.Lang = lang;
            this.Location = location;
            this.Name = name;
            this.Number = number;
            this.QueuePos = queuePos;
            this.SiteKey = siteKey;
            this.SkillNames = skills;
            this.TalkingToClientConnection = talkingToClientConnection;
            this.Translation = translation;
            this.IPAddress = ipaddress;
            this.SessionID = sessionId;
            this.WaitedSecs = waitedSecs;
            this.Monitoredby = monitoredby;
            this.Channel = channel;

            this.SiteName = "";
            this.TalkingTo = "";
            this.Status = "";
            this.WaitingWarning = false;
            this.IsActiveChat = false;
            this.BeingMonitoredByYou = false;
            this.Closed = false;
            this.WrapUpCompleted = false;
        }
    }


    class ChatFactory {
        FromChatting(chats, sites, operators) {
            var newChats = [];

            Object.keys(chats).forEach((key) => {
                var rawchat = chats[key];

                var chat = new Chat(rawchat.ChatUID,
                                    rawchat.Dept,
                                    sites[rawchat.SiteKey].Domain,
                                    rawchat.Lang,
                                    rawchat.Location,
                                    rawchat.VisitorName,
                                    rawchat.Number,
                                    rawchat.QueuePos,
                                    rawchat.SiteKey,
                                    rawchat.SkillNames,
                                    rawchat.TalkingToClientNo,
                                    rawchat.Translation,
                                    rawchat.VisitorIPAddress,
                                    rawchat.VisitorSessionId,
                                    rawchat.WaitedSecs,
                                    rawchat.Monitoredby,
                                    rawchat.Channel);

                
                AddAdditionalChatInfo(chat, sites, operators);

                newChats[key] = chat;
            });

            return newChats;
        }

        FromChatChangedNew(rawChat, newChatInfo, sites, operators) {
            var chat = new Chat(rawChat.ChatUID,
                rawChat.Dept,
                newChatInfo.domain,
                rawChat.Lang,
                rawChat.Location,
                newChatInfo.visitorName,
                rawChat.Number,
                rawChat.QueuePos,
                rawChat.SiteKey,
                rawChat.WantsSkills,
                rawChat.TalkingToClientNo,
                rawChat.Translation,
                rawChat.VisitorIPAddress,
                rawChat.VisitorSessionID,
                rawChat.WaitedSecs,
                rawChat.Monitoredby,
                rawChat.Channel);
                

            AddAdditionalChatInfo(chat, sites, operators);

            return chat;
        }

        FromChatChangedOld(rawChat, chat, sites, operators) {
            chat.ChatUID = rawChat.ChatUID;
            chat.Dept = rawChat.Dept;
            chat.Lang = rawChat.Lang;
            chat.Location = rawChat.Location;
            chat.Name = rawChat.VisitorName;
            chat.Number = rawChat.Number;
            chat.QueuePos = rawChat.QueuePos;
            chat.SiteKey = rawChat.SiteKey;
            chat.SkillNames = rawChat.WantsSkills;
            chat.TalkingToClientConnection = rawChat.TalkingToClientNo;
            chat.Translation = rawChat.Translation;
            chat.VisitorIPAddress = rawChat.VisitorIPAddress;
            chat.VisitorSessionID = rawChat.VisitorSessionID;
            chat.WaitedSecs = rawChat.WaitedSecs;
            chat.Monitoredby = rawChat.Monitoredby;
            chat.Channel = rawChat.Channel;

            AddAdditionalChatInfo(chat, sites, operators);

            return chat;
        }
    }

    function AddAdditionalChatInfo(chat, sites, operators) {
        var site = sites[chat.SiteKey];
        chat.SiteName = site.Name; 

        if(chat.TalkingToClientConnection != null && chat.TalkingToClientConnection != 0) { 

            if(chat.TalkingToClientConnection == state.currentConnectionId) {
                chat.TalkingTo = state.userInfo.Name; 
                chat.Status = "Talking To You"; 
            } else {
                var op = operators.find((v) => v.Connection == chat.TalkingToClientConnection); 
                chat.TalkingTo = op.Name; 
                chat.Status = `Talking To ${chat.TalkingTo}`; 
            }

            chat.WaitingWarning = false;
           
        } else {
            chat.Status = chat.WaitedSecs.toFormattedWaitTime();
            chat.TalkingTo = ""; 
            if(chat.WaitedSecs > 30 ) {
                chat.WaitingWarning = true;
            }
        }
    }

    services.Add("ChatFactory", new ChatFactory());
})(woServices);