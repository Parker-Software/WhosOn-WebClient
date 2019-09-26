(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('homeChatArea', {
        template: `
            <div class="column is-9 chat-area" id="homeChatArea" style="display:none">
                <div>
                    <chatHeader></chatHeader>
                    <chatTabs></chatTabs>
                </div>

                <chatTabContent></chatTabContent> 
            </div>
            `,
            beforeCreate() {
                hooks.Register(events.Navigation.ButtonClicked, (e) => {
                    if(e != "status"){
                        document.getElementById("homeChatArea").style.display = "none";
                    }
                });

                hooks.Register(events.Chat.ShowActiveChats, (e) => {
                    document.getElementById("homeChatArea").style.display = "block";
                });

                hooks.Register(events.Chat.ShowNoActiveChats, (e) => {
                    document.getElementById("homeChatArea").style.display = "none";
                });    
            }
    });
})(woServices);