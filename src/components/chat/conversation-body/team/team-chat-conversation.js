(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;
    var state = services.Store.state;

    var notification;

    hooks.Register(events.Connection.OperatorChat, (e) => {
        var userName = e.Header.toLowerCase();
        var exists = state.operatorMessages[userName];
        var reversed = e.Data.reverse();
        if (exists != null) {
            for(var i = reversed.length - 1; i >= 0; i--) {
                state.operatorMessages[userName].splice(0, 0, reversed[i]);
            }
        } else {
            state.operatorMessages[userName] = reversed;
            hooks.Call(events.Team.MessagedAdded);
        }
        state.currentOperatorChatMessages = state.operatorMessages[userName];
    });

    hooks.Register(events.Connection.FromOperator, (e) => {
        var userConn = e.Header;
        var text = e.Data;

        var user = state.users.find(x => x.Connection == userConn);
        if (user) {
            user.UnAnswered = true;
            state.users = Copy(state.users);


            var isShowing = isVisible(document.getElementById("team-chat-conversation"));
            if (
                isShowing == false ||
                state.selectedOperatorToOperatorUser == null ||
                user.Connection != state.selectedOperatorToOperatorUser.Connection) {
                createNotification();

                if(state.operatorMessages[user.Username] == null) state.operatorMessages[user.Username] = [];
                state.operatorMessages[user.Username].push({
                    ID: 0,
                    Dated: new Date(),
                    MyLine: false,
                    Text: text,
                    isLink: false
                });
            }
            else if(isShowing && state.selectedOperatorToOperatorUser.Connection == userConn) {
                state.currentOperatorChatMessages.push({
                    ID: 0,
                    Dated: new Date(),
                    MyLine: false,
                    Text: text,
                    isLink: false
                });

                if(document.hasFocus() == false) {
                    createNotification();
                }

                hooks.Call(events.Team.MessagedAdded);
            }
        }

        function createNotification() {
            if (notification != null) notification.close();
            notification = 
                services.Notifications.CreateNotification(
                    `Team Chat With ${user.Name}`,
                    text, () => {
                    window.focus();
                    notification.close();
                    hooks.Call(events.Team.NotificationClicked, user);
            });
        }
    });


    hooks.Register(events.Connection.OperatorLink, (e) => {
        var userConn = e.Header;
        var text = e.Data;
        
        if (userConn == state.selectedOperatorToOperatorUser.Connection) {
            state.currentOperatorChatMessages.push({
                ID: 0,
                Dated: new Date(),
                MyLine: false,
                Text: text,
                isLink: true
            });
            
            hooks.Call(events.Team.MessagedAdded);
        }
    });

    Vue.component("team-chat-conversation", {   
        props: [
            "user",
            "messages",
        ],  
        data: () => {
            return {
                ContainerId: elementId(),
                ChatScrollerId: elementId(),
                ShowCannedResponses: false,
                SelectedCannedResponse: null,
                SearchText: "",
                ShowGetPreviousLines: true,
                ShowTypingStatus: false,
                TypingName: "",
                SendingTypingStatus: false,
                TypingTimer: null,
                InteractionDisabled: false,
            }
        }, 
        template: `
            <div id="team-chat-conversation" class="chat-conversation">
                <div class="team-convo">
                    <div class="field searchField">
                        <p class="control has-icons-right">
                            <input id="searchConversation" class="input" type="text" placeholder="Search" v-on:keyup.enter="Search">                        
                            <span class="icon is-small is-right">
                                <i class="fas fa-search"></i>
                            </span>
                        </p>
                    </div>
                    <div v-if="ShowGetPreviousLines" class="previousLinesContainer" v-on:click="GetPreviousLines">
                        <i class="fas fa-level-up-alt"></i>
                    </div>
                </div>
                <div v-bind:id="ContainerId" class="chat-conversation-container" style="padding-top: 10px">
                    <div class="active-chat" id="Conversation">
                        <div class="columns">
                            <div v-bind:id="ChatScrollerId" class="message-list no-gap-bottom team-message-list">
                                <div v-for="(v,k) in GroupedMessages" class="messages">
                                    <me-message v-if="v.isMe" :groupedMessage="v"></me-message>
                                    <them-message v-if="v.isMe == false" :groupedMessage="v"></them-message>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <canned-responses
                    :showing="ShowCannedResponses"
                    :selectedResponse="SelectedCannedResponse"
                    v-on:Close="CloseCannedResponses"
                    v-on:Clicked="CannedResponseClicked"
                ></canned-responses>
                <team-conversation-interaction 
                    :user="user"
                    :disabled="InteractionDisabled"
                    :showTyping="ShowTypingStatus"
                    :typingName="TypingName"
                    v-on:CannedReponsesClicked="CannedResponsesClicked"
                    v-on:Send="SendToOperator"
                    v-on:Typing="Typing"
                    v-on:SendFile="SendFileToOperator"
                >
                </team-conversation-interaction>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Connection.OperatorTyping, (e) => {
                if(e.Data == this.user.Connection) {
                    this.ShowTypingStatus = true;
                    this.TypingName = this.user.Name;
                }
            });

            hooks.Register(events.Connection.OperatorTypingStopped, (e) => {
                if(e.Data == this.user.Connection) {
                    this.ShowTypingStatus = false;
                    this.TypingName = "";
                }
            });

            hooks.Register(events.Connection.OperatorChat, (e) => {
                if(e.Data.length <= 0) this.ShowGetPreviousLines = false;
            });

            hooks.Register(events.Team.OtherUserClicked, (user) => {
                this.SearchText = "";
                if (this.SearchElem() != null) this.SearchElem().value = "";
                this.ShowGetPreviousLines = true;
                this.InteractionDisabled = false;
            });

            hooks.Register(events.Team.MessagedAdded, () => {
                this.ShowGetPreviousLines = true;
                this.ScrollChat();
            });

            hooks.Register(events.Chat.CannedResponsesClicked, (type) => {
                if (type != "team") return;
                this.Split();
            });

            hooks.Register(events.Chat.CannedResponsesClosed, (type) => {
                if (type != "team") return;
                this.Normal();
            });

            hooks.Register(events.Connection.UserDisconnecting, (e) => {
                var userConn = e.Data;
                if(userConn == this.user.Connection) {
                    this.InteractionDisabled = true;
                    this.ShowCannedResponses = false;
                    this.Normal();
                }
            });
        },
        methods: {
            Container() {
                return document.getElementById(this.ContainerId);
            },

            SearchElem() {
                return document.getElementById("searchConversation");
            },

            Split() {
                if (this.Container() != null) this.Container().style.width = "calc(70% - 4px)";
                if (this.Container() != null) this.Container().style.float = "left";
            },

            Normal() {
                if (this.Container() != null) this.Container().style.width = "calc(100% - 4px)";
                if (this.Container() != null) this.Container().style.float = "none";
            },

            ScrollChat() {
                var scroller = document.getElementById(this.ChatScrollerId);
                setTimeout(() => {
                    if(scroller != null) {
                        scroller.scrollBy({
                            top: scroller.scrollHeight,
                            left: 0,
                            behavior: "smooth"
                        });
                    }
                }, 100);
            },

            CloseCannedResponses() {
                this.ShowCannedResponses = false;
                this.SelectedCannedResponse = null;
                this.Normal();
            },

            
            CannedResponseClicked(evnt) {
                this.SelectedCannedResponse = evnt.item;
                hooks.Call(events.Team.CannedResponses.Clicked, evnt);
            },

            CannedResponsesClicked() {
                this.ShowCannedResponses = !this.ShowCannedResponses;
                if(this.ShowCannedResponses) {
                    this.Split();
                } else {
                    this.Normal();
                }
            },

            GetPreviousLines() {
                if (this.messages.length > 0) {
                    var lastMessage = this.messages[0];
                    connection.GetClientChat(this.user.Username, lastMessage.ID, this.SearchText);
                }
            },

            Search() {
                this.$store.state.operatorMessages[this.user.Username.toLowerCase()] = [];
                delete this.$store.state.operatorMessages[this.user.Username.toLowerCase()];
                this.$store.state.currentOperatorChatMessages = [];

                var txt = this.SearchElem().value;
                if(txt.length > 0) {
                    this.SearchText = txt;
                    connection.GetClientChat(this.user.Username, 0, this.SearchText);
                } else {
                    this.SearchText = "";
                    connection.GetClientChat(this.user.Username, 0);
                }
            },

            SendFileToOperator(fileName, url) {
               connection.SendFileToOperator(this.user.Connection, fileName, url);
                var msg = {
                    ID: 0,
                    MyLine: true,
                    Text:`<link><name>${fileName}</name><url>${url}</url></link>`, 
                    Dated: new Date(),
                    isLink: true
                };
                this.$store.state.currentOperatorChatMessages.push(msg);
                this.ScrollChat();
            },

            SendToOperator(eventArgs) {
                if(this.SelectedCannedResponse != null && eventArgs.AttachedFile) {
                    var idx = eventArgs.Text.indexOf("<span spellcheck=\"false\" contenteditable=\"false\" class=\"tag attachedFileToMessage noselect\">");
                    eventArgs.Text = eventArgs.Text.substring(0, idx);
                    var url =  `${state.webChartsURL}document.aspx?f=${eventArgs.AttachedFile.HashedFileName}`;

                    connection.SendFileToOperator(this.user.Connection, eventArgs.AttachedFile.FileName, url);
                    var msg = {
                        ID: 0,
                        MyLine: true,
                        Text:`<link><name>${eventArgs.AttachedFile.FileName}</name><url>${url}</url></link>`, 
                        Dated: new Date(),
                        isLink: true
                    };
                    this.$store.state.currentOperatorChatMessages.push(msg);
                }

                this.$store.state.currentOperatorChatMessages.push({
                    ID: 0,
                    Dated: new Date(),
                    MyLine: true,
                    Text: eventArgs.Text,
                    isLink: false
                });

                connection.SendToOperator(this.user.Connection, eventArgs.Text);
                this.ScrollChat();

                this.SendingTypingStatus = false;
                connection.StopTypingStatus(this.user.Connection);

                var user = this.$store.state.users.find(x => x.Username == this.user.Username);
                user.UnAnswered = false;
                this.$store.state.users = Copy(this.$store.state.users);
            },

            Typing(event, text) {
                clearTimeout(this.TypingTimer);
                this.TypingTimer = setTimeout(() => {
                    this.SendingTypingStatus = false;
                    connection.StopOperatorTypingStatus(this.user.Connection);
                }, 1000);

                if(this.SendingTypingStatus == false) {
                    this.SendingTypingStatus = true;
                    connection.SendOperatorTypingStatus(this.user.Connection);
                } 
            },
        },
        computed: {
            GroupedMessages() {
                var grouped = [];
                for(var i = 0; i < this.messages.length; i++) {
                    var message = this.messages[i];
                    var name = message.MyLine ? this.$store.state.userInfo.Name : this.user.Name;
                    var groupedMessage = {
                        messages: [
                            message
                        ],
                        time: new Date(message.Dated).toLocaleTimeString(),
                        isLink: message.Text.includes("<link>") || message.isLink || false,
                        Name: name,
                        isMe: message.MyLine
                    };
                    var currentTime = new Date(message.Dated);
                    if(message.isLink == undefined || message.isLink == false) { 
                        for(var k = i + 1; k < this.messages.length; k++) {
                            var messageTime = new Date(this.messages[k].Dated);
                            var diff = (messageTime - currentTime) / 1000;
                            if  (this.messages[k].isLink == undefined &&
                                this.messages[k].Text.includes("<link>") == false) {
                                    this.messages[k].isLink = false;
                                }
                            if(
                                this.messages[k].MyLine == message.MyLine &&
                                diff <= 10 &&
                                this.messages[k].isLink == groupedMessage.isLink
                            ) {

                                groupedMessage.messages.push(this.messages[k]);
                                groupedMessage.time = new Date(this.messages[k].Dated).toLocaleTimeString();
                            } else {
                                break;
                            }
                        } 
                    }

                    grouped.push(groupedMessage);
                    i += groupedMessage.messages.length - 1;
                }
                return grouped;
            }
        }
    });
})(woServices);