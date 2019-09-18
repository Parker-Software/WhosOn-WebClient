(function(){
    var hooks = woServices.Hooks;
    var events = woServices.HookEvents;
    var connEvents = events.Connection;

    Vue.component('homeview', {
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
})();