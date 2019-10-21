(function(services){
    
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('homeNoChatsArea', {
        template: `
            <div class="customColumn chat-area" id="homeNoChatsArea" style="display:none;">
                <div class="logo">
                    <i class="far fa-comment"></i>
                    <br>
                    <p style="font-size: 0.8rem;">No Active Chats</p>
                </div>
            </div>
            `,
        beforeCreate() {
            hooks.Register(events.Chat.ShowNoActiveChats, (e) => {
                document.getElementById("homeNoChatsArea").style.display = "block";
            });

            hooks.Register(events.Chat.ShowActiveChats, (e) => {
                document.getElementById("homeNoChatsArea").style.display = "none";
            });

            hooks.Register(events.Chat.HideAll, (e) => {
                document.getElementById("homeNoChatsArea").style.display = "none";
            });
        }
    });
})(woServices);