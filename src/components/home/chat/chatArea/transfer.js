(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;
    var state = services.Store.state;

    Vue.component("chatTransfer", {
        data: function() {
            return {
                SelectedTab: "users",
                SelectedUser: null,
                SelectedDepartment: null,
                SelectedSkill: null,
                SearchText: "",
                SearchResult: [],
                ShowAvailableOnly: false,
                VisitorName: ""
            }
        },
        template: `
        <div id="transferPanel" class="transfer-panel is-hidden">
            <div class="columns">
                <div class="column is-6"><h2>Transfer Chat</h2></strong></div>
                <div class="column is-6"><a v-on:click="close"><i class="fas fa-times is-pulled-right"></i></a></div>
            </div>
            <div class="tabs">
                <ul>
                    <li v-bind:class="{'is-active':SelectedTab == 'users'}" v-on:click="TabClicked('users')"><a>Users</a></li>
                    <li v-bind:class="{'is-active':SelectedTab == 'departments'}" v-on:click="TabClicked('departments')" class="is-hidden"><a>Departments</a></li>
                    <li v-bind:class="{'is-active':SelectedTab == 'skills'}"v-on:click="TabClicked('skills')"><a>Skills</a></li>
                </ul>              
            </div>
            <div class="availabilty-section">
                <div class="field has-text-left" style="padding-left:35px;">
                    <input id="availablityToggle" type="checkbox" name="availablityToggle" class="switch is-rounded" v-on:change="OnlyAvailable">
                    <label for="availablityToggle">Show Available Only</label>
                </div>
            </div>
            <div v-if="SelectedTab == 'users'" class="users-tab">
                <div class="field">
                    <p class="control has-icons-right">
                        <input id="transferSearchTxtBox" class="input" type="text" placeholder="Search Team" v-on:keyup.enter="Search">                        
                        <span class="icon is-small is-right">
                            <i class="fas fa-search"></i>
                        </span>
                    </p>
                </div>
                <button class="button" v-on:click="SendToAll"><span>Send To All</span></button>
                <br/>
                <div class="users-list" v-if="SearchText.length <= 0">
                    <div v-if="OnlineUsers.length > 0">
                        <small>Online {{ OnlineUsers.length }}</small>
                        <ul v-for="item of OnlineUsers" class="user-list-online">
                            <user collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></user>
                        </ul>
                     </div>
                    <div v-if="BusyUsers.length > 0">
                        <small>Busy {{ BusyUsers.length }}</small>
                        <ul v-for="item of BusyUsers" class="user-list-busy">
                            <user collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></user>
                        </ul>
                    </div>
                    <div v-if="BrbUsers.length > 0">
                        <small>Be Right Back {{ BrbUsers.length }}</small>
                        <ul v-for="item of BrbUsers" class="user-list-brb">
                            <user collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></user>
                        </ul>
                    </div>
                    <div v-if="AwayUsers.length > 0">
                        <small>Away {{ AwayUsers.length }}</small>
                        <ul v-for="item of AwayUsers" class="user-list-away">
                            <user collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></user>
                        </ul>
                    </div>
                </div>
                <div v-if="SearchText.length > 0">
                    <small>Search Results - {{SearchText}}</small>
                    <ul v-if="ValidSearchUsers.length > 0" v-for="item of ValidSearchUsers">
                        <user collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></user>
                    </ul>  
                    <p v-if="ValidSearchUsers.length <= 0">
                        <span>None</span>
                    </p>              
                </div>
            </div>
            <div v-if="SelectedTab == 'departments'" class="is-hidden"></div>
            <div v-if="SelectedTab == 'skills'"></div>           
            <transferDialog  @Transfer="Transfer()" v-bind:user="this.SelectedUser" v-bind:visitorName="this.VisitorName"></transferDialog>           
        </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.TransferClicked, () => {
                document.getElementById("transferPanel").classList.toggle("is-hidden");
            });

            hooks.Register(events.Connection.CurrentChatClosed, () => {
                this.Hide();
            });
        },    
        computed: {
            getPanel() {
               return document.getElementById("transferPanel");
            },
            ValidUsers() {
                var users = state.users.filter(x => x.Username != state.userName);
                if(this.ShowAvailableOnly) {
                    users = users.filter(x => x.Status == 0);
                }

                return users;
            },
            ValidSearchUsers() {
                return this.ValidUsers.filter(x => 
                    x.Username.toLowerCase().includes(this.SearchText) ||
                    x.Name.toLowerCase().includes(this.SearchText) ||
                    x.Dept.toLowerCase().includes(this.SearchText));
            },
            OnlineUsers() {
                return this.ValidUsers.filter(x => x.Status == 0);
            },
            BusyUsers() {
                return this.ValidUsers.filter(x => x.Status == 1);
            },
            BrbUsers() {
                return this.ValidUsers.filter(x => x.Status == 2);
            },
            AwayUsers() {
                return this.ValidUsers.filter(x => x.Status == 3);
            },
            Departments() {
                var departments = [...new Set(state.users.filter(x => x.Dept != "").map(x => x.Dept))];
                var result = [];

                for(var i = 0; i < departments.length; i++) {
                    var department = departments[i];
                    result[i] = {};
                    result[i].Name = department;

                    var usersInDepartment = state.users.filter(x => x.Dept == department);
                    var online = usersInDepartment.filter(x => x.Status == 0);
                    var busy = usersInDepartment.filter(x => x.Status == 1);
                    var brb = usersInDepartment.filter(x => x.Status == 2);
                    var away = usersInDepartment.filter(x => x.Status == 3);
                    if(online.length > 0) {
                        result[i].Status = 0;
                    } else {
                        if(busy.length > 0) {
                            result[i].Status = 1;
                        } else{
                            if(brb.length > 0) {
                                result[i].Status = 2;
                            } else {
                                result[i].Status = 3;
                            }
                        }
                    }

                }
                return result;
            }
        },
        methods: {
            close() {
                document.getElementById("transferPanel").classList.toggle("is-hidden");
            },
            Elem() {
                return document.getElementById("transferModal");
            },
            Show() {
                this.Elem().classList.add("is-active");
            },
            SearchElem() {
                return document.getElementById("transferSearchTxtBox");
            },
            Search() {
                var txt = this.SearchElem().value;
                if(txt.length > 0) {
                    this.SearchText = txt;
                    this.SearchResult = this.ValidUsers.filter(x => 
                        x.Username.toLowerCase().includes(txt) ||
                        x.Name.toLowerCase().includes(txt) ||
                        x.Dept.toLowerCase().includes(txt));
                } else {
                    this.SearchResult = [];
                    this.SearchText = "";
                }
                hooks.Call(events.Home.UserImagesNeedUpdating);
            },
            Hide() {
                this.ShowAvailableOnly = false;
                this.UnSelectAll();
                this.SelectedUser = null;
                this.SelectedDepartment = null;
                this.SelectedSkill = null;
                this.SelectedTab = "users";
                this.SearchResult = [];
                this.SearchText = "";
                hooks.Call(events.Home.UserImagesNeedUpdating);
            },    
            Transfer() {               
                this.UnSelectAll();   

                var finalMessage = this.$store.state.settings.TransferMessage;
                finalMessage = finalMessage.replace(/%Name%/g, state.currentChat.Name);

                switch(this.SelectedTab) {
                    case "users":
                            connection.TransferChat(state.currentChat.Number, [this.SelectedUser.Connection], finalMessage);
                        break;
                    case "departments":
                            connection.TransferChatToDept(state.currentChat.Number, this.SelectedDepartment.Name, "");
                        break;
                    case "skills":
                            connection.TransferChatToSkill(state.currentChat.Number, this.SelectedSkill.ID, "");
                        break;
                }

                this.close();
            },
            UnSelectAll() {
                var elems = document.querySelectorAll(".transfer");
                for(var i = 0; i < elems.length; i++) {
                    elems[i].classList.remove("is-active");
                }
            },
            UserClicked(user) {
                this.UnSelectAll();
                this.SelectedUser = user;
                this.VisitorName = state.currentChat.Name;
                var modal = document.getElementById("transferDialog");
                modal.classList.toggle("is-active");
            },
            DepartmentClicked(dept) {
                this.UnSelectAll();
                this.SelectedDepartment = dept;
                this.EnableTransferBtn();
            },
            SkillClicked(skill){
                this.UnSelectAll();
                this.SelectedSkill = skill;
                this.EnableTransferBtn();
            },
            TabClicked(tab) {
                this.SelectedTab = tab;
                hooks.Call(events.Home.UserImagesNeedUpdating);
                
                if(tab == "users") {
                    this.SelectedUser = null;
                    this.SearchResult = [];
                    this.SearchText = "";
                }
            },
            OnlyAvailable(e) {
                this.ShowAvailableOnly = e.srcElement.checked;
                hooks.Call(events.Home.UserImagesNeedUpdating);
            },
            SendToAll() {
                var usersToSendTo = state.users.map(x => x.Connection);
                this.UnSelectAll();
                connection.TransferChat(state.currentChat.Number, usersToSendTo, "");
                this.close();
            }
        }
    });
})(woServices);