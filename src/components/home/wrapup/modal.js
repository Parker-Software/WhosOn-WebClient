(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component('wrapupModal', {
        data: () => {
            return {
                SelectedValue: null
            }
        },
        props: [
            "id",
            "options"
        ],
        template: `
        <div v-bind:id="id" class="modal">
            <div class="modal-background" v-on:click="Hide"></div>
            <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{options.Message}}</p>
                <button class="delete" aria-label="close" v-on:click="Hide"></button>
            </header>
            <section class="modal-card-body" v-bind:style="{'overflow': options.Type == 'Buttons' ? 'visible' : ''}">          
                <div v-if="options.Type == 'Buttons'" class="buttons"> 
                    <a v-on:click="ButtonClicked($event, item)" v-for="item in OptionsAsList" class="button is-info option is-small">
                        {{item}}
                    </a>
                </div>
                <div v-if="options.Type == 'List'"> 
                    <div class="list is-hoverable">
                        <a v-on:click="ListItemClicked($event, item)" v-for="item in OptionsAsList" class="list-item option">
                            {{item}}
                        </a>
                    </div>
                </div>
                <div v-if="options.Type == 'Menu'"> 
                    <tree @ItemClicked="TreeItemClicked" itemKey="Name" treeId="wrapUpTree" :data="OptionsAsTree"></tree>
                </div>
                <div v-if="options.Type == 'HyperLink'">
                    <a v-on:click="HyperLinkClicked($event, item)" v-bind:href="OptionsAsHyperLink.Address" target="_blank">{{OptionsAsHyperLink.Caption || OptionsAsHyperLink.Address.split('://')[1]}}</a>
                </div>
                <br />
                <a v-on:click="ConfirmClicked" v-if="options.Type == 'List' || options.Type == 'Menu' || options.Type == 'Buttons'" class="button is-success is-small is-pulled-right" v-bind:disabled="SelectedValue == null">
                    Confirm
                </a>
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
            Hide() {
                this.ModalElem().classList.remove("is-active");
                this.SelectedValue = null;
                this.UnSelectAllTreeItems();
                this.UnSelectAllListItems();
                this.UnSelectAllButtons();
            },
            AllTreeItems() {
                return document.querySelectorAll(`#${this.id} .treeItem`);
            },
            UnSelectAllTreeItems() {
                var items = this.AllTreeItems();
                for(var i = 0; i < items.length; i++){
                    items[i].classList.remove("selected");
                }
            },
            TreeItemClicked(item) {
                this.UnSelectAllTreeItems();
                this.GetTreeItemById(item).classList.add("selected");
                this.SelectedValue = item.Name;
            },
            GetTreeItemById(item) {
                return document.querySelector(`#wrapUpTree-${item.ID}`);
            },
            AllOptions() {
                return document.querySelectorAll(`#${this.id} .option`);
            },
            UnSelectAllListItems() {
                var items = this.AllOptions();
                for(var i = 0; i < items.length; i++) {
                    items[i].classList.remove("is-active");
                }
            },
            ListItemClicked(e, item) {
                this.UnSelectAllListItems();
                e.target.classList.add("is-active");
                this.SelectedValue = item;
            },
            UnSelectAllButtons() {
                var items = this.AllOptions();
                for(var i = 0; i < items.length; i++) {
                    items[i].classList.remove("is-success"); 
                    items[i].classList.add("is-info");
                }
            },
            ButtonClicked(e, item) {
                this.UnSelectAllButtons();
                e.target.classList.remove("is-info");
                e.target.classList.add("is-success");
                this.SelectedValue = item;
            },
            HyperLinkClicked(e, item) {
                state.currentChat.WrapUpCompleted = true;
                this.Hide();
            },
            ConfirmClicked() {
                services.WhosOnConn.CompleteWrapUp(
                    state.currentChat.SiteKey,
                    state.currentChat.ChatUID,
                    this.SelectedValue);
                state.currentChat.WrapUpCompleted = true;
                this.Hide();
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