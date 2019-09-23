(function(services){

    var hooks = services.Hooks;
    var hookEvents = services.HookEvents;

    Vue.component('homeMyStatus', {
        template: `
        <div id="statusModal" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Change Status To</p>
                <button class="delete" aria-label="close" v-on:click="closeStatus"></button>
            </header>
            <section class="modal-card-body">
                    <a class="button is-success" v-on:click="setToOnline">Online</a> <br /> <br />
                    <a class="button is-danger" v-on:click="setToBusy">Busy</a> <br /> <br />
                    <a class="button is-warning" v-on:click="setToBRB">Be right back</a> <br /> <br />
                    <a class="button is-danger" v-on:click="setToAway">Away</a> <br /> <br />
            </section>
            <footer class="modal-card-foot">
            </footer>
            </div>
        </div>
            `,
        methods: {
            closeStatus() {
                hooks.Call(hookEvents.Home.StatusClosed);
            },
            setToOnline() {
                hooks.Call(hookEvents.Home.StatusChanged, "online");
            },
            setToBusy() {
                hooks.Call(hookEvents.Home.StatusChanged, "busy");
            },
            setToBRB() {
                hooks.Call(hookEvents.Home.StatusChanged, "brb");
            },
            setToAway() {
                hooks.Call(hookEvents.Home.StatusChanged, "away");
            }
        }
    });
})(woServices);