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
                    <b>{{site.Name}} <span v-if="SiteVisitors != null && SiteVisitors != 0">[{{SiteVisitors}}]</span> </b> <br />
                    <small>{{site.Domain}}</small>
                </div>
            </li>
        `,
        beforeCreate() {
            hooks.register(events.Sites.Clicked, () => {
                this.selected = false;
            });
        },
        computed: {
            SiteVisitors() {
                return this.$store.state.sitesVisitors[this.site.SiteKey];
            }
        },
        methods: {
            Clicked() {
                hooks.call(events.Sites.Clicked, this.site.SiteKey);
                this.selected = !this.selected;
                this.$emit("Clicked", this.site.SiteKey);
            }
        }
    });
})(woServices);