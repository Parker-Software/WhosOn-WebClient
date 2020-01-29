(function (services) {

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;
    var state = services.Store.state;

    Vue.component("dialogue", {
        props: [
            "title",
            "content",
            "yesCallback",
            "noCallback",
            "show"
        ],
        template: `
            <div class="modal" v-bind:class="{'is-active': show}">
                <div class="modal-background" v-on:click="Close"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">{{title}}</p>
                        <button class="delete" aria-label="close" v-on:click="Close"></button>
                    </header>
                    <section class="modal-card-body" style="color: black;">
                        <p v-html="content">
                        </p>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" v-on:click="Yes">Yes</button>
                        <button class="button" v-on:click="Close">No</button>
                    </footer>
                </div>
            </div>
        `,  
        methods: {
            Yes() {
                if(this.yesCallback) {this.yesCallback();}
            },
            Close() {
                if(this.noCallback) {this.noCallback();}
            }
        }
    });
})(woServices);