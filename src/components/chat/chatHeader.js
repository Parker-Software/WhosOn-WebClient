(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;

    Vue.component('chatHeader', {
        template: `
        <div class="columns">
            <div class="column is-narrow">
                <figure class="image is-64x64">
                    <img src="https://bulma.io/images/placeholders/64x64.png" alt="Image"
                        class="is-rounded">
                    <div class="status online"><i class="fas fa-circle"></i></div>
                </figure>
            </div>
            <div class="column is-6">
                <div class="chat-header" style="margin-top: 4px;">
                    <div class="content">
                        <p>
                            <strong>{{this.$store.state.currentChat.Name}}</strong><br>
                            <small>{{this.$store.state.currentChat.SiteName}}</small>
                        </p>
                    </div>
                </div>
            </div>
            <div class="column is-5 .no-pad-right ">
                <div class="chat-header-icons is-pulled-right">
                    <a href="#" class="tooltip" data-tooltip="Close this chat" v-on:click="onClick">
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
        methods: {
            onClick() {
                var confirmation = confirm("Are you sure you wish to close this chat?");
                if (confirmation) hooks.Call(chatEvents.CloseChat, services.Store.state.currentChat.Number);
            }
        }
    });
})(woServices);