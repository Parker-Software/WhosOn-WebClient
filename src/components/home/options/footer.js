(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('homeOptionsFooter', {
        template: `
        <div id="homeOptionsFooter" class="options-footer">
            <button class="button btn-login is-success">Save</button>
            <button class="button btn-login is-warning">Cancel</button>
            <button class="button btn-login is-info" v-on:click="Logout">Logout</button>
        </div>
        `,
        methods: {
            Logout() {
                hooks.Call(events.Options.LogoutClicked);
                services.WhosOnConn.Logout();
            }
        }
    });
})(woServices);