(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;

    Vue.component(services.Store.state.homeViewName, {
        template: `
            <section id="homeView">
                <homeheader></homeheader>
                <div class="columns" id="app-content">
                    <homenav></homenav>
                    <div class="column is-11" id="page-content">
                        <div class="content-body">
                            <div class="columns" style="height: 100%">
                                <homeActiveChats></homeActiveChats>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            `
    });
})(woServices);