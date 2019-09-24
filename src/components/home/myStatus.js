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
            
            <div class="status-options">
            <a class="button is-online" v-on:click="setToOnline">Online</a> 
            <a class="button is-busy" v-on:click="setToBusy">Busy</a>
            <a class="button is-brb" v-on:click="setToBRB">Be right back</a>
            <a class="button is-away" v-on:click="setToAway">Away</a> 
            </div>
                   
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
                hooks.Call(hookEvents.Home.StatusClosed);
            },
            setToBusy() {
                hooks.Call(hookEvents.Home.StatusChanged, "busy");
                hooks.Call(hookEvents.Home.StatusClosed);
            },
            setToBRB() {
                hooks.Call(hookEvents.Home.StatusChanged, "brb");
                hooks.Call(hookEvents.Home.StatusClosed);
            },
            setToAway() {
                hooks.Call(hookEvents.Home.StatusChanged, "away");
                hooks.Call(hookEvents.Home.StatusClosed);
            }
        }
    });
})(woServices);