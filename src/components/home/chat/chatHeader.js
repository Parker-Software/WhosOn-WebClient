(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    var state = services.Store.state;

    Vue.component('chatHeader', {
        template: `
        <div class="columns"  style="padding: 0.75rem;">
            <div class="column is-narrow">
                <figure class="image is-64x64">
                    <img src="https://bulma.io/images/placeholders/64x64.png" alt="Image"
                        class="is-rounded">
                    <div v-if="this.$store.state.currentChat.Closed == false" class="status online"><i class="fas fa-circle"></i></div>
                    <div v-if="this.$store.state.currentChat.Closed == true" class="status busy"><i class="fas fa-circle"></i></div>
                </figure>
            </div>
            <div class="column">
                <div class="chat-header" style="margin-top: 4px;">
                    <div class="content">
                        <p>
                            <strong>{{this.$store.state.currentChat.Name}} <span v-if="this.$store.state.currentChat.Closed">(Closed)</span> </strong><br>
                            <small>{{this.$store.state.currentChat.SiteName}}</small>
                        </p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="chat-header-icons is-pulled-right">
                    <a id="closeChatBtn" href="#" class="tooltip" data-tooltip="Close this chat" v-on:click="onClick">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <!--
                    <a href="#" data-show="quickview" data-target="quickviewDefault" class="tooltip" data-tooltip="Show transfer list">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-users fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <a href="#" class="tooltip" data-tooltip="Request monitor">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-graduation-cap fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <a href="#" class="tooltip" data-tooltip="Email transcript">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-envelope fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <a href="#" class="tooltip" data-tooltip="Show block options">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-ban fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>-->



                </div>
            </div>
        </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.AcceptChat, (e) => {
                this.enableCloseChatButton();
            });
        },
        methods: {
            disableCloseChatButton() {
                var closeChatButton = document.getElementById("closeChatBtn");
                closeChatButton.setAttribute("disabled", "");
            },
            enableCloseChatButton() {
                var closeChatButton = document.getElementById("closeChatBtn");
                closeChatButton.removeAttribute("disabled");
            },
            onClick(e) {
                e.preventDefault();
                var confirmation = confirm("Are you sure you wish to close this chat?");
                if (confirmation) { 
                    this.disableCloseChatButton();
                    hooks.Call(chatEvents.CloseChat, services.Store.state.currentChat.Number);
                }
            }
        }
    });
})(woServices);