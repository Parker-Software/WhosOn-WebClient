(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;
    var state = services.Store.state;

    Vue.component('transfer', {
        data: function() {
            return {
                SelectedTab: "users",
                SelectedUser: null,
                SelectedDepartment: null,
                SelectedSkill: null,
                SearchText: "",
                SearchResult: [],
                ShowAvailableOnly: false,
            }
        },
        template: `
            <div id="transferModal" class="modal ">
                <div class="modal-background" v-on:click="Hide"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Transfer Chat To</p>
                        <button class="delete" aria-label="close" v-on:click="Hide"></button>
                    </header>
                    <div class="tabs modalTabs">
                        <ul>
                            <li v-bind:class="{'is-active':SelectedTab == 'users'}" v-on:click="TabClicked('users')"><a>Users</a></li>
                            <li v-bind:class="{'is-active':SelectedTab == 'departments'}" v-on:click="TabClicked('departments')"><a>Departments</a></li>
                            <li v-bind:class="{'is-active':SelectedTab == 'skills'}"v-on:click="TabClicked('skills')"><a>Skills</a></li>
                        </ul>
                    </div>
                    <br />
                    <div v-if="SelectedTab == 'users'">
                        <div class="field" style="padding-right:20px; padding-left: 20px;">
                            <p class="control has-icons-left">
                                <input id="transferSearchTxtBox" class="input" placeholder="Search Team" v-on:keyup.enter="Search">
                                <span class="icon is-left">
                                    <i class="fas fa-search"></i>
                                </span>
                            </p>
                        </div>  
                        <div class="field" style="padding-right:20px; padding-left: 20px;">
                            <label class="checkbox">
                                <input type="checkbox" v-bind:checked="ShowAvailableOnly" v-on:change="OnlyAvailable">
                                Show Available Only
                            </label>
                        </div>  
                        <section class="modal-card-body">
                            <div v-if="SearchText.length <= 0">
                                <div v-if="OnlineUsers.length > 0">
                                    <small style="color: white">Online</small>
                                    <ul v-for="item of OnlineUsers">
                                        <userItem collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></userItem>
                                    </ul>
                                </div>
                                <div v-if="BusyUsers.length > 0">
                                    <small style="color: white">Busy</small>
                                    <ul v-for="item of BusyUsers">
                                        <userItem collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></userItem>
                                    </ul>
                                </div>
                                <div v-if="BrbUsers.length > 0">
                                    <small style="color: white">Be Right Back</small>
                                    <ul v-for="item of BrbUsers">
                                        <userItem collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></userItem>
                                    </ul>
                                </div>
                                <div v-if="AwayUsers.length > 0">
                                    <small style="color: white">Away</small>
                                    <ul v-for="item of AwayUsers">
                                        <userItem collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></userItem>
                                    </ul>
                                </div>
                            </div>
                            <div v-if="SearchText.length > 0">
                                <ul v-for="item of ValidSearchUsers">
                                    <userItem collectionGroup="transfer" @Clicked="UserClicked(item)" :user="item"></userItem>
                                </ul>
                            </div>
                        </section>
                    </div>
                    <div v-if="SelectedTab == 'departments'">
                        <section class="modal-card-body">
                            <ul v-for="item in Departments">
                               <departmentItem @Clicked="DepartmentClicked(item)" :department="item" collectionGroup="transfer"> </departmentItem>
                            </ul>
                        </section>
                    </div>
                    <div v-if="SelectedTab == 'skills'">
                        <section class="modal-card-body">
                            <ul v-for="item in $store.state.skills">
                                <skillItem  @Clicked="SkillClicked(item)" :skill="item" collectionGroup="transfer"> </skillItem>
                            </ul>
                        </section>
                    </div>
                    <br />
                    <div class="status-options" style="padding-right:20px; padding-left: 20px;">
                        <a id="transferToBtn" class="button is-success is-small is-pulled-right" v-on:click="Transfer" disabled>Transfer</a>
                        <button class="button is-info is-pulled-right is-small" style="margin-right: 10px;" v-on:click="SendToAll">Send To All</button>
                    </div>
                    <footer class="modal-card-foot">
                    </footer>
                </div>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.TransferClicked, () => {
                this.Show();
            });

            hooks.Register(events.Connection.CurrentChatClosed, () => {
                this.Hide();
            });
        },
        computed: {
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
            Elem() {
                return document.getElementById("transferModal");
            },
            TransferBtn() {
                return document.getElementById("transferToBtn");
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
                    this.DisableTransferBtn();
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
                this.DisableTransferBtn();
                this.Elem().classList.remove("is-active");  
                this.TransferBtn().classList.remove("is-loading");

                hooks.Call(events.Home.UserImagesNeedUpdating);
            },
            EnableTransferBtn() {
                this.TransferBtn().removeAttribute("disabled");
            },
            DisableTransferBtn() {
                this.TransferBtn().setAttribute("disabled", true);
            },
            Transfer() {
                this.TransferBtn().classList.add("is-loading");
                this.UnSelectAll();
                this.DisableTransferBtn();

                switch(this.SelectedTab) {
                    case "users":
                            connection.TransferChat(state.currentChat.Number, [this.SelectedUser.Connection], "");
                        break;
                    case "departments":
                            connection.TransferChatToDept(state.currentChat.Number, this.SelectedDepartment.Name, "");
                        break;
                    case "skills":
                            connection.TransferChatToSkill(state.currentChat.Number, this.SelectedSkill.ID, "");
                        break;
                }

                this.Hide();
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
                this.EnableTransferBtn();
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

                this.DisableTransferBtn();
            },
            OnlyAvailable(e) {
                this.ShowAvailableOnly = e.srcElement.checked;
                hooks.Call(events.Home.UserImagesNeedUpdating);
            },
            SendToAll() {
                var usersToSendTo = state.users.map(x => x.Connection);
                this.TransferBtn().classList.add("is-loading");
                this.UnSelectAll();
                this.DisableTransferBtn();
                connection.TransferChat(state.currentChat.Number, usersToSendTo, "");
                this.Hide();
            }
        }
    });
})(woServices);