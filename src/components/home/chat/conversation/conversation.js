(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component('chatConversation', {
        template: `
        <div id="chatConversation" class="chat-conversation">
            <div id="conversationContainer" class="chat-conversation-container">
                <chatConversationSurvey v-if="validSurveys.length > 0" :surveys="validSurveys"></chatConversationSurvey>
                <div class="active-chat" id="Conversation">
                    <div class="columns">
                        <div id="chatScroller" class="column is-full message-list no-gap-top no-gap-bottom">
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
                if(tab != "conversation" && tab != "crm") this.Element().style.display = "none";
                else this.Element().style.display = "block";
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
        },
        methods: {
            Element() {
                return document.getElementById("chatConversation");
            },
            Container() {
                return document.getElementById("conversationContainer");
            },
            ScrollChat() {
                var scroller = document.getElementById('chatScroller');
                setTimeout(() => {
                    scroller.scrollBy({
                        top: scroller.scrollHeight,
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 100);
            },
            Split() {
                this.Container().style.width = "70%";
                this.Container().style.float = "left";
            },
            Normal() {
                this.Container().style.width = "100%";
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
            groupedMessages() {
                var grouped = [];
                for(var i = 0; i < this.chatMessages.length; i++) {
                    var message = this.chatMessages[i];
                    var groupedMessage = {
                        type: message.code,
                        messages: [
                            message
                        ],
                        time: message.date,
                        isLink: message.isLink || false,
                        isWhisper: message.isWhisper || false,
                        Name: message.Name || ""
                    };

                    var currentTime = this.MessageDateToDate(message.date);

                    for(var k = i + 1; k < this.chatMessages.length; k++) {

                        var messageTime = this.MessageDateToDate(this.chatMessages[k].date);
                        var diff = (messageTime - currentTime) / 1000;

                        if(this.chatMessages[k].isWhisper == undefined) this.chatMessages[k].isWhisper = false;
                        if(this.chatMessages[k].isLink == undefined) this.chatMessages[k].isLink = false;

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

                    grouped.push(groupedMessage);
                    i += groupedMessage.messages.length - 1;
                }
                return grouped;
            }
        }
    });
})(woServices);