(function(services){
    Vue.component('chatConversation', {
        template: `
        <div id="chatConversation">

            <chatConversationSurvey></chatConversationSurvey>

            <div class="active-chat" id="Conversation">
                <div class="columns is-desktop ">
                    <div class="column is-12 is-scrollable message-list">
                        <ul v-for="(v,k) in this.$store.state.chatMessages"> 
                            <li v-for="i in v">
                                <chatConversationVisitor :message="i"></chatConversationVisitor>
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