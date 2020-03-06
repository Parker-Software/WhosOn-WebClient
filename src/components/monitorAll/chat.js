(function(services){
    const hooks = services.Hooks;
    const events = services.HookEvents;
    const messageGrouper = services.MessageGrouper;

    Vue.component("monitor-all-chat", {
        props: {
            chat: {
                required: true
            }
        },
        data: () => {
            return {
                InfoId: elementId(),
                SurveysId: elementId(),
                ChatScrollId: elementId(),
                OldHeight: "0px",
                ChatHeight: "0px"
            }
        },
        template: `
            <div class="chat" v-bind:class="{waiting: chat.TalkingToClientConnection == 0}">
                <div v-bind:id="InfoId" class="chat-header">
                    <b>{{chat.Name}}</b> <br />
                    <small>{{chat.Location}}</small> <br />
                    <small>{{chat.SiteName}} <span v-if="chat.Dept">({{chat.Dept}})</span></small> <br />
                    <small v-if="chat.TalkingToClientConnection == 0" v-bind:class="{waitingWarning: chat.WaitingWarning}">{{chat.WaitedFor}} <br /></small> 
                    <small v-if="chat.TalkingTo">Chatting to {{chat.TalkingTo}}</small>
                </div>
                <div v-if="Messages.length > 0" v-bind:id="SurveysId" class="chat-surveys PreChatSurveys">
                    <div v-for="field in Surveys" class="info-item info-survey">
                        <div class="is-pulled-left info-item-label"> 
                            {{field.FieldName || field.Name}}: 
                        </div>
                        <div class="is-pulled-right"> 
                            <b>{{field.FieldValue || field.Value}}</b>
                        </div>
                    </div>
                </div>
                <div v-if="Messages.length > 0" v-bind:id="ChatScrollId" class="chat-content Conversation" v-bind:style="{'height': ChatHeight}">
                    <div v-for="(v,k) in GroupedMessages" class="messages">
                        <chatConversationVisitor v-if="v.type === 0" :groupedMessage="v" preview="true"></chatConversationVisitor>
                        <chatConversationOperator v-if="v.type > 0" :groupedMessage="v" preview="true"></chatConversationOperator>
                    </div>
                </div>
            </div>
        `,
        beforeCreate() {
            setInterval(() => {
                var height = this.CalcChatHeight();
                if(height != this.OldHeight) {
                    this.ChatHeight = height;
                    this.ScrollChat();
                    this.OldHeight = this.ChatHeight;
                }
            }, 50);
        },
        created() {
            hooks.Register(events.Connection.PreviousChat, (e) => {
                var chat = this.$store.state.chats.find(x => x.ChatUID == e.Data.ChatUID);
        
                if(chat && chat.ChatUID == this.chat.ChatUID) {
                    this.ChatHeight = this.CalcChatHeight();
                    this.ScrollChat();
                }
            });

            hooks.Register(events.Connection.ListeningClient, (data) => {
                var info = data.Header.split(":");
                var chatNumber = info[0];
                var chatuid = info[1];
                var chat = this.$store.state.chats.find(x => x.ChatUID == chatuid);

                if(chat && chat.ChatUID == this.chat.ChatUID) {
                    this.ChatHeight = this.CalcChatHeight();
                    this.ScrollChat();
                }
            });

            hooks.Register(events.Connection.ListeningVisitor, (data) => {
                var info = data.Header.split(":");
                var chatNumber = info[0];
                var chatuid = info[1];
                var chat = this.$store.state.chats.find(x => x.ChatUID == chatuid);

                if(chat && chat.ChatUID == this.chat.ChatUID) {
                    this.ChatHeight = this.CalcChatHeight();
                    this.ScrollChat();
                }
            });
        },
        updated() {
            this.ChatHeight = this.CalcChatHeight();
        },
        mounted() {
            this.ChatHeight = this.CalcChatHeight();
            this.ScrollChat();
        },
        computed: {
            Surveys() {
                if (this.$store.state.chatPreSurveys[this.chat.Number] == null) {return [];}
                return this.$store.state.chatPreSurveys[this.chat.Number].filter(x => (x.FieldName || x.Name).includes("VisitorName") == false);
            },

            Messages() {
                if(this.$store.state.chatMessages[this.chat.ChatUID] == null) {return [];}
                return this.$store.state.chatMessages[this.chat.ChatUID].filter(x => x.isWhisper == undefined || x.isWhisper == false);
            },

            GroupedMessages() {
               var groups = messageGrouper.Group(this.Messages);
               return groups;
            }
        },
        methods: {
            ScrollChat() {
                var scroller = document.getElementById(this.ChatScrollId);
                setTimeout(() => {
                    if (scroller) {
                        scroller.scrollBy({
                            top: scroller.scrollHeight,
                            left: 0,
                            behavior: "smooth"
                        });
                    }
                }, 100);
            },

            CalcChatHeight() {
                var calc = 500 - 16;

                var info = document.getElementById(this.InfoId);
                var surveys = document.getElementById(this.SurveysId);

                if (info) {calc -= info.offsetHeight;}
                if (surveys) {calc -= surveys.offsetHeight;}

                return `${calc}px`;
            },
        }
    });
})(woServices);