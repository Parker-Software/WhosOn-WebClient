(function(services){

    const hooks = services.Hooks;
    const events = services.HookEvents;
    const state = services.Store.state;
    const connection = services.WhosOnConn;

    Vue.component("visitor-chat-tab-content", {
        data: () => {
            return {
                tabSelected: null
            };
        },


        template: `
            <div style="width:100%; height:100%">

                <chatModal />

                <visitor-chat-conversation 
                    v-show="tabSelected == null || tabSelected == 'conversation'"
                    :chat="$store.state.currentChat" 
                    :site="CurrentSite" 
                    :surveys="$store.state.currentChatPreSurveys" 
                    :messages="$store.state.currentChatMessages"
                />

                <visitor-info 
                    v-show="tabSelected == 'visitor'"
                    :visitor="VisitorInfo"
                    :site="CurrentSite"
                />

            </div>
        `,

        beforeCreate() {
            let self = this;

            hooks.Register(events.Chat.TabClicked, (tab) => {
                self.tabSelected = tab;
            });

        },

        computed: {

            CurrentSite() {
                if(Object.keys(state.currentChat).length > 0) {
                    return state.sites[state.currentChat.SiteKey];
                }
                return null;
            },

            VisitorInfo() {
                return state.visitorDetail[state.currentChat.ChatUID];
            }

        }
    });

})(woServices);