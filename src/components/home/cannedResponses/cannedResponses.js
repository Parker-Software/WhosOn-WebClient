(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;
    var connection = services.WhosOnConn;

    Vue.component('cannedResponses', {
        data: function() {
            return {
                IsShowing: false,
                IsSearching: false,
                FilteredCannedResponse: [],
            }
        },
        template: `
            <div id="cannedResponses" class="chat-responses-container">
                <h2 class="title is-6-half is-pulled-left">Canned Responses</h2> 
                <div id="cannedResponsesCloseBtn" @click="Close" class="icon is-pulled-right">
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
                <tree @ItemClicked="CannedResponseClicked" treeId="cannedResponses" itemKey="Subject" v-if="IsSearching == false" :data="$store.state.cannedResponsesTree"></tree>
                <ul v-if="IsSearching" id="fileItems" class="search-list">
                    <cannedResponseSearchItem treeId="cannedResponses"  @ItemClicked="SearchedCannedResponseClicked" v-for="item in FilteredCannedResponse" :item="item">
                    </cannedResponseSearchItem>
                </ul>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.CannedResponsesClicked, () => {
                if(this.IsShowing == false) {
                    this.Element().style.display = "block";
                    this.IsShowing = true;
                } else { 
                    this.UnSelectAllTreeItems();
                    this.Close();
                }
            });

            hooks.Register(events.ChatItem.AcceptClicked, () => {
                this.UnSelectAllTreeItems();
                this.UnSelectAllSearchedItems();
                this.Close();
            });


            hooks.Register(events.Connection.CurrentChatClosed, () => {
                this.UnSelectAllTreeItems();
                this.UnSelectAllSearchedItems();
                this.Close();
            });

            hooks.Register(events.Chat.SuggestionSent, () => {
                this.UnSelectAllTreeItems();
                this.UnSelectAllSearchedItems();
            });

            hooks.Register(events.Chat.SuggestionNotUsed, () => {
                this.UnSelectAllTreeItems();
                this.UnSelectAllSearchedItems();
            });
        },
        methods: {
            Element() {
                return document.getElementById("cannedResponses");
            },
            SearchElem() {
                return document.getElementById("cannedResponseSearchTxtBox");
            },
            Close() {
                this.Element().style.display = "none";
                this.IsShowing = false;
                hooks.Call(events.Chat.CannedResponsesClosed);
            },
            AllTreeItems() {
                return document.querySelectorAll("#cannedResponses .treeItem");
            },
            AllSearchedItems() {
                return document.querySelectorAll("#cannedResponses .searchListItem");
            },
            UnSelectAllTreeItems() {
                var items = this.AllTreeItems();
                for(var i = 0; i < items.length; i++) {
                    var treeItem = items[i];
                    if(treeItem != null) treeItem.classList.remove("selected");
                }
            },
            UnSelectAllSearchedItems() {
                var items = this.AllSearchedItems();
                for(var i = 0; i < items.length; i++) {
                    var treeItem = items[i];
                    if(treeItem != null) treeItem.classList.remove("is-active");
                }
            },
            GetTreeItemById(item) {
                return document.querySelector(`#cannedResponses-${item.ID}`);
            },
            GetSearchedItemById(item)
            {
                return document.querySelector(`#cannedResponses-searchItem-${item.ID}`);
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
                hooks.Call(events.CannedResponses.Clicked, {
                    item,
                    event
                });
            },
            SearchedCannedResponseClicked(item, event) {
                this.UnSelectAllSearchedItems();
                this.GetSearchedItemById(item).classList.add("is-active");
                hooks.Call(events.CannedResponses.Clicked, {
                    item,
                    event
                });
            }
        }
    });
})(woServices);