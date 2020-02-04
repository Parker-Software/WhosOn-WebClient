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
                hooks.Call(events.Options.SaveClicked);
                services.WhosOnConn.ClientOptions(this.$store.state.settings);
            },
            Cancel() {
                hooks.Call(events.Options.CancelClicked);
            },
            Logout() {
                hooks.Call(events.Options.LogoutClicked);
                services.WhosOnConn.Logout();
            }
        }
    });
})(woServices);