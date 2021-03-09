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

        props: {
            closedChatView: {
                type: Boolean,
                default: false
            }
        },

        template: `
            <div style="width:100%; height:100%">

                <chatModal />

                <visitor-chat-conversation 
                    v-show="tabSelected == null || tabSelected == 'conversation'"
                    :chat="Chat" 
                    :site="CurrentSite" 
                    :surveys="Survey" 
                    :messages="Messages"
                    :closedChatView="closedChatView"
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

            Chat() {
                if (this.closedChatView) return state.currentClosedChat;
                return state.currentChat;
            },

            Messages() {
                if (this.Chat.ChatUID == state.currentChat.ChatUID) {
                    return state.currentChatMessages;
                }
                return this.Chat.Messages || [];
            },

            Survey() {
                if (this.Chat.ChatUID == state.currentChat.ChatUID) {
                    return state.currentChatPreSurveys;
                }
                return this.Chat.PreSurveys || [];
            },

            CurrentSite() {
                if(Object.keys(this.Chat).length > 0) {
                    return state.sites[this.Chat.SiteKey];
                }
                return null;
            },

            VisitorInfo() {
                if (this.closedChatView) {
                    return this.Chat.VisitorDetail;
                } else {
                    return state.visitorDetail[this.Chat.ChatUID];
                }
            }

        }
    });

})(woServices);