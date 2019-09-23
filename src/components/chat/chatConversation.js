(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('chatConversation', {
        template: `
        <div id="chatConversation">
            <chatConversationSurvey></chatConversationSurvey>
            <div class="active-chat" id="Conversation">
                <div class="columns">
                    <div id="chatScroller" class="column is-full message-list">
                        <div v-for="(v,k) in this.$store.state.currentChatMessages">
                            <chatConversationVisitor v-if="v.code === 0" :message="v.msg" :timeStamp="v.date"></chatConversationVisitor>
                            <chatConversationOperator v-else-if="v.code === 1" :message="v.msg" :timeStamp="v.date"></chatConversationOperator>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
            <chatConversationInteraction></chatConversationInteraction>
        </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.ScrollChat, (e) => {
                console.log('scroll');
                var scroller = document.getElementById('chatScroller');
                setTimeout(function(){
                    scroller.scrollBy({
                        top: scroller.scrollHeight,
                        left: 0,
                        behavior: 'smooth'
                    })
                }, 100);
            
            });
        }
    });
})(woServices);