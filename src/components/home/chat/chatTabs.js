(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    var crmWindow = null;
    var crmWindowChecker = null;

    Vue.component('chatTabs', {
        template: `
        <div class="tabs">
            <ul>
                <li id="conversationTab" class="chatTab is-active" @click="onTabClicked('conversation')"><a>Conversation</a></li>
                <!--<li><a>Previous Chats</a></li>
                <li><a>Visitor</a></li>
                <li><a>Contact</a></li>-->
                <li id="crmTab" class="chatTab" @click="onTabClicked('crm')"><a>CRM</a></li>
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
                    document.getElementById("crmTab").classList.remove("is-active");
                }
            }, 100);
        },
        methods: {
            onTabClicked( tab) {
                switch(tab) {
                    case "conversation":
                            this.unSelectAll();
                            document.getElementById("conversationTab").classList.add("is-active");
                        break;
                    case "crm":
                            if(crmWindow == null) crmWindow = window.open(state.crmURL, "Crm Form", "alwaysRaised=yes,dependent=yes,resizable=no,scrollbars=no,width=700,height=800");
                            else crmWindow.focus();
                        break;
                }


                if(crmWindow != null && crmWindow.closed == false) {
                    document.getElementById("crmTab").classList.add("is-active");
                } else {
                    document.getElementById("crmTab").classList.remove("is-active");
                }

                hooks.Call(events.Chat.TabClicked, tab);
            },
            unSelectAll() {
                var chatTabs = document.getElementsByClassName("chatTab");
                for(var i = 0; i < chatTabs.length; i++) {
                    var chatTab = chatTabs[i];
                    chatTab.classList.remove("is-active");
                }
            }
        }
    });
})(woServices);