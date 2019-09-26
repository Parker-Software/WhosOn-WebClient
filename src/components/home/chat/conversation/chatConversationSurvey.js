(function(services){
    Vue.component('chatConversationSurvey', {
        template: `
        <div class="survey-block columns">
            <div class="column">
                <span class="is-flex" v-for="item in this.$store.state.currentChatPreSurveys"><strong>{{ item.Name }}</strong>: {{ item.Value }}</span>
            </div>
        </div>
        `
    });
})(woServices);