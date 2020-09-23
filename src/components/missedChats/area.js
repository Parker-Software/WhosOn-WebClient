(function(services){

    var connection = services.WhosOnConn;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component("missedChatsArea", {
        data: () => {
            return {
                selectedChat: null,
                searchTerms: null,
                tableView: false,
                chatDetail: {},
            }
        },
        template: `
            <div style="height: 100%;">
                <div class="previous-chats-container" style="padding: 0;" v-bind:class="{'showingViewChat': selectedChat != null}">
                    <div class="missed-chats">
                        <h5 class="title is-6-half" style="margin-bottom: 10px">
                            {{Status}}
                        </h5>

                        <div class="field searchField">
                            <p style="float: left; width: calc(100% - 40px)" class="control has-icons-right">
                                <input id="searchConversation" class="input" type="text" placeholder="Search Missed Chats" v-on:keyup="Search" v-on:keyup.enter="Search">                        
                                <span class="icon is-small is-right">
                                    <i class="fas fa-search"></i>
                                </span>
                            </p>

                            <button v-if="tableView == false"  v-on:click="ViewChangeClicked" href="#" class="has-tooltip-left gridBtn" data-tooltip="Change to grid or card view">
                                <span class="fa-stack fa-2x">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fas fa-list fa-stack-1x fa-inverse white"></i>
                                </span>
                            </button>
                            <button v-if="tableView"  v-on:click="ViewChangeClicked" href="#" class="has-tooltip-left gridBtn" data-tooltip="Change to grid or card view">
                                <span class="fa-stack fa-2x">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fas fa-th fa-stack-1x fa-inverse white"></i>
                                </span>
                            </button>
                        </div>
                        <br />
                        <br />
                        <div>

                            <!-- Grid View -->
                            <div v-if="tableView == false">
                                <div 
                                    v-if="CallbackNow.length > 0"
                                >
                                    <b class="previous-chats-title">Call Back Now: {{CallbackNow.length}}</b> 
                                    <br />
                                    <missed-chat 
                                        v-for="item in CallbackNow" 
                                        v-bind:key="item.id" 
                                        class="now"
                                        :chat="item" 
                                        :selected="selectedChat == item" 
                                        :callbackNow="true"
                                        @Clicked="ChatClicked(item)"
                                    />
                                </div>

                                <div v-for="group in ChatsByDate(OtherCallbacks)" 
                                    v-if="group.collection.length > 0"
                                    class="group"
                                >
                                    <b class="previous-chats-title">Call Back Waiting {{group.title}}: {{group.collection.length}}</b> 
                                    <br />
                                    <missed-chat 
                                        v-for="item in group.collection" 
                                        v-bind:key="item.id" 
                                        :chat="item" 
                                        :selected="selectedChat == item" 
                                        @Clicked="ChatClicked(item)"
                                    />
                                </div>


                                <div v-for="group in ChatsByDate(MissedChats)" 
                                    v-if="group.collection.length > 0"
                                    class="group"
                                >
                                    <b class="previous-chats-title">{{group.title}}: {{group.collection.length}}</b> 
                                    <br />
                                    <missed-chat 
                                        v-for="item in group.collection" 
                                        v-bind:key="item.id" 
                                        :chat="item" 
                                        :selected="selectedChat == item" 
                                        @Clicked="ChatClicked(item)"
                                    />
                                </div>
                            </div>

                            <!-- Table View -->
                            <div v-if="tableView">
                                <div 
                                    v-if="CallbackNow.length > 0"
                                >
                                    <b class="previous-chats-title">Call Back Now: {{CallbackNow.length}}</b> 
                                    <br />
                                    <missed-chat-table 
                                        :chats="CallbackNow" 
                                        :selected="selectedChat"
                                        @Clicked="ChatClicked" 
                                    />
                                </div>

                                <div v-for="group in ChatsByDate(OtherCallbacks)" 
                                    v-if="group.collection.length > 0"
                                    class="group"
                                >
                                    <b class="previous-chats-title">Call Back Waiting {{group.title}}: {{group.collection.length}}</b> 
                                    <br />
                                    <missed-chat-table 
                                        :chats="group.collection"  
                                        :selected="selectedChat"
                                        @Clicked="ChatClicked" 
                                    />
                                </div>


                                <div v-for="group in ChatsByDate(MissedChats)" 
                                    v-if="group.collection.length > 0"
                                    class="group"
                                >
                                    <b class="previous-chats-title">{{group.title}}: {{group.collection.length}}</b> 
                                    <br />
                                    <missed-chat-table 
                                        :chats="group.collection"  
                                        :selected="selectedChat"
                                        @Clicked="ChatClicked" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="selectedChat != null" class="view-previous-chats view-missed-chats">
                    <missed-view-chat 
                        :site="selectedChat.SiteKey" 
                        :detail="chatDetail"
                        :chat="selectedChat" 
                        @CloseClicked="ViewChatCloseClicked"
                    />
                </div>
            </div>
        `,

        beforeCreate() {
            hooks.Register(events.Connection.MissedChats, (chats) => {
                state.missedChats = Copy(chats.Data.MissedChats);
            });

            hooks.Register(events.Connection.MissedChat, (chat) => {
                var found = state.missedChats.find(x => x.ChatUID == chat.Data.ChatUID);

                if(found == null) {
                    state.missedChats.push(chat.Data);
                } else {
                    var idx = state.missedChats.indexOf(found);
                    state.missedChats[idx] = chat.Data;
                }

                state.missedChats = Copy(state.missedChats);
            });

            hooks.Register(events.Connection.MissedChatClosed, (chat) => {
                var found = state.missedChats.find(x => x.ChatUID == chat.Data);
                if(found != null) {
                    var idx = state.missedChats.indexOf(found);
                    state.missedChats.splice(idx, 1);
                }

                
                state.missedChats = Copy(state.missedChats);
            });

            hooks.Register(events.Connection.PreviousChat, (chat) => {
                if(this.selectedChat != null && chat.Data.ChatUID == this.selectedChat.ChatUID)
                {
                    this.chatDetail = chat.Data;

                    if(this.selectedChat.Message) {
                        this.chatDetail.Lines = [
                            { 
                                Message: this.selectedChat.Message,
                                Dated: this.selectedChat.Started,
                                OperatorIndex: 0
                            }
                        ];
                    }
                }
            });
        },

        computed: {
            MissedChats() {
                return state.missedChats.filter(x => x.MissedWantsCallback == false);
            },
            
            Callbacks() {
                return state.missedChats.filter(x => x.MissedWantsCallback);
            },

            CallbackNow() {
                return this.Callbacks.filter(x => new Date() >= new Date(x.MissedWantsCallbackOn));
            },

            OtherCallbacks() {
                let now = this.CallbackNow;
                return this.Callbacks.filter(x => now.indexOf(x) == -1);
            },

            Status() {
                let count = state.missedChats.length;

                if(count > 0) {
                    let status = `Pending Missed Chats: ${count}`;

                    if(this.Callbacks.length > 0) {
                        status += ` (Call Backs: ${this.Callbacks.length})`;
                    }

                    return status;
                } else {
                    return "No Missed Chats";
                }
            }
        },

        methods: {
            ChatsByDate(chats) {
                let chatsByDate = {};
                let current = new Date(); 
                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                for(let i = 0; i < chats.length; i++) {
                    let chat = chats[i];

                    if(this.searchTerms && this.searchTerms.length > 0) {
                        var hasTerm = false;

                        Object.keys(chat).forEach((x) => {
                            let val = chat[x];
                            if(typeof val == "string" && val.toLowerCase().includes(this.searchTerms.toLowerCase()))
                            {
                                hasTerm = true;
                            }
                        });

                        if(hasTerm == false) {
                            continue;
                        }
                    }


                    let date = new Date(chat.Started);
                    let year = date.getFullYear();
                    let month = date.getMonth();
                    let day = date.getDate();

                    let key = date.toDateString();

                    if(chatsByDate[key] == null) {
                        let title = key; 

                        if
                        (
                            year == current.getFullYear() &&
                            month == current.getMonth() &&
                            day == current.getDate()
                        ) 
                        {
                            title = "Today";
                        } 
                        else if
                        (
                            year == yesterday.getFullYear() &&
                            month == yesterday.getMonth() &&
                            day == yesterday.getDate()
                        ) 
                        {
                            title = "Yesterday";
                        }

                        chatsByDate[key] = {
                            title,
                            collection: [ chat ]
                        };
                    } else {
                        chatsByDate[key].collection.push(chat);
                    }
                }

                console.log(chatsByDate);

                return chatsByDate;
            },


            ChatClicked(chat) {
                if(chat == this.selectedChat) {return;}
                this.selectedChat = chat;
                connection.GetPreviousChat(this.selectedChat.SiteKey, this.selectedChat.ChatUID);
            },

            Search(txt) {
                let val = txt.target.value;
                this.searchTerms = val;
            },

            ViewChangeClicked() {
                this.tableView = !this.tableView;
            },

            ViewChatCloseClicked() {
                this.selectedChat = null;
            }
        }
    });
})(woServices);