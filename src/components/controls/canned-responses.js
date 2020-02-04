(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component("canned-responses", {
        props: [
           "showing",
           "selectedResponse"
        ],
        watch: {
            selectedResponse(val, oldval) { 
                if(this.selectedResponse == null) {
                    this.UnSelectAllTreeItems();
                }
             }
        },
        data: function() {
            return {
                Id: elementId(),
                IsSearching: false,
                FilteredCannedResponse: [],
            }
        },
        template: `
            <div v-bind:id="Id" class="chat-responses-container" v-bind:class="{'is-hidden': !showing}">
                <h2 class="title is-6-half is-pulled-left">Canned Responses</h2> 
                <div id="cannedResponsesCloseBtn" style="cursor:pointer;" @click="Close" class="icon is-pulled-right">
                    <i class="fas fa-times"></i>
                </div>
                <div class="field">
                    <p class="control has-icons-right">
                        <input id="cannedResponseSearchTxtBox" class="input" placeholder="Search" v-on:keyup.enter="Search">
                        <span class="icon is-small is-right">
                            <i class="fas fa-search"></i>
                        </span>
                    </p>
                </div>  
                <tree @ItemClicked="CannedResponseClicked" :treeId="Id" itemKey="Subject" v-if="IsSearching == false" :data="$store.state.cannedResponsesTree"></tree>
                <ul v-if="IsSearching" id="fileItems" class="search-list">
                    <tree-search-item :treeId="Id"  @ItemClicked="SearchedCannedResponseClicked" v-for="item in FilteredCannedResponse" :item="item">
                    </tree-search-item>
                </ul>
            </div>
        `,
        methods: {
            SearchElem() {
                return document.querySelector(`#${this.Id} #cannedResponseSearchTxtBox`);
            },
            Close() {
                this.$emit("Close");
            },
            AllTreeItems() {
                return document.querySelectorAll(`#${this.Id} .treeItem`);
            },
            AllSearchedItems() {
                return document.querySelectorAll(`#${this.Id} .searchListItem`);
            },
            UnSelectAllTreeItems() {
                var items = this.AllTreeItems();
                for(var i = 0; i < items.length; i++) {
                    var treeItem = items[i];
                    if(treeItem != null) {treeItem.classList.remove("selected");}
                }
            },
            UnSelectAllSearchedItems() {
                var items = this.AllSearchedItems();
                for(var i = 0; i < items.length; i++) {
                    var treeItem = items[i];
                    if(treeItem != null) {treeItem.classList.remove("is-active");}
                }
            },
            GetTreeItemById(item) {
                return document.querySelector(`#${this.Id}-${item.ID}`);
            },
            GetSearchedItemById(item)
            {
                return document.querySelector(`#${this.Id}-searchItem-${item.ID}`);
            },
            Search() {
                var txt = this.SearchElem().value;
                if(txt.length > 0) {
                    var actualTxt = txt.toLowerCase();
                    this.IsSearching = true;
                    this.FilteredCannedResponse = Filter(state.cannedResponses, x => x.Subject.toLowerCase().includes(actualTxt));
                        
                } else {
                    this.IsSearching = false;
                    state.cannedResponsesRender = cannedResponsesToTree(state.cannedResponses);
                }
            },
            CannedResponseClicked(item, event) {
                this.UnSelectAllTreeItems();
                var clickedItemElem = this.GetTreeItemById(item);
                clickedItemElem.classList.add("selected");
                this.$emit("Clicked", {
                    item, 
                    event
                });
            },
            SearchedCannedResponseClicked(item, event) {
                this.UnSelectAllSearchedItems();
                this.GetSearchedItemById(item).classList.add("is-active");
                this.$emit("Clicked", {
                    item, 
                    event
                });
            }
        }
    });
})(woServices);