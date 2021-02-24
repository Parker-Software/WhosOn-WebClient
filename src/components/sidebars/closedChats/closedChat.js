(function(services){
    var state = services.Store.state;
    var events = services.HookEvents;
    var hooks = services.Hooks;
    
    Vue.component("closedChat", {
        props: [
            "chat"
        ],
        template: `
            <li @click="onClicked">
                <div :class="{'is-selected':IsSelectedClosedChat}" class="box status-border chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <p class="chat-info-item"><strong>{{chat.Name}}</strong><span v-if="WaitingWrapup" class="waiting-wrapup-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                            </span></p>
                                <p v-if="chat.Channel" class="chat-info-item"><small>{{chat.Channel}}</small></p>
                                <p v-else class="chat-info-item"><small>{{chat.Location}}</small></p>
                                <p class="chat-info-item"><small><strong>{{chat.SiteName}}</strong></small></p>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `,
        computed: {
            IsSelectedClosedChat() {
                return state.currentClosedChat == this.chat;
            },
            WaitingWrapup() {
                return !this.chat.WrapUpCompleted;
            }
        },
        watch: {
            '$store.state.currentClosedChat' : function() {
                if (state.currentClosedChat.ChatUID == this.chat.ChatUID) {
                    this.$forceUpdate()
                }
            }
       },
        methods: {
            onClicked() {
                var element = document.getElementById("homeClosedChats");
                var wrapper = document.getElementById("closed-chats-wrapper");
                hooks.Call(events.ChatItem.ClosedChatClicked, { "ChatId": this.chat.ChatUID});
                state.currentClosedChat = this.chat;
                element.classList.toggle("show");   
                wrapper.classList.toggle("opacity");            
            }
        }
    });
})(woServices);