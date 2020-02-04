(function(services){

    var state = services.Store.state;

    Vue.component("visitor-chat-tab-content", {
        template: `
            <div style="width:100%; height:100%">
                <chatModal></chatModal>
                <visitor-chat-conversation 
                    :chat="$store.state.currentChat" 
                    :site="CurrentSite" 
                    :surveys="$store.state.currentChatPreSurveys" 
                    :messages="$store.state.currentChatMessages"
                ></visitor-chat-conversation>
            </div>
        `,
        computed: {
            CurrentSite() {
                if(Object.keys(state.currentChat).length > 0) {
                    return state.sites[state.currentChat.SiteKey];
                }
                return null;
            }
        }
    });
})(woServices);