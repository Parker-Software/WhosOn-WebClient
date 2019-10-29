(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('chatConversationSurvey', {
        props: [
            "surveys"
        ],
        template: `
        <div id="surveyBlock" class="survey-block columns">
            <div class="column">
                <span class="is-flex" v-for="item in surveys"><strong>{{ item.Name }}</strong>: {{ item.Value }}</span>
            </div>
        </div>
        `,
    });
})(woServices);