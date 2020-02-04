(function(services){
    Vue.component("team-chat-tab-content", {
        props: [
            "user"
        ],
        template: `
            <div style="width:100%; height:100%">
                <team-chat-conversation :user="user" :messages="$store.state.currentOperatorChatMessages"></team-chat-conversation>
            </div>
        `,
    });
})(woServices);