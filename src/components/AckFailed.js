(function(services){
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    Vue.component("ackFailed", {
        data: () => {
            return {
                show: false
            };
        },

        template: `
            <div 
                class="ackFailed modal" 
                :class="{'is-active':show}"
            >
                
                <div class="modal-background"></div>
                <div class="modal-card">
                    <section class="modal-card-body">
                        <label>
                            <b>A connection error occurred between your web browser and the WhosOn Server.  Your connection has been disconnected and this window will reload when you dismiss this notification.  If this happens regularly then please contact your WhosOn Server Administrator.</b>
                        </label>
                        <br />
                        <br />
                        <button id="ReloadPageBtn" v-on:click="Reload">
                            Reload App
                        </button>
                    </section>
                </div>
            </div>
        `,

        beforeCreate() {
            let self = this;

            hooks.register(hook.Connection.AckFailed, () => {
                self.show = true;
            });
        },

        methods: {
            Reload() {
                location.reload();
            }
        }
    });
})(woServices);