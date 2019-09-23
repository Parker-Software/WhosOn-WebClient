(function(services){
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;


    Vue.component('homeWaitingChat', {
        props: [
            'chatId',
            'chatNum',
            'name',
            'geoip',
            'site',
            'chatstatus',
            'waitingWarning',
            'isSelected'
        ],
        template: `
            <li @click="onClicked(chatNum, chatId)">
                <div :class="{'is-selected':isSelected}" class="box status-border chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>{{name}}</strong>
                                    <br>
                                    <small>{{geoip}}</small>
                                    <br>
                                    <small><strong>{{site}}</strong></small>
                                    <br>
                                    <!-- takling to, waiting etc -->
                                    <small><strong  :class="{'chat-waiting-warning':waitingWarning}">{{chatstatus}}</strong></small>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `,
        methods: {
            onClicked(chatNum, chatId) {

                var chat = services.Store.state.chats.find((v) => v.ChatUID == chatId);
                if(chat != null) {
                    if(chat.TalkingToClientConnection == 0 || chat.TalkingToClientConnection  == services.Store.state.currentConnectionId) {
                        hooks.Call(chatEvents.AcceptChat, { "Number": chatNum, "ChatId": chatId});
                    }
                }

            }
        }
    });
})(woServices);