(function(services){
    
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;

    Vue.component("previousChats", {
        props: [
            "site"
        ],
        data: () => {
            return {
                chats: [],
                groups: [],
                selectInfo: {
                    operators: {},
                    departments: {},
                    visitors: {},
                    ratings: {},
                    sentiment: {}
                },
                selectedChat: null,
                chatDetail: {},
            };
        },
        template: `
            <div style="height: 100%;">
                <div class="previous-chats-container" v-bind:class="{'showingViewChat': selectedChat != null}">
                    <div class="previous-chat-options">
                        <div class="select">
                            <select id="FilterByOperator" v-on:change="Filter">
                                <option value="All" selected>All Operators</option>
                                <option v-for="v, k in selectInfo.operators" v-bind:value="k">{{k}} ({{v}})</option>
                            </select>
                        </div>  
                        <div class="select">
                            <select id="FilterByDept" v-on:change="Filter">
                                <option value="All" selected>All Departments and Skills</option>
                                <option v-for="v, k in selectInfo.departments" v-bind:value="k">{{k}} ({{v}})</option>
                            </select>
                        </div>
                        <div class="select">
                            <select id="FilterByVisitor" v-on:change="Filter">
                                <option value="All" selected>All Visitor Names</option>
                                <option v-for="v, k in selectInfo.visitors" v-bind:value="k">{{k}} ({{v}})</option>
                            </select>
                        </div>
                        <div class="select">
                            <select id="FilterByRating" v-on:change="Filter">
                                <option value="All" selected>All</option>
                                <option v-for="v, k in selectInfo.ratings" v-bind:value="k">
                                    <div v-if="Number(k) > 0" v-for="star in Number(k)">&#x2605;</div> 
                                    <div v-if="Number(k) <= 0">None</div>
                                    ({{v}})
                                </option>
                            </select>
                        </div>
                        <div class="select">
                            <select id="FilterBySentiment" v-on:change="Filter">
                                <option value="All" selected>All Sentiment</option>
                                <option v-for="v, k in selectInfo.sentiment" v-bind:value="k">
                                    <div v-if="k == 'Happy'">
                                        &#x1F642;
                                    </div>
                                    <div v-if="k == 'Meh'">
                                        &#x1F610;
                                    </div>
                                    <div v-if="k == 'Unhappy'">
                                        &#x1F641;
                                    </div>
                                    ({{v}})
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="previous-chats">
                        <div v-for="group in groups" v-if="group.collection.length > 0" class="group">
                            <b class="previous-chats-title">{{group.title}}</b> 
                            <br />
                            <chatCard v-for="item in group.collection" v-bind:key="item.id" :chat="item" :selected="selectedChat == item" @Clicked="ChatClicked(item)"></chatCard>
                        </div>
                    </div>
                </div>
                <div v-if="selectedChat != null" class="view-previous-chats">
                    <viewChat :site="site" :chat="selectedChat" :detail="chatDetail" @CloseClicked="ViewChatCloseClicked"></viewChat>
                </div>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Connection.PreviousChats, (chats) => {
                this.selectedChat = null;
                this.chats = chats.Data;
                
                this.selectInfo = this.GenerateSelectInfo();
                this.Filter();
            });

            hooks.Register(events.Connection.PreviousChat, (chat) => {
                if(this.selectedChat != null && chat.Data.ChatUID == this.selectedChat.ChatUID)
                {
                    this.chatDetail = chat.Data;
                }
            });
        },
        methods: {
            OperatorSelectElem() {
                return document.getElementById("FilterByOperator");
            },
            DepartmentSelectElem() {
                return document.getElementById("FilterByDept");
            },
            VistiorSelectElem() {
                return document.getElementById("FilterByVisitor");
            },
            RatingSelectElem() {
                return document.getElementById("FilterByRating");
            },
            SentimentSelectElem() {
                return document.getElementById("FilterBySentiment");
            },
            ChatClicked(chat) {  
                if(chat == this.selectedChat) {return;}
                this.selectedChat = chat;
                connection.GetPreviousChat(this.site, this.selectedChat.ChatUID);
            },
            ViewChatCloseClicked() {
                this.selectedChat = null
            },
            Filter() {
                var operatorFiltered = this.FilterByOperator(this.chats, this.OperatorSelectElem().value);
                var departmentFiltered = this.FilterByDepartment(operatorFiltered, this.DepartmentSelectElem().value);
                var visitorsFiltered = this.FilterByVisitor(departmentFiltered, this.VistiorSelectElem().value);
                var ratingFiltered = this.FilterByRating(visitorsFiltered, this.RatingSelectElem().value);
                var sentimentFiltered = this.FilterBySentiment(ratingFiltered, this.SentimentSelectElem().value);
                this.groups = this.GroupChats(sentimentFiltered);
            },
            FilterByOperator(chats, operator) {
                var results = [];

                if(operator == "All") {return chats;}

                for(var i = 0; i < chats.length; i++){
                    var takenByUsers = chats[i].TakenByUsers.split(",");
                    if(takenByUsers.length > 0 && takenByUsers[0] != "")
                    {
                        for(var k = 0; k < takenByUsers.length; k++) 
                        {
                            var user = takenByUsers[k];
                            if(user == operator) {results.push(chats[i]);}
                        }
                    }
                }
                return results;
            },
            FilterByDepartment(chats, department) {
                var results = [];

                if(department == "All") {return chats;}

                for(var i = 0; i < chats.length; i++){
                    var takenByDept = chats[i].TakenByDept.split(",");
                    if(takenByDept.length > 0 && takenByDept[0] != "")
                    {
                        for(var k = 0; k < takenByDept.length; k++) 
                        {
                            var dept = takenByDept[k];
                            if(dept == department) {results.push(chats[i]);}
                        }
                    }
                }

                return results;
            },
            FilterByVisitor(chats, visitor) {
                var results = [];

                if(visitor == "All") {return chats;}

                for(var i = 0; i < chats.length; i++){
                    var visitorName = chats[i].VisitorName;
                    if(visitorName)
                    {
                        if(visitorName == visitor) {results.push(chats[i]);}
                    }
                }

                return results;
            },
            FilterByRating(chats, rating) {
                var results = [];

                if(rating == "All") {return chats;}

                if(rating == 0) {rating = -1;}

                for(var i = 0; i < chats.length; i++){
                    var chatRating = chats[i].Rating;
                    if(chatRating)
                    {
                        if(chatRating == rating) {results.push(chats[i]);}
                    }
                }

                return results;
            },
            FilterBySentiment(chats, sentiment) {
                var results = [];

                if(sentiment == "All") {return chats;}
                for(var i = 0; i < chats.length; i++){
                    var chatSentiment = chats[i].SentimentScore;
                    if(chatSentiment)
                    {
                        if(sentiment == "Happy" && chatSentiment >= 75)  {results.push(chats[i]);}
                        else if(sentiment == "Meh" && chatSentiment < 75 && chatSentiment > 25) {results.push(chats[i]);}
                        else if(sentiment == "Unhappy" && chatSentiment <= 25) {results.push(chats[i]);}
                    }
                }

                return results;
            },
            GroupChats(chats) {
                var missed = [];
                var notMissed = [];

                for(var i = 0; i < chats.length; i++) {
                    var chat = chats[i];

                    if(chat.Missed) {
                        missed.push(chat);
                    } else {notMissed.push(chat);}
                }

                return [
                    {
                        collection: missed,
                        title: `Missed Chats (Not Responded): ${missed.length}`,
                        id: 0
                    },
                    {
                        collection: notMissed,
                        title: `Taken Chats: ${notMissed.length}`,
                        id: 1
                    },
                ];
            },
            GenerateSelectInfo() {
                var results = {
                    operators: {},
                    departments: {},
                    visitors: {},
                    ratings: {},
                    sentiment: {}
                };


                for(var  i = 0; i < this.chats.length; i++) {
                    var takenByUsers = this.chats[i].TakenByUsers;
                    var takenByDepartments = this.chats[i].TakenByDept;
                    var visitor = this.chats[i].VisitorName;
                    var rating = this.chats[i].Rating;
                    var sentiment = this.chats[i].SentimentScore;

                    var users = takenByUsers.split(",");
                    var departments = takenByDepartments.split(",");

                    if(users.length > 0 && users[0] != "")
                    {
                        for(var k = 0; k < users.length; k++) 
                        {
                            var user = users[k];
                            if(results.operators[user] == null) {
                                results.operators[user] = 1;
                            } else {
                                results.operators[user] += 1;
                            }
                        }
                    }
                   
                    if(departments.length > 0 && departments[0] != "")
                    {
                        for(var k = 0; k < departments.length; k++) {
                            var department = departments[k];
                            if(results.departments[department] == null) {
                                results.departments[department] = 1;
                            } else {
                                results.departments[department] += 1;
                            }
                        }
                    }

                    if(visitor) {
                        if(results.visitors[visitor] == null) {
                            results.visitors[visitor] = 1;
                        } else {
                            results.visitors[visitor] += 1;
                        }
                    }

                    if(rating) {
                        if(rating == -1) {rating = 0;}

                        if(results.ratings[rating] == null) {
                            results.ratings[rating] = 1;
                        } else {
                            results.ratings[rating] += 1;
                        }
                    }

                    if(sentiment) {
                        var catergory = "Unhappy";

                        if(sentiment >= 75) {catergory = "Happy";}
                        else if(sentiment < 75 && sentiment > 25) {catergory = "Meh";}

                        if(results.sentiment[catergory] == null) {
                            results.sentiment[catergory] = 1;
                        } else {
                            results.sentiment[catergory] += 1;
                        }
                    }

                }
                return results;
            }
        }
    });
})(woServices);