(function(services){
    var hooks = services.Hooks;

    Vue.component('treeItem', {
        props: {
            item: Object,
            treeId: ""
        },
        template: `
            <li>
                <div
                    :id="treeId + '-' + item.ID"
                    class="treeItem"
                    :class="{hasChildren: isFolder, noChildren: isFolder == false}"
                    @click="Clicked">
                    <span v-if="isFolder" class="hasChildrenChevron" v-html="IsOpen"></span>
                    {{item.Subject}}
                </div>
                <ul class="treeNode" v-show="isOpen" v-if="isFolder">
                    <tree-item
                        :treeId="treeId"
                        class="item"
                        v-for="(child, index) in item.children"
                        :key="index"
                        :item="child"
                        @make-folder="$emit('make-folder', $event)"
                        @add-item="$emit('add-item', $event)"
                        @TreeItemClicked="ClickedForParent"
                        >
                    </tree-item>
                </ul>
            </li>
        `,
        data: function () {
            return {
                isOpen: false
            }
        },
        computed: {
            isFolder: function () {
                return this.item.children && this.item.children.length
            },
            IsOpen: function () {
                return this.isOpen ? "<i class='fas fa-chevron-right'></i>" : "<i class='fas fa-chevron-down'></i>";
            }
        },
        methods: {
            Clicked: function () {
                if (this.isFolder) {
                    this.isOpen = !this.isOpen
                }
                this.$emit('TreeItemClicked', this.item);
            },
            ClickedForParent(item) {
                this.$emit('TreeItemClicked', item);
            },
            makeFolder: function () {
                if (!this.isFolder) {
                    this.$emit('make-folder', this.item)
                    this.isOpen = true
                }
            }
        }
    });
})(woServices);