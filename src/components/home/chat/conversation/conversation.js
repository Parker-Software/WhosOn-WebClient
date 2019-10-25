(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('chatConversation', {
        template: `
        <div id="chatConversation" style="height:100%;">
            <div id="conversationContainer" style="margin-top: 0.75rem;">
                <chatConversationSurvey></chatConversationSurvey>
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
        }
    });
})(woServices);