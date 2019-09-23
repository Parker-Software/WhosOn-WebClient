(function(services){
    Vue.component('chatConversationVisitor', {
        props: [
            'message',
            'timeStamp'
        ],
        template: `
        <div class="columns is-gapless">
            <div class="column is-6">
                <div class="notification visitor">
                    {{message}}
                </div>
            </div>
            <div class="column is-5"></div>
            <div class="column is-1 is-flex time-col"
                style="margin: auto;flex-direction: column;text-align: center;">
                <time>{{timeStamp}}</time>
            </div>
        </div>
        `
    });
})(woServices);