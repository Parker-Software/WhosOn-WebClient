(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("tree", {
        props: [
            "data",
            "treeId",
            "itemKey"
        ],
        template: `
            <ul style="height: 70%; overflow-y:auto;">
                <treeItem v-for="item in data"
                    class="item"
                    :item="item"
                    :treeId="treeId"
                    :itemKey="itemKey"
                    @make-folder="makeFolder"
                    @add-item="addItem"
                    @TreeItemClicked="ItemClicked"
                ></treeItem>
            </ul>
       `,
        methods: {
            makeFolder: function (item) {
                Vue.set(item, "children", [])
                this.addItem(item)
            },
            addItem: function (item) {
                item.children.push({
                name: "new stuff"
              })
            },
            ItemClicked(item, event) {
                this.$emit("ItemClicked", item, event);
            }
        }
    });
})(woServices);