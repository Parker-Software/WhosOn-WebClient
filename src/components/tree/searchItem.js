(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('cannedResponseSearchItem', {
        props: [
            "item",
            "treeId"
        ],
        template: `
            <a :id="treeId + '-searchItem-' + item.ID" class="list-item searchListItem"  @click="Clicked">
                <div class="columns">
                    <div class="column is-12">
                        {{item.Subject}} <br />
                        {{item.Content}}
                    </div>
                </div>
            </a>
            `,
        methods: {
            Clicked() {
                this.$emit('ItemClicked', this.item);
            }
        }
    });
})(woServices);