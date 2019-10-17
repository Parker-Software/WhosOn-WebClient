(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
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
            <div id="cannedResponses" style="display:none; width: 30%; float:left; padding: 10px; height: 100%; border-left: 1px solid lightgray; height: calc(100vh - (100px + 310px ));">
                <h5 class="title is-5 is-pulled-left">Canned Responses</h5> 
                <div id="cannedResponsesCloseBtn" @click="Close" class="icon is-pulled-right" style="width: 20px; height: 20px;">
                    <span>&times;</span>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input id="cannedResponseSearchTxtBox" class="input" placeholder="Search" v-on:keyup.enter="Search">
                        <span class="icon is-small is-left">
                            <i class="fas fa-search"></i>
                        </span>
                    </p>
                </div>  
                <tree @ItemClicked="CannedResponseClicked" treeId="cannedResponses" v-if="IsSearching == false" :data="this.$store.state.cannedResponsesTree"></tree>
                <div v-if="IsSearching" id="fileItems" class="list is-hoverable" style="height: calc(100% - 100px); overflow-y: auto;">
                    <cannedResponseSearchItem treeId="cannedResponses"  @ItemClicked="SearchedCannedResponseClicked" v-for="item in FilteredCannedResponse" :item="item">
                    </cannedResponseSearchItem>
                </div>
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

            hooks.Register(events.Chat.AcceptChat, () => {
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
                    this.FilteredCannedResponse = Filter(this.$store.state.cannedResponses, x => x.Subject.toLowerCase().includes(actualTxt));
                        
                } else {
                    this.IsSearching = false;
                    this.$store.state.cannedResponsesRender = cannedResponsesToTree(this.$store.state.cannedResponses);
                }
            },
            CannedResponseClicked(item) {
                this.UnSelectAllTreeItems();
                var clickedItemElem = this.GetTreeItemById(item);
                clickedItemElem.classList.add("selected");
                hooks.Call(events.CannedResponses.Clicked, item);
            },
            SearchedCannedResponseClicked(item) {
                this.UnSelectAllSearchedItems();
                this.GetSearchedItemById(item).classList.add("is-active");
                hooks.Call(events.CannedResponses.Clicked, item);
            }
        }
    });
})(woServices);