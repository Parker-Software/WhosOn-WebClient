(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;

    Vue.component('homeMyStatus', {
        template: `
        <div id="statusModal" class="modal">
            <div class="modal-background" v-on:click="closeStatus"></div>
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
        </div>
            `,
        beforeCreate() { 
            hooks.Register(navEvents.MyStatusClicked, (e) => {
                this.Show()
            });

            hooks.Register(events.Home.StatusClosed, () => {
                this.Hide();
            });
        },
        methods: {
            Elem() {
                return document.getElementById("statusModal");
            },
            Show() {
                this.Elem().classList.add("is-active");
            },
            Hide() {
                this.Elem().classList.remove("is-active");
            },
            closeStatus() {
                hooks.Call(events.Home.StatusClosed);
            },
            setToOnline() {
                hooks.Call(events.Home.StatusChanged, "online");
                hooks.Call(events.Home.StatusClosed);
            },
            setToBusy() {
                hooks.Call(events.Home.StatusChanged, "busy");
                hooks.Call(events.Home.StatusClosed);
            },
            setToBRB() {
                hooks.Call(events.Home.StatusChanged, "brb");
                hooks.Call(events.Home.StatusClosed);
            },
            setToAway() {
                hooks.Call(events.Home.StatusChanged, "away");
                hooks.Call(events.Home.StatusClosed);
            },
            
        }
    });
})(woServices);