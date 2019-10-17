(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('chatConversationSurvey', {
        template: `
        <div id="surveyBlock" class="survey-block columns">
            <div class="column">
                <span class="is-flex" v-for="item in validSurveys"><strong>{{ item.Name }}</strong>: {{ item.Value }}</span>
            </div>
        </div>
        `,
        beforeCreate() {
        },
        methods: {
        },
        computed: {
            validSurveys() {
                var surveys = this.$store.state.currentChatPreSurveys;
                var valid = [];

                for(var i = 0; i < surveys.length; i++)
                {
                    var survey = surveys[i];
                    if(survey.BuiltInField != "visitor name") {

                        valid.push(survey);
                    }

                }
                return valid;
            }
        }
    });
})(woServices);