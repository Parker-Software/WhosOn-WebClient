(function(services){
    Vue.component('chatConversationSurvey', {
        template: `
        <div class="survey-block">
            <div class="container is-fluid">
                <h3 class="subtitle is-4">Survey Results</h3>
                <div class="columns is-gapless">
                    <div class="column is-6">
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                    </div>
                    <div class="column is-6">
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                        <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                    </div>
                </div>
            </div>
        </div>
        `
    });
})(woServices);