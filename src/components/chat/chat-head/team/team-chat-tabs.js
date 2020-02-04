(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component("team-chat-tabs", {
        template: `
            <div class="tabs">
                <ul>
                    <li class="chatTab is-active"><a>Conversation</a></li>
                </ul>
            </div>
        `,
    });
})(woServices);