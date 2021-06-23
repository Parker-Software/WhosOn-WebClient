(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("optionsFooter", {
        template: `
        <div id="homeOptionsFooter" class="options-footer">
            <button class="button btn" v-on:click="Save">Save</button>
            <button class="button btn" v-on:click="Cancel">Cancel</button>
            <button class="button btn" v-on:click="Logout">Logout</button>
        </div>
        `,
        methods: {
            Save() {
                hooks.call(events.Options.SaveClicked);
                services.WhosOnConn.clientOptions(this.$store.state.settings);
                this.$store.dispatch('storeSettings');
            },
            Cancel() {
                hooks.call(events.Options.CancelClicked);
            },
            Logout() {
                hooks.call(events.Options.LogoutClicked);
                services.WhosOnConn.logout();
            }
        }
    });
})(woServices);