(function(services){
    Vue.component("noClosedChatsArea", {
        props: [
            "show"
        ],
        template: `
            <div class="chat-area no-chats" v-bind:class="{'is-hidden': !show}">
                <div class="logo">
                    <i class="far fa-comment-check"></i>
                    <br>
                    <p style="font-size: 0.8rem;">No Closed Chats</p>
                </div>
            </div>
        `,
    });
})(woServices);