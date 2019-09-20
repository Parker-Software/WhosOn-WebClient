(function(services){
    Vue.component('homeWaitingChat', {
        props: [
            'chatNum',
            'name',
            'geoip',
            'site',
            'chatstatus',
            'waitingWarning'
        ],
        template: `
            <li @click="onClicked(chatNum)">
                <div :class="{ longWait: waitingWarning }" class="box status-border chat-info is-selected">
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
                                    <small><strong>{{chatstatus}}</strong></small>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `,
        methods: {
            onClicked(chatNum) {
               services.WhosOnConn.AcceptChat(chatNum);
            }
        }
    });
})(woServices);