(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component('chatConversation', {
        data: () => {
            return {
                ShowWrapUp: false
            }
        },
        template: `
        <div id="chatConversation" style="height:100%;">
            <div id="conversationContainer" style="margin-top: 0.75rem;">
                <chatConversationSurvey v-if="validSurveys.length > 0" :surveys="validSurveys"></chatConversationSurvey>
                <conversationWrapUp v-if="currentSite != null && currentSite.WrapUp.Enabled && ShowWrapUp" :options="currentSite.WrapUp"></conversationWrapUp>
                <div class="active-chat" id="Conversation">
                    <div class="columns">
                        <div id="chatScroller" class="column is-full message-list">
                            <div v-for="(v,k) in this.$store.state.currentChatMessages">
                                <chatConversationVisitor v-if="v.code === 0" :message="v"></chatConversationVisitor>
                                <chatConversationOperator v-else-if="v.code > 0" :message="v"></chatConversationOperator>
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

            hooks.Register(events.ChatItem.AcceptClicked, (num, id) => {
                switch(this.currentSite.WrapUp.Show) {
                    case "From Start":
                            if(this.currentChat.WrapUpCompleted == false)  this.ShowWrapUp = true;
                            else this.ShowWrapUp = false;
                        break;
                    default:
                        this.ShowWrapUp = false;
                        console.log(`Wrap up not accounted for - ${this.currentSite.WrapUp.Show}`);
                }
            });

            hooks.Register(events.Connection.CurrentChatClosed, () => {
                switch(this.currentSite.WrapUp.Show) {
                    case "Session End":
                    case "Window Close":
                            if(this.currentChat.WrapUpCompleted == false)  this.ShowWrapUp = true;
                            else this.ShowWrapUp = false;
                        break;
                    default:
                        this.ShowWrapUp = false;
                        console.log(`Wrap up not accounted for - ${this.currentSite.WrapUp.Show}`);
                }
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
                    })
                }, 100);
            },
            Split() {
                this.Container().style.width = "70%";
                this.Container().style.float = "left";
            },
            Normal() {
                this.Container().style.width = "100%";
                this.Container().style.float = "none";
            }
        },
        computed: {
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
            currentSite() {
                var site = null;
                if(Object.keys(state.currentChat).length > 0) {
                    site = state.sites[state.currentChat.SiteKey];
                }

                return site;
            },
            currentChat() {
                return state.currentChat;
            }
        }
    });
})(woServices);