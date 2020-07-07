(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    var crmWindow = null;
    var crmWindowChecker = null;

    Vue.component("visitor-chat-tabs", {
        template: `
        <div class="visitor-chat-tabs tabs">
            <ul>
                <li 
                    id="conversationTab"
                    class="chatTab is-active"
                    @click="onTabClicked('conversation')"
                >
                    <a>Conversation</a>
                </li>
                <li id="visitorTab"
                    class="chatTab"
                    @click="onTabClicked('visitor')"
                >
                    <a>Visitor</a>
                </li>

                <!--<li><a>Previous Chats</a></li>
                <li><a>Contact</a></li>-->
                <li v-if="Object.keys($store.state.currentChatSite).length > 0 && $store.state.currentChatSite.CRM.Enabled && $store.state.currentChatSite.CRM.ShowClientForm" id="crmTab" class="chatTab" @click="onTabClicked('crm')"><a>CRM</a></li>
            </ul>
        </div>
        `,

        beforeCreate() {
            hooks.Register(events.Chat.ClickTab, (tab) => {
                this.onTabClicked(tab);
            });


            crmWindowChecker = setInterval(() => {
                if(crmWindow != null && crmWindow.closed) {
                    crmWindow = null;
                    if(this.CRMTab() != null) {this.CRMTab().classList.remove("is-active");}
                }
            }, 100);
        },

        methods: {
            CRMTab() {
                return document.getElementById("crmTab");
            },

            ConversationTab() {
                return document.querySelector(".visitor-chat-tabs #conversationTab");
            },

            VisitorTab() {
                return document.querySelector(".visitor-chat-tabs #visitorTab");
            },

            onTabClicked(tab) {
                this.unSelectAll();
                
                switch(tab) {
                    case "conversation":
                            this.ConversationTab().classList.add("is-active");
                        break;
                    case "visitor":
                            this.VisitorTab().classList.add("is-active");
                        break;
                    case "crm":
                            if(crmWindow == null) {crmWindow = window.open(state.crmURL, "Crm Form", "alwaysRaised=yes,dependent=yes,resizable=no,scrollbars=no,width=700,height=800");}
                            else {crmWindow.focus();}
                        break;
                }


                if(crmWindow != null && crmWindow.closed == false) {
                    if(this.CRMTab() != null) {this.CRMTab().classList.add("is-active");}
                } else {
                    if(this.CRMTab() != null) {this.CRMTab().classList.remove("is-active");}
                }

                hooks.Call(events.Chat.TabClicked, tab);
            },

            unSelectAll() {
                var chatTabs = document.querySelectorAll(".visitor-chat-tabs .chatTab");
                for(var i = 0; i < chatTabs.length; i++) {
                    var chatTab = chatTabs[i];
                    chatTab.classList.remove("is-active");
                }
            }
        }
    });
})(woServices);