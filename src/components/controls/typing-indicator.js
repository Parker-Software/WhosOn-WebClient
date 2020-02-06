
(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var state = services.Store.state;

    Vue.component("typing-indicator", {
        props: [

        ],
        template:
        `
            <div class="typingindicator">
                <span class="a"></span>
                <span class="b"></span>
                <span class="c"></span>
            </div>
        `,
    });
})(woServices);
