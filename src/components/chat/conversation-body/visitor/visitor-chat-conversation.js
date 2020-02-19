(function(services){
    const hooks = services.Hooks;
    const events = services.HookEvents;
    const state = services.Store.state;
    const connection = services.WhosOnConn;

    Vue.component("visitor-chat-conversation", {   
        props: [
            "chat",
            "surveys",
            "messages",
            "site"
        ],  
        data: () => {
            return {
                ShowWrapUp: false,
                ContainerId: elementId(),
                ChatScrollerId: elementId(),
                ChatInteractionId: elementId(),
                ShowCannedResponses: false,
                InteractionDisabled: false,
                HasSuggestion: false,
                ShowTypingStatus: false,
                TypingName: "",
                SendingTypingStatus: false,
                TypingTimer: null,
                SelectedCannedResponse: null
            }
        }, 
        template: `
        <div class="chat-conversation">
            <div v-bind:id="ContainerId" class="chat-conversation-container">
                <chatConversationSurvey id="surveys" v-if="ValidSurveys.length > 0" :surveys="ValidSurveys"></chatConversationSurvey>
                <div class="customColumn column" 
                    v-if="site != null &&
                        site.WrapUp.Enabled &&
                        ShowWrapUp && 
                        chat != null &&
                        chat.BeingMonitoredByYou == false"
                >
                    <chatWrapUp :options="site.WrapUp"></chatWrapUp>
                </div>
                <div class="active-chat" id="Conversation">
                    <div class="columns">
                        <div v-bind:id="ChatScrollerId" class="message-list no-gap-bottom" v-bind:style="{ height: chatHeight() }">
                            <div v-for="(v,k) in GroupedMessages" class="messages">
                                <chatConversationVisitor v-if="v.type === 0" :groupedMessage="v"></chatConversationVisitor>
                                <chatConversationOperator v-if="v.type > 0" :groupedMessage="v"></chatConversationOperator>
                                <br/>
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
            >
            </canned-responses>
            <visitor-conversation-interaction
                :id="ChatInteractionId"
                :site="site" 
                :chat="chat" 
                :disabled="InteractionDisabled"
                :monitoring="BeingMonitoredByYou"
                :hasSuggestion="HasSuggestion"
                :showTyping="ShowTypingStatus"
                :typingName="TypingName"
                 v-on:Send="SendToVisitor"
                 v-on:Typing="Typing"
                 v-on:CannedReponsesClicked="CannedResponsesClicked"
            ></visitor-conversation-interaction>
        </div>
        `,
        updated() {
            if(this.site == null) return;

            switch(this.site.WrapUp.Show) {
                case "From Start":
                        if(this.chat.WrapUpCompleted == false)  {this.ShowWrapUp = true;}
                    break;
                default:
                    this.ShowWrapUp = false;
                    console.log(`Wrap up not accounted for - ${this.site.WrapUp.Show}`);
            }


            if(this.chat.WrapUpCompleted)  {this.ShowWrapUp = true;}
        },
        beforeCreate() {
            hooks.Register(events.Connection.VisitorTyping, (e) => {
                if(state.currentChat.Number == e.Data) {
                    this.ShowTypingStatus = true;
                    this.TypingName = state.currentChat.Name;
                }
            });
        
            hooks.Register(events.Connection.VisitorTypingOff, (e) => {
                if(state.currentChat.Number == e.Data) {
                    this.ShowTypingStatus = false;
                    this.TypingName = "";
                }
            });

            hooks.Register(events.Connection.ChatMessage, (e) => { 
                if(state.currentChat.Number == e.Header) {
                    this.ShowTypingStatus = false;
                    this.TypingName = "";
                }
            });

            hooks.Register(events.Connection.MonitoredOperatorTyping, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    this.ShowTypingStatus = true;
                    this.TypingName = name;
                }
            });

            hooks.Register(events.Connection.MonitoredOperatorTypingOff, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    this.ShowTypingStatus = false;
                    this.TypingName = "";
                }
            });

            hooks.Register(events.Connection.MonitoredVisitorTyping, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    this.ShowTypingStatus = true;
                    this.TypingName = state.currentChat.Name;
                }
            });

            hooks.Register(events.Connection.MonitoredVisitorTypingOff, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    this.ShowTypingStatus = false;
                    this.TypingName = "";
                }
            });

            hooks.Register(events.ChatItem.AcceptClicked, (e) => {
                this.InteractionDisabled = false; 
                this.HasSuggestion = false;
            });

            hooks.Register(events.Chat.ScrollChat, (e) => {
                this.ScrollChat();
            });

            hooks.Register(events.Connection.CurrentChat, (e) =>{
                this.ScrollChat();
            });

            hooks.Register(events.Chat.WrapUpNotCompleted, () => {
                this.ShowWrapUp = true
            });

            hooks.Register(events.ChatModal.CloseChatConfirmed, (e) => {
                this.InteractionDisabled = true;
            });

            hooks.Register(events.ChatItem.MonitorClicked, (e) => {
                this.HasSuggestion = false;
                this.InteractionDisabled = false;
            });

            hooks.Register(events.Connection.CurrentChatClosed, () => {
                this.InteractionDisabled = true;

                if(this.chat == null || this.site == null) return;

                switch(this.site.WrapUp.Show) {
                    case "Session End":
                    case "Window Close":
                    case "From Start":
                            if(this.chat.WrapUpCompleted == false)  {this.ShowWrapUp = true;}
                        break;
                    default:
                        this.ShowWrapUp = false;
                        console.log(`Wrap up not accounted for - ${this.site.WrapUp.Show}`);
                }
            });

            hooks.Register(events.Navigation.ChatsClicked, () => {
                if(this.chat != null) this.ScrollChat();
            })

            hooks.Register(events.Chat.SuggestionFromServer, (msg) => {
                this.HasSuggestion = true;
            });
        },
        methods: {
            CannedResponsesClicked() {
                this.ShowCannedResponses = !this.ShowCannedResponses;
                if(this.ShowCannedResponses) {
                    this.Split();
                } else {
                    this.Normal();
                }
            },

            CloseCannedResponses() {
                this.ShowCannedResponses = false;
                this.SelectedCannedResponse = null;
                this.Normal();
            },

            CannedResponseClicked(evnt) {
                this.HasSuggestion = true;
                this.SelectedCannedResponse = evnt.item;
                hooks.Call(events.Chat.CannedResponses.Clicked, evnt);
            },

            chatHeight() {
                var calc = document.body.offsetHeight;

                var interaction = document.getElementById(this.ChatInteractionId);
                var scroller = document.getElementById(this.ChatScrollerId);

                if(scroller && interaction) {
                    var rect = scroller.getBoundingClientRect();
                    calc -= (rect.top + interaction.offsetHeight + 20);
                }

                return `${calc}px`;
            },

            Container() {
                return document.getElementById(this.ContainerId);
            },

            ScrollChat() {
                var scroller = document.getElementById(this.ChatScrollerId);
                setTimeout(() => {
                    scroller.scrollBy({
                        top: scroller.scrollHeight,
                        left: 0,
                        behavior: "smooth"
                    });
                }, 100);
            },

            Split() {
                this.Container().style.width = "calc(70% - 4px)";
                this.Container().style.float = "left";
            },

            Normal() {
                this.Container().style.width = "calc(100% - 4px)";
                this.Container().style.float = "none";
            },

            MessageDateToDate(date) {
                var timeSplit = date.split(":");
                var currentDate = new Date();
                currentDate.setHours(timeSplit[0]);
                currentDate.setMinutes(timeSplit[1]);
                currentDate.setSeconds(timeSplit[2]);
                return currentDate;
            },

            SendToVisitor(eventArgs) {
                if(eventArgs.Suggestion && eventArgs.AttachedFile) {
                    var idx = eventArgs.Text.indexOf("<span spellcheck=\"false\" contenteditable=\"false\" class=\"tag attachedFileToMessage noselect\">");
                    eventArgs.Text = eventArgs.Text.substring(0, idx);

                    var url =  `${state.webChartsURL}document.aspx?f=${eventArgs.AttachedFile.HashedFileName}`;
                    connection.SendFile(eventArgs.ChatNumber, eventArgs.AttachedFile.FileName, url);
                    var msg = {code:1, msg:`<link><name>${eventArgs.AttachedFile.FileName}</name><url>${url}</url></link>`, date: getDate(new Date()), isLink: true};
                    
                    if(this.$store.state.chatMessages[eventArgs.ChatId] == null) this.$store.state.chatMessages[eventArgs.ChatId] = [];
                    this.$store.state.chatMessages[eventArgs.ChatId].push(msg);
                    this.$store.state.currentChatMessages.push(msg);
                }

                var chat = {
                    "code" : 1,
                    "date" : getDate(new Date()),
                    "msg" : eventArgs.Text,
                    isWhisper: eventArgs.Whisper,
                }
        
                if(chat.isWhisper) {
                    chat.Name = "You"
                }
        
                if(this.$store.state.chatMessages[eventArgs.ChatId] == null) this.$store.state.chatMessages[eventArgs.ChatId] = [];
                this.$store.state.chatMessages[eventArgs.ChatId].push(chat);

                this.$store.state.currentChatMessages.push(chat);

                if(eventArgs.Whisper != true) connection.SendMessage(eventArgs.ChatNumber, eventArgs.Text);
                else connection.Whisper(eventArgs.To, eventArgs.ChatNumber, eventArgs.Text);
                this.ScrollChat();

                this.SendingTypingStatus = false;
                connection.StopTypingStatus(state.currentChat.Number);
            },

            Typing(event, text) {
                if(this.HasSuggestion) {
                    this.HasSuggestion = false;
                    this.SelectedCannedResponse = null;
                    hooks.Call(events.Chat.SuggestionNotUsed);
                } else {
                    clearTimeout(this.TypingTimer);
                    this.TypingTimer = setTimeout(() => {
                        this.SendingTypingStatus = false;
                        connection.StopTypingStatus(state.currentChat.Number);
                    }, 1000);

                    if(this.SendingTypingStatus == false) {
                        this.SendingTypingStatus = true;
                        connection.SendTypingStatus(state.currentChat.Number);
                    } 
                }
            }
        },
        computed: {
            BeingMonitoredByYou() {
                return this.chat.BeingMonitoredByYou || false;
            },
            ValidSurveys() {
                var valid = [];
                for(var i = 0; i < this.surveys.length; i++) {
                    var survey = this.surveys[i];
                    if(survey.BuiltInField != "visitor name" && survey.Value != "") {

                        valid.push(survey);
                    }

                }
                return valid;
            },
            GroupedMessages() {
                var grouped = [];
                for(var i = 0; i < this.messages.length; i++) {
                    var message = this.messages[i];
                    var name = message.code == 0 ? this.chat.Name : this.chat.TalkingTo;
                    var groupedMessage = {
                        type: message.code,
                        messages: [
                            message
                        ],
                        time: message.date,
                        isLink: message.isLink || false,
                        isWhisper: message.isWhisper || false,
                        Name: name
                    };

                    var currentTime = this.MessageDateToDate(message.date);
                    if(message.isLink == undefined || message.isLink == false) { 
                        for(var k = i + 1; k < this.messages.length; k++) {
                            var messageTime = this.MessageDateToDate(this.messages[k].date);
                            var diff = (messageTime - currentTime) / 1000;

                            if(this.messages[k].isWhisper == undefined) {this.messages[k].isWhisper = false;}
                            if(this.messages[k].isLink == undefined) {this.messages[k].isLink = false;}

                            if(
                                this.messages[k].code == message.code &&
                                diff <= 10 &&
                                this.messages[k].isLink == groupedMessage.isLink &&
                                this.messages[k].isWhisper == groupedMessage.isWhisper) {

                                groupedMessage.messages.push(this.messages[k]);
                                groupedMessage.time = this.messages[k].date;
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