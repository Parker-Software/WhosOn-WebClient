(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    
    Vue.component('homeChatArea', {
        template: `
            <div class="customColumn chat-area" id="homeChatArea" style="display:none">
                <chatTransfer></chatTransfer>                
                <div>
                    <chatHeader></chatHeader>
                    <chatTabs></chatTabs>
                </div>

                <chatTabContent></chatTabContent> 
            </div>
            `,
            beforeCreate() {
                hooks.Register(events.Chat.ShowActiveChats, (e) => {
                    this.Show();
                });

                hooks.Register(events.Chat.ShowNoActiveChats, (e) => {
                    this.Hide();
                });    

                hooks.Register(events.Chat.HideAll, (e) => {
                    this.Hide();
                });
                
            },
            methods: {
                Elem() {
                    return document.getElementById("homeChatArea");
                },
                Hide() {
                    this.Elem().style.display = "none";
                },
                Show() {
                    this.Elem().style.display = "block";
                }
            }
    });
})(woServices);