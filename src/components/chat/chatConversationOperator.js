(function(services){
    Vue.component('chatConversationOperator', {
        props: [
            'message',
            'timeStamp'
        ],
        template: `
        <div class="columns is-gapless">
            <div class="column is-5"></div>
            <div class="column is-6">
                <div class="notification operator">
                    {{message}}
                </div>
            </div>

            <div class="column is-1 time-col"
                style="margin: auto;flex-direction: column;text-align: center;">
                {{timeStamp}}
            </div>
        </div>
        `
    });
})(woServices);