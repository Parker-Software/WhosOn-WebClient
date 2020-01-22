(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component("chatConversation", {   
        data: () => {
            return {
                ShowWrapUp: false,
            }
        }, 
        template: `
        <div id="chatConversation" class="chat-conversation">
            <div id="conversationContainer" class="chat-conversation-container">
                <chatConversationSurvey v-if="validSurveys.length > 0" :surveys="validSurveys"></chatConversationSurvey>
                <div class="customColumn column" v-if="currentSite != null &&
                    currentSite.WrapUp.Enabled &&
                    ShowWrapUp && 
                    $store.state.currentChat != null &&
                    $store.state.currentChat.BeingMonitoredByYou == false">
                        <chatWrapUp :options="currentSite.WrapUp"></chatWrapUp>
                </div>
                <div class="active-chat" id="Conversation">
                    <div class="columns">
                        <div id="chatScroller" class="message-list no-gap-top no-gap-bottom" v-bind:class="{ surveyScroller: setSize() }">
                            <div v-for="(v,k) in groupedMessages" class="messages">
                                <chatConversationVisitor v-if="v.type === 0" :groupedMessage="v"></chatConversationVisitor>
                                <chatConversationOperator v-if="v.type > 0" :groupedMessage="v"></chatConversationOperator>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <cannedResponses></cannedResponses>
            <chatConversationInteraction></chatConversationInteraction>
        </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.TabClicked, (tab) => {
                if(tab != "conversation" && tab != "crm") {this.Element().style.display = "none";}
                else {this.Element().style.display = "block";}
            });

            hooks.Register(events.Chat.ScrollChat, (e) => {
                this.ScrollChat();
            });

            hooks.Register(events.Connection.CurrentChat, (e) =>{
                this.ScrollChat();
            });

            hooks.Register(events.Chat.CannedResponsesClicked, () => {
                this.Split();
            });

            hooks.Register(events.Chat.CannedResponsesClosed, () => {
                this.Normal();
            });
            hooks.Register(events.Chat.WrapUpNotCompleted, () => {
                this.ShowWrapUp = true
            });
            hooks.Register(events.ChatItem.AcceptClicked, (num, id) => {
                switch(this.currentSite.WrapUp.Show) {
                    case "From Start":
                            if(this.currentChat.WrapUpCompleted == false)  {this.ShowWrapUp = true;}
                        break;
                    default:
                        this.ShowWrapUp = false;
                        console.log(`Wrap up not accounted for - ${this.currentSite.WrapUp.Show}`);
                }


                if(this.currentChat.WrapUpCompleted)  {this.ShowWrapUp = true;}
            });

            hooks.Register(events.Connection.CurrentChatClosed, () => {
                switch(this.currentSite.WrapUp.Show) {
                    case "Session End":
                    case "Window Close":
                    case "From Start":
                            if(this.currentChat.WrapUpCompleted == false)  {this.ShowWrapUp = true;}
                        break;
                    default:
                        this.ShowWrapUp = false;
                        console.log(`Wrap up not accounted for - ${this.currentSite.WrapUp.Show}`);
                }
            });
        },
        methods: {
            setSize() {
                var surveys = state.currentChatPreSurveys;
                var valid = [];

                for(var i = 0; i < surveys.length; i++)
                {
                    var survey = surveys[i];
                    if(survey.BuiltInField != "visitor name" && survey.Value != "") {

                        valid.push(survey);
                    }

                }
                return (valid.length > 0) ? true: false;
            },
            getMessageType(type) {
               if(type === 0){
                   return false;
               }
               return true;              
            },
            Element() {
                return document.getElementById("chatConversation");
            },
            Container() {
                return document.getElementById("conversationContainer");
            },
            ScrollChat() {
                var scroller = document.getElementById("chatScroller");
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
            }
        },
        computed: {
            BeingMonitoredByYou() {
                return state.currentChat.BeingMonitoredByYou;
            },
            validSurveys() {
                var surveys = state.currentChatPreSurveys;
                var valid = [];

                for(var i = 0; i < surveys.length; i++)
                {
                    var survey = surveys[i];
                    if(survey.BuiltInField != "visitor name" && survey.Value != "") {

                        valid.push(survey);
                    }

                }
                return valid;
            },
            chatMessages() {
                return state.currentChatMessages;
            },
            currentSite() {
                var site = null;
                if(Object.keys(state.currentChat).length > 0) {
                    site = state.sites[state.currentChat.SiteKey];
                }

                return site;
            },
            currentChat() {
                return state.currentChat;
            },          
            groupedMessages() {
                var grouped = [];
                for(var i = 0; i < this.chatMessages.length; i++) {
                    var message = this.chatMessages[i];
                    var name = message.code == 0 ? state.currentChat.Name : state.currentChat.TalkingTo;
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

                    console.log(groupedMessage);

                    var currentTime = this.MessageDateToDate(message.date);

                    if(message.isLink == undefined || message.isLink == false) { 
                        for(var k = i + 1; k < this.chatMessages.length; k++) {

                            var messageTime = this.MessageDateToDate(this.chatMessages[k].date);
                            var diff = (messageTime - currentTime) / 1000;

                        if(this.chatMessages[k].isWhisper == undefined) {this.chatMessages[k].isWhisper = false;}
                        if(this.chatMessages[k].isLink == undefined) {this.chatMessages[k].isLink = false;}

                            if(
                                this.chatMessages[k].code == message.code &&
                                diff <= 10 &&
                                this.chatMessages[k].isLink == groupedMessage.isLink &&
                                this.chatMessages[k].isWhisper == groupedMessage.isWhisper) {

                                groupedMessage.messages.push(this.chatMessages[k]);
                                groupedMessage.time = this.chatMessages[k].date;
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