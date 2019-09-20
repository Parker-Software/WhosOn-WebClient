(function(services){
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
            waitedSecs) {
            
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

            this.SiteName = "";
            this.TalkingTo = "";
            this.Status = "";
        }
    }


    class ChatFactory {
        FromChatting(chats, sites, operators) {
            var newChats = [];

            Object.keys(chats).forEach((key) => {
                var rawchat = chats[key];
                var chat = new Chat(rawchat.ChatUid,
                                    rawchat.Dept,
                                    rawchat.Domain,
                                    rawchat.Lang,
                                    rawchat.Location,
                                    rawchat.Name,
                                    rawchat.Number,
                                    rawchat.QueuePos,
                                    rawchat.SiteKey,
                                    rawchat.SkillNames,
                                    rawchat.TalkingToClientConnection,
                                    rawchat.Translation,
                                    rawchat.VisitorIPAddress,
                                    rawchat.VisitorSessionId,
                                    rawchat.WaitedSecs);

                var site = sites[chat.SiteKey];
                chat.SiteName = site.Name; 

                if(chat.TalkingToClientConnection != null && chat.TalkingToClientConnection != 0) { 
                    var op = operators.find((v) => v.Connection == chat.TalkingToClientConnection); 
                    chat.TalkingTo = op.Username; 
                    chat.Status = `Talking to ${chat.TalkingTo}`; 
                } else {
                    chat.Status = chat.WaitedSecs.toFormattedWaitTime();
                }

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
                rawChat.WaitedSecs);

            var site = sites[chat.SiteKey];
            chat.SiteName = site.Name; 

            if(chat.TalkingToClientConnection != null && chat.TalkingToClientConnection != 0) { 
                var op = operators.find((v) => v.Connection == chat.TalkingToClientConnection); 
                chat.TalkingTo = op.Username; 
                chat.Status = `Talking to ${chat.TalkingTo}`; 
            } else {
                chat.Status = chat.WaitedSecs.toFormattedWaitTime();
            }

            return chat;
        }

        FromChatChangedOld(rawChat, chat, sites, operators) {
            chat.ChatUID = rawChat.ChatUID,
            chat.Dept = rawChat.Dept,
            chat.Lang = rawChat.Lang,
            chat.Location = rawChat.Location,
            chat.Name = rawChat.VisitorName,
            chat.Number = rawChat.Number,
            chat.QueuePos = rawChat.QueuePos,
            chat.SiteKey = rawChat.SiteKey,
            chat.SkillNames = rawChat.WantsSkills,
            chat.TalkingToClientConnection = rawChat.TalkingToClientNo,
            chat.Translation = rawChat.Translation,
            chat.VisitorIPAddress = rawChat.VisitorIPAddress,
            chat.VisitorSessionID = rawChat.VisitorSessionID,
            chat.WaitedSecs = rawChat.WaitedSecs

            var site = sites[chat.SiteKey];
            chat.SiteName = site.Name; 

            if(chat.TalkingToClientConnection != null && chat.TalkingToClientConnection != 0) { 
                var op = operators.find((v) => v.Connection == chat.TalkingToClientConnection); 
                chat.TalkingTo = op.Username; 
                chat.Status = `Talking to ${chat.TalkingTo}`; 
            } else {
                chat.Status = chat.WaitedSecs.toFormattedWaitTime();
            }

            return chat;
        }
    }

    services.Add("ChatFactory", new ChatFactory());
})(woServices);