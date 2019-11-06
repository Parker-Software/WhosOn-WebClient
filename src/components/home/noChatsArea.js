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
                this.Show();
            });

            hooks.Register(events.Chat.ShowActiveChats, (e) => {
                this.Hide();
            });

            hooks.Register(events.Chat.HideAll, (e) => {
                this.Hide();
            });
        },
        methods: {
            Elem() {
                return document.getElementById("homeNoChatsArea");
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