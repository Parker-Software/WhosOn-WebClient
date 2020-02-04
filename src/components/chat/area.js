(function(services){
    Vue.component("chattingArea", {
        props: [
            "show",
            "chat",
            "user"
        ],
        template: `
            <div class="chat-area" v-bind:class="{'is-hidden': !show}">
                <chat-transfer v-if="chat != null"></chat-transfer>    
                <div>
                    <visitor-chat-header v-if="chat != null" :chat="chat"></visitor-chat-header>
                    <team-chat-Header v-if="user != null" :user="user"></team-chat-Header>

                    <visitor-chat-tabs v-if="chat != null"></visitor-chat-tabs>
                    <team-chat-tabs v-if="user != null"></team-chat-tabs>
                </div>
                <visitor-chat-tab-content v-if="chat != null"></visitor-chat-tab-content> 
                <team-chat-tab-content v-if="user != null" :user="user"></team-chat-tab-content> 
            </div>
        `,
    });
})(woServices);