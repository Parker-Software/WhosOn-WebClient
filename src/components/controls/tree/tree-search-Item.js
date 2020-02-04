(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("tree-search-item", {
        props: [
            "item",
            "treeId"
        ],
        template: `
            <li :id="treeId + '-searchItem-' + item.ID" class="search-item"  @click="Clicked($event)">
                <div>
                    <h2>{{item.Subject}}</h2>
                    <p>{{item.Content}}</p>
                </div>
            </li>
            `,
        methods: {
            Clicked(event) {
                this.$emit("ItemClicked", this.item, event);
            }
        }
    });
})(woServices);