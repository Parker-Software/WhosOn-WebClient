(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component('wrapupModal', {
        props: [
            "id",
            "options"
        ],
        template: `
        <div v-bind:id="id" class="modal">
            <div class="modal-background" v-on:click="No"></div>
            <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{options.Message}}</p>
                <button class="delete" aria-label="close" v-on:click="No"></button>
            </header>
            <section class="modal-card-body" v-bind:style="{'overflow': options.Type == 'Buttons' ? 'visible' : ''}">          
                <div v-if="options.Type == 'Buttons'" class="buttons"> 
                    <a v-for="item in OptionsAsList" class="button is-info">
                        {{item}}
                    </a>
                </div>
                <div v-if="options.Type == 'List'"> 
                    <div class="list is-hoverable">
                        <a v-for="item in OptionsAsList" class="list-item">
                            {{item}}
                        </a>
                    </div>
                </div>
                <div v-if="options.Type == 'Menu'"> 
                    <tree @ItemClicked="TreeItemClicked" itemKey="Name" treeId="wrapUpTree" :data="OptionsAsTree"></tree>
                </div>
                <div v-if="options.Type == 'HyperLink'">
                    <a v-bind:href="OptionsAsHyperLink.Address" target="_blank">{{OptionsAsHyperLink.Caption || OptionsAsHyperLink.Address.split('://')[1]}}</a>
                </div>
                <br />
                <a v-if="options.Type == 'List' || options.Type == 'Menu'" class="button is-success is-small is-pulled-right" disabled>Confirm</a>
            </section>
            <footer class="modal-card-foot">
            </footer>
            </div>
        </div>
            `,
        beforeCreate() { 
            hooks.Register(events.Chat.WrapUpClicked, () => {
                this.Show();
            });
        },
        computed: {
            OptionsAsList() {
                return this.options.Options.split("|");
            },
            OptionsAsTree() {
                var options = new DOMParser().parseFromString(this.options.Options, "text/xml");

                var rootItems = options.getElementsByTagName("Menu")[0].children[0].children;
                var root = {
                    children: []
                };
                for(var i = 0; i < rootItems.length; i++) {
                    OptionToTree(rootItems[i], root);
                }
                return root.children;
            },
            OptionsAsHyperLink() {
                var split = this.options.Options.split("|");
                return {
                    Address: split[0],
                    Caption: split[1]
                }
            }
        },
        methods: {
            Show() {
                this.ModalElem().classList.add("is-active");
            },
            ModalElem() {
                return document.getElementById(this.id);
            },
            Yes() {
                this.ModalElem().classList.remove("is-active");   
            },
            No() {
                this.ModalElem().classList.remove("is-active");
            },
            TreeItemClicked(item) {
                console.log(item);
            }
        }
    });



    function OptionToTree(node, treeChild) {
        if(node.children.length > 0) {
            if(node.children[0].nodeName == "Name") {
                var child = {
                    ID: uuidv4(),
                    Name: node.children[0].textContent,
                    children: []
                };
                treeChild.children.push(child);

                if(node.children.length > 1) {
                    var children = node.children[1].children;
                    for(var i = 0; i < children.length; i++) {
                        OptionToTree(children[i], child);
                    }
                }
            }
        }
    }
})(woServices);