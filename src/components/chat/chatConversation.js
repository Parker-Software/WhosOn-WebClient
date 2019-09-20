(function(services){
    Vue.component('chatConversation', {
        template: `
        <div id="chatConversation">

            <chatConversationSurvey></chatConversationSurvey>

            <div class="active-chat" id="Conversation">
                <div class="columns is-desktop ">
                    <div class="column is-12 is-scrollable message-list">
                        <div v-for="(v,k) in this.$store.state.chatMessages"> 
                            <div v-for="i in v">
                                <chatConversationVisitor v-if="i.code === 0" :message="i.msg" :timeStamp="i.date"></chatConversationVisitor>
                                <chatConversationOperator v-else-if="i.code === 1" :message="i.msg" :timeStamp="i.date"></chatConversationOperator>
                            <div>
                        </div>                       
                    </div>
                </div>
            </div>

            <chatConversationInteraction></chatConversationInteraction>
        </div>
        `
    });
})(woServices);