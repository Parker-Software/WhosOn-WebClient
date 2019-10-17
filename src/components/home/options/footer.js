(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('homeOptionsFooter', {
        template: `
        <div id="homeOptionsFooter" style="position:absolute; bottom:100px;">
            <button class="button btn-login">Save</button>
            <button class="button btn-login">Cancel</button>
            <button class="button btn-login" v-on:click="Logout">Logout</button>
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