(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

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
        },
        methods: {
            onTabClicked( tab) {
                this.unSelectAll();
                switch(tab) {
                    case "conversation":
                            document.getElementById("conversationTab").classList.add("is-active");
                        break;
                    case "crm":
                            document.getElementById("crmTab").classList.add("is-active");
                        break;
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