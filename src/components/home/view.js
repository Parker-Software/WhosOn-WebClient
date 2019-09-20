(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;

    Vue.component(services.Store.state.homeViewName, {
        template: `
            <section v-bind:id="this.$store.state.homeViewName">
                <homeheader></homeheader>
                <div class="columns" id="app-content">
                    <homenav></homenav>
                    <div class="column is-11" id="page-content">
                        <div class="columns">
                            <homeActiveChats></homeActiveChats>
                            <homeChatView></homeChatView>
                        </div>
                    </div>
                </div>
            </section>
            `
    });
})(woServices);