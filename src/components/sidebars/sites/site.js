(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("site", {
        props: [
            "site"
        ],
        data: () => {
            return {
                selected: false
            };
        },
        template: `
            <li v-bind:class="{active:selected}" class="site" v-on:click="Clicked"> 
                <div class="content">
                    <b>{{site.Name}}</b> <br />
                    <small>{{site.Domain}}</small>
                </div>
            </li>
        `,
        beforeCreate() {
            hooks.Register(events.Sites.Clicked, () => {
                this.selected = false;
            });
        },
        methods: {
            Clicked() {
                hooks.Call(events.Sites.Clicked, this.site.SiteKey);
                this.selected = !this.selected;
                this.$emit("Clicked", this.site.SiteKey);
            }
        }
    });
})(woServices);