(function(services){
    
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('homeNoChatsArea', {
        template: `
            <div class="column is-9 col-pad chat-area" id="homeNoChatsArea" style="display:none">
                <div class="logo">
                    <i class="far fa-comment"></i>
                    <br>
                    <p>No Active Chats</p>
                </div>
            </div>
            `,
        beforeCreate() {
            hooks.Register(events.Navigation.ButtonClicked, (e) => {
                document.getElementById("homeNoChatsArea").style.display = "none";
            });

            hooks.Register(events.Chat.ShowNoActiveChats, (e) => {
                document.getElementById("homeNoChatsArea").style.display = "block";
            });
        }
    });
})(woServices);