(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("cannedResponseSearchItem", {
        props: [
            "item",
            "treeId"
        ],
        template: `
            <li :id="treeId + '-searchItem-' + item.ID" class="search-item"  @click="Clicked">
                <div>
                    <h2>{{item.Subject}}</h2>
                    <p>{{item.Content}}</p>
                </div>
            </li>
            `,
        methods: {
            Clicked() {
                this.$emit("ItemClicked", this.item);
            }
        }
    });
})(woServices);