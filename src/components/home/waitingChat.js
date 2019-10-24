(function(services){
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;


    Vue.component('homeWaitingChat', {
        props: [
            'chat'
        ],
        template: `
            <li @click="onClicked">
                <div :class="{'is-selected':chat.IsActiveChat, 'beingMonitored':chat.Monitoredby != null}" class="box status-border chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>{{chat.Name}}</strong>
                                    <br />
                                    <small>{{chat.Location}}</small>
                                    <br />
                                    <small><strong>{{chat.SiteName}}</strong></small>
                                    <br />
                                    <!-- takling to, waiting etc -->
                                    <small><strong  :class="{'chat-waiting-warning':chat.WaitingWarning}">{{chat.Status}}</strong></small>
                                    <br />
                                    <small v-if="chat.Monitoredby != null"><strong>Monitored By {{MonitoredByWho}}</strong></small>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `,
        computed: {
            MonitoredByWho() {
                if(this.chat.Monitoredby == this.$store.state.userInfo.Name) return "You";
                else return this.chat.Monitoredby;
            }
        },
        methods: {
            onClicked() {
                if(this.chat.TalkingToClientConnection == 0 || this.chat.TalkingToClientConnection  == services.Store.state.currentConnectionId) {
                    hooks.Call(chatEvents.AcceptChat, { "Number": this.chat.Number, "ChatId": this.chat.ChatUID});
                } else if (this.chat.TalkingToClientConnection !== services.Store.state.currentConnectionId) {
                  if(this.$store.state.rights.MonitorChats) hooks.Call(chatEvents.MonitorChat, {"Number": this.chat.Number, "ChatId": this.chat.ChatUID });
                }
            }
        }
    });
})(woServices);