(function(services){
    Vue.component('chatConversation', {
        template: `
        <div id="chatConversation">
            <chatConversationSurvey></chatConversationSurvey>
            <div class="active-chat" id="Conversation">
                <div class="columns is-desktop">
                    <div class="column is-12 is-scrollable message-list">
                        <ul id="example-1">
                            <li v-for="t in this.$store.state.currentChatMessages">
                                {{ t }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <chatConversationInteraction></chatConversationInteraction>
        </div>
        `
    });
})(woServices);