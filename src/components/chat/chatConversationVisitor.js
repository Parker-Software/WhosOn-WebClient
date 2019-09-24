(function(services){
    Vue.component('chatConversationVisitor', {
        props: [
            'message',
            'timeStamp'
        ],
        template: `
        <div class="columns is-gapless">
            <div class="column is-8">
                <div class="notification visitor">
                    {{message}}
                </div>
            </div>
            <div class="column is-3"></div>
            <div class="column is-1 is-flex time-col"
                style="margin: auto;flex-direction: column;text-align: center;">
                <time>{{timeStamp}}</time>
            </div>
        </div>
        `
    });
})(woServices);