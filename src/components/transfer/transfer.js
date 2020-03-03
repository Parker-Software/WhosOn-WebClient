(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;
    var state = services.Store.state;

    Vue.component("chat-transfer", {
        data: function() {
            return {
                Show: false,
                SelectedTab: "users",
                SelectedUser: null,
                SelectedDepartment: null,
                SelectedSkill: null,
                SearchText: "",
                SearchResult: [],
                ShowAvailableOnly: false,
                ShowAll: false,
                VisitorName: "",
                Dialogues: {
                    ShowUser: false,
                    ShowDepartment: false,
                    ShowSkills: false,
                }
            }
        },
        template: `
        <div id="transferPanel" class="transfer-panel" v-bind:class="{'is-hidden': Show == false}">
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
            <div v-if="SelectedTab == 'users'">
                <div class="availabilty-section">
                    <div class="field has-text-left" style="padding-left:35px;">
                        <input id="availablityToggle" type="checkbox" name="availablityToggle" class="switch is-rounded" v-on:change="OnlyAvailable">
                        <label for="availablityToggle">Show Available Only</label>
                    </div>
                </div>
                <div class="transfer-tab">
                    <div class="field">
                        <p class="control has-icons-right">
                            <input id="transferSearchTxtBox" class="input" type="text" placeholder="Search Team" v-on:keyup.enter="Search">                        
                            <span class="icon is-small is-right">
                                <i class="fas fa-search"></i>
                            </span>
                        </p>
                    </div>
                    <button class="button" v-bind:class="{'online': OnlineUsers.length > 0, 'away': OnlineUsers.length <= 0}" v-on:click="SendToAll" >
                        <span class="left">Send To All</span>
                    </button>
                    <ul class="departments">
                        <li v-for="department in ValidDepartments" class="department">
                            <button class="button" v-on:click="DepartmentClicked(department)" v-bind:class="{'online': department.Status == 0, 'away': department.Status != 0}">
                                <span class="left">{{department.Name}}</span>
                            </button>
                        </li>
                    </ul>
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
                    <div  class="users-list" v-if="SearchText.length > 0">
                        <small>Search Results - {{SearchText}}</small>
                        <ul v-if="ValidSearchUsers.length > 0" v-for="item of ValidSearchUsers">
                            <user collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></user>
                        </ul>  
                        <p v-if="ValidSearchUsers.length <= 0">
                            <span>None</span>
                        </p>              
                    </div>
                </div>
            </div>
            <div v-if="SelectedTab == 'skills'" >
                <div class="availabilty-section">
                    <div class="field has-text-left" style="padding-left:35px;">
                        <input id="showAllToggle" type="checkbox" class="switch is-rounded" v-on:change="ShowAllSkills">
                        <label for="showAllToggle">Show All</label>
                    </div>
                </div>
                <div class="transfer-tab">
                    <ul class="skills">
                        <li v-for="skill in ValidSkills" class="skill">
                            <button class="button" v-on:click="SkillClicked(skill)" v-bind:class="{'online': skill.Status == 0, 'away': skill.Status != 0}">
                                <span class="left">{{skill.Name}}</span> <span class="right">{{skill.OnlineCount}}/{{skill.Count}}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div> 

            <dialogue 
                v-if="this.SelectedUser != null"
                title="Transfer Chat" 
                :content="TransferUserContent" 
                :show="Dialogues.ShowUser"
                :yesCallback="Transfer"
                :noCallback="() => {this.Dialogues.ShowUser = false; }"
            >
            </dialogue>

            <dialogue           
                v-if="this.SelectedDepartment != null"
                title="Transfer Chat" 
                :content="TransferDepartmentContent" 
                :show="Dialogues.ShowDepartment"
                :yesCallback="Transfer"
                :noCallback="() => {this.Dialogues.ShowDepartment = false; }"
            >
            </dialogue>

            <dialogue           
                v-if="this.SelectedSkill != null"
                title="Transfer Chat" 
                :content="TransferSkillContent" 
                :show="Dialogues.ShowSkills"
                :yesCallback="Transfer"
                :noCallback="() => {this.Dialogues.ShowSkills = false; }"
            >
            </dialogue>
 
        </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.TransferClicked, () => {
                this.Show = !this.Show;
            });

            hooks.Register(events.Connection.CurrentChatClosed, () => {
                this.Hide();
            });
        },    
        computed: {
            TransferUserContent() {
                return `<span class="fa-stack fa-lg">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-question fa-stack-1x" style="color:white"></i>
                        </span> 
                        <span>
                            Transfer the chat with ${this.VisitorName} to ${this.SelectedUser.Username}?
                        </span>`;
            },

            TransferDepartmentContent() {
                return `<span class="fa-stack fa-lg">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-question fa-stack-1x" style="color:white"></i>
                        </span> 
                        <span>
                            Transfer the chat with ${this.VisitorName} to department: ${this.SelectedDepartment.Name}?
                        </span>`;
            },

            TransferSkillContent() {
                return `<span class="fa-stack fa-lg">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-question fa-stack-1x" style="color:white"></i>
                        </span> 
                        <span>
                            Transfer the chat with ${this.VisitorName} to skill: ${this.SelectedSkill.Name}?
                        </span>`;
            },

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
            ValidDepartments() {
                if(this.ShowAvailableOnly) return this.Departments.filter(x => x.Status == 0);
                else return this.Departments;
            },
            ValidSkills() {
                if(this.ShowAll == false) return this.Skills.filter(x => x.Status == 0);
                else return this.Skills;
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
            },
            Skills() {
                var skills = state.skills;
                var results = [];

                for(var i = 0; i < skills.length; i++) {
                    var skill = skills[i];
                    results[i] = skill;

                    var usersWithSkill = state.users.filter(x => x.Skills.split(',').indexOf(skill.Name) != -1);

                    results[i].Count = usersWithSkill.length;
                    var online = usersWithSkill.filter(x => x.Status == 0);
                    results[i].OnlineCount = online.length;

                    var busy = usersWithSkill.filter(x => x.Status == 1);
                    var brb = usersWithSkill.filter(x => x.Status == 2);
                    var away = usersWithSkill.filter(x => x.Status == 3);
                    if(online.length > 0) {
                        results[i].Status = 0;
                    } else {
                        if(busy.length > 0) {
                            results[i].Status = 1;
                        } else{
                            if(brb.length > 0) {
                                results[i].Status = 2;
                            } else {
                                results[i].Status = 3;
                            }
                        }
                    }
                }
                return results;
            }
        },
        methods: {
            close() {
                this.Show = !this.Show;
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
                this.SelectedUser = null;
                this.SelectedDepartment = null;
                this.SelectedSkill = null;
                this.SelectedTab = "users";
                this.SearchResult = [];
                this.SearchText = "";
                hooks.Call(events.Home.UserImagesNeedUpdating);
            },    
            Transfer() {   
                var finalMessage = this.$store.state.settings.TransferMessage;
                finalMessage = finalMessage.replace(/%Name%/g, state.currentChat.Name);

                if (this.Dialogues.ShowUser)
                        connection.TransferChat(state.currentChat.Number, [this.SelectedUser.Connection], finalMessage);

                if (this.Dialogues.ShowDepartment)
                        connection.TransferChatToDept(state.currentChat.Number, this.SelectedDepartment.Name, "");

                if (this.Dialogues.ShowSkills)
                        connection.TransferChatToSkill(state.currentChat.Number, this.SelectedSkill.ID, "");

                
                this.Dialogues.ShowUser = false;
                this.Dialogues.ShowDepartment = false;
                this.Dialogues.ShowSkills = false;

                this.SelectedUser = null;
                this.SelectedDepartment = null;
                this.SelectedSkill = null;
                this.close();
            },
            UserClicked(user) {
                this.SelectedDepartment = null;
                this.SelectedSkill = null;

                this.SelectedUser = user;
                this.VisitorName = state.currentChat.Name;
                this.Dialogues.ShowUser = true;
            },
            DepartmentClicked(dept) {
                this.SelectedUser = null;
                this.SelectedSkill = null;

                this.SelectedDepartment = dept;
                this.Dialogues.ShowDepartment = true;
            },
            SkillClicked(skill){
                this.SelectedUser = null;
                this.SelectedDepartment = null;

                this.SelectedSkill = skill;
                this.Dialogues.ShowSkills = true;
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
            ShowAllSkills(e) {
                this.ShowAll = e.srcElement.checked;
            },
            SendToAll() {
                var usersToSendTo = state.users.map(x => x.Connection);
                connection.TransferChat(state.currentChat.Number, usersToSendTo, "");
                this.close();
            },
        }
    });
})(woServices);