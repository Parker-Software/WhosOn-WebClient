(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component("missedChatsArea", {
        data: () => {
            return {
                selectedChat: null,
                searchTerms: null,
                tableView: false,
            }
        },
        template: `
            <div class="chat-area missed-chats">
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

                    <!-- <button v-if="tableView == false"  v-on:click="ViewChangeClicked" href="#" class="has-tooltip-left gridBtn" data-tooltip="Change to grid or card view">
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
                    </button> -->
                </div>
                <br />
                <br />
                <div>
                    <div>

                        <!-- Grid View -->
                        <div v-for="group in MissedChatsByDate" 
                             v-if="tableView == false && group.collection.length > 0"
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

                        <!-- Table View -->

                        <div v-if="tableView">
                            <table>
                                <thead>
                                    <th>Visitor Name</th>
                                    <th>Time</th>
                                    <th>Site</th>
                                    <th>Call Back</th>
                                    <th>Email Address</th>
                                    <th>Telephone</th>
                                    <th>Is Responding</th>
                                    <th>Summary</th>
                                    <th>Location</th>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        `,

        beforeCreate() {
            hooks.Register(events.Connection.MissedChats, (chats) => {
                state.missedChats = Copy(chats.Data.MissedChats);
            });
        },

        computed: {
            MissedChats: () => state.missedChats,

            MissedChatsByDate() {
                let chatsByDate = {};
                let current = new Date(); 
                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                for(let i = 0; i < this.MissedChats.length; i++) {
                    let chat = this.MissedChats[i];


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
                    chat.Site = state.sites[chat.SiteKey].Name;
                

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

                return chatsByDate;
            },

            Status() {
                let count = this.MissedChats.length;

                if(count > 0) {
                    return `Pending Missed Chats: ${count}`
                } else {
                    return "No Missed Chats";
                }
            }
        },

        methods: {
            ChatClicked(chat) {

            },

            Search(txt) {
                let val = txt.target.value;
                this.searchTerms = val;
            },

            ViewChangeClicked() {
                this.tableView = !this.tableView;
            }
        }
    });
})(woServices);