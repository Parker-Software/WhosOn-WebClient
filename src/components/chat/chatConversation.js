(function(services){
    Vue.component('chatConversation', {
        template: `
        <div id="chatConversation">
        
            <chatConversationSurvey></chatConversationSurvey>

            <div class="active-chat" id="Conversation">
                <div class="columns is-desktop ">
                    <div class="column is-12 is-scrollable message-list">
                        <chatConversationOperator></chatConversationOperator>
                        <chatConversationVisitor></chatConversationVisitor>
                    </div>
                </div>
            </div>

            <chatConversationInteraction></chatConversationInteraction>
        </div>
        `
    });
})(woServices);