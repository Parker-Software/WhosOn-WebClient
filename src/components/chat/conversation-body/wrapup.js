(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    var state = services.Store.state;

    Vue.component("chatWrapUp", {    
        props: [
            "options"
        ],      
        data: () => {
            return {
                SelectedValue: null
            }
        }, 
        template: `
        <div id="wrapup" class="wrapup-block"> 
            <div class="wrapup-content" v-if="isWrapUpComplete">
                <h2>Wrap Up Complete</h2>
                <p><strong>{{SelectedValue}}</strong></p>
                <br>
                <span><a class="button is-option is-small is-fullwidth" v-on:click="CloseChat">Close</a></span>
            </div>               
            <div class="wrapup-content" v-if="isWrapUpComplete == false">
                <h2>{{options.Message}}</h2>    
                <section v-bind:style="{'overflow': options.Type == 'Buttons' ? 'visible' : ''}">          
                    <div v-if="options.Type == 'Buttons'" class="buttons"> 
                        <a v-on:click="Clicked($event, item)" v-for="item in OptionsAsList" class="button is-option option is-small">
                            {{item}}
                        </a>
                    </div>                    
                    <div v-if="options.Type == 'List'" > 
                        <select class="wrapup-select">
                            <option v-for="item in OptionsAsList">
                                {{item}}
                            </option>
                        </select>
                        <span>
                            <a class="button is-option is-small">Select</a>
                        </span>                      
                    </div>
                    <div v-if="options.Type == 'Menu'" class="tree-options" id="treeContainer"> 
                        <tree @ItemClicked="TreeItemClicked" itemKey="Name" treeId="wrapUpTree" :data="OptionsAsTree"></tree>
                        <div class="is-pulled-right"><button id="treeSelectButton" v-on:click="treeSelectButtonClicked" class="button is-option is-small" disabled>Select</button></div>
                    </div>
                    <div v-if="options.Type == 'HyperLink'">
                        <a v-on:click="HyperLinkClicked($event, item)" v-bind:href="OptionsAsHyperLink.Address" target="_blank">{{OptionsAsHyperLink.Caption || OptionsAsHyperLink.Address.split('://')[1]}}</a>
                    </div>              
            </section>          
            </div>
          
        </div>
        `,
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
            },
            isWrapUpComplete(){
                return state.currentChat.WrapUpCompleted;
            }
        },
        methods: {
            Clicked(e,item) {
                hooks.Call(events.Chat.WrapUpClicked);
                this.isCompleted = true;
                this.SelectedValue = item
                services.WhosOnConn.CompleteWrapUp(
                    state.currentChat.SiteKey,
                    state.currentChat.ChatUID,
                    this.SelectedValue);
                state.currentChat.WrapUpCompleted = true;
            },
            CloseChat(){               
                hooks.Call(chatEvents.CloseChatClicked, state.currentChat.Number);
            },
            AllTreeItems() {
                return document.getElementById("treeContainer");
            },
            UnSelectAllTreeItems() {
                var container = document.getElementById("treeContainer");
                var elements = container.getElementsByClassName("selected");
                
                while (elements[0]) {
                    elements[0].classList.remove("selected");
                }
            },
            TreeItemClicked(item) {
                this.UnSelectAllTreeItems();
                this.GetTreeItemById(item).classList.add("selected");
                this.SelectedValue = item.Name;
                var button = this.GetTreeButton();
                button.disabled = false;
            },
            treeSelectButtonClicked(){
                hooks.Call(events.Chat.WrapUpClicked);
                this.isCompleted = true;
                services.WhosOnConn.CompleteWrapUp(
                    state.currentChat.SiteKey,
                    state.currentChat.ChatUID,
                    this.SelectedValue);
                state.currentChat.WrapUpCompleted = true;
            },
            GetTreeItemById(item) {
                return document.querySelector(`#wrapUpTree-${item.ID}`);
            },
            GetTreeButton(){
                return document.getElementById("treeSelectButton");
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