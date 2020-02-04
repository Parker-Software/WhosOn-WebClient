(function(services){
    Vue.component("noChatsArea", {
        props: [
            "show"
        ],
        template: `
            <div class="chat-area no-chats" v-bind:class="{'is-hidden': !show}">
                <div class="logo">
                    <i class="far fa-comment"></i>
                    <br>
                    <p style="font-size: 0.8rem;">No Active Chats</p>
                </div>
            </div>
        `,
    });
})(woServices);