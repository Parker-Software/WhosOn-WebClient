(function (services) {

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var connection = services.WhosOnConn;
    var state = services.state;

    Vue.component("navigation", {
        data: () => {
            return {
                showChats: true,
                showTeam: false,
                showSites: false,
                showMonitorAll: false,
                focus: "chats"
            }
        },
        template: `    
             <div class="wo-sidebar customColumn">
                <div id="sideBar" class="view-container view-container-hover is-hidden" @mouseover="hoverSideBar(true, 'sidebar')" @mouseleave="hoverSideBar(false, 'sidebar')"> 
                        <chats v-bind:class="{'is-hidden': showChats == false}"></chats>
                        <team v-bind:class="{'is-hidden': showTeam == false}"></team>
                        <sites v-bind:class="{'is-hidden': showSites == false}"></sites>
                </div>
             <div id="statusPopout" class="status-popout is-hidden">
                <div class="status-container">
                    <ul>
                        <li id="online" v-on:click="setToOnline" v-bind:class="setOnlineActive"><i class="fas fa-circle online"></i><span class="status-item">Online</span></li>
                        <li id="busy" v-on:click="setToBusy" v-bind:class="setBusyActive"><i class="fas fa-circle busy"></i><span class="status-item">Busy</span></li>
                        <li id="brb" v-on:click="setToBRB" v-bind:class="setBRBActive"><i class="fas fa-circle brb"></i><span class="status-item">Be Right Back</span></li>
                        <li id="away" v-on:click="setToAway" v-bind:class="setAwayActive"><i class="fas fa-circle away"></i><span class="status-item">Away</span></li>
                    </ul>
                    <hr/>
                    <div class="field">
                        <label class="label">Status Message</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Text input"><button class="button is-info">Update</button>
                        </div>
                    </div>                    
                </div>
             </div>
             <aside class="menu">
                    <ul class="menu-list">
                        <li @click="OnNavButtonClicked('status')" id="myStatusNavButton">
                            <a class="">
                                <span class="icon">
                                    <i class="fas fa-user"></i>
                                    <span v-if="$store.state.currentStatus == 0" class="menu-status online">
                                        <i class="fas fa-circle"></i>
                                    </span>
                                    <span v-if="$store.state.currentStatus == 1" class="menu-status busy">
                                        <i class="fas fa-circle"></i>
                                    </span>
                                    <span v-if="$store.state.currentStatus == 2" class="menu-status brb">
                                        <i class="fas fa-circle"></i>
                                    </span>
                                    <span v-if="$store.state.currentStatus == 3" class="menu-status away">
                                        <i class="fas fa-circle"></i>
                                    </span>
                                </span>
                                <br>
                                <span class="nav-label">My Status</span>
                            </a>
                        
                        </li>
                        <li @click="OnNavButtonClicked('chats')" id="chatsNavButton" @mouseover="hoverSideBar(true,'chats')" @mouseleave="hoverSideBar(false, 'chats')">
                            <a class="is-active">
                                <span class="icon">
                                    <i class="fas fa-comment-dots"></i>
                                </span>
                                <br>
                                <span class="nav-label">Chats</span>
                            </a>
                        </li>
                        <li v-if="$store.state.rights.RespondToMissedChats" @click="OnNavButtonClicked('missedchats')" id="missedchatsNavButton" @mouseover="hoverSideBar(true,'missedchats')" @mouseleave="hoverSideBar(false, 'sidebar')">
                            <a>
                                <span class="icon">
                                    <span v-if="$store.state.missedChats.filter(x => x.MissedResponseStarted == false).length > 0" class="menu-status away">
                                        <i class="fas fa-circle"></i>
                                    </span>
                                    <i class="fas fa-comment-exclamation"></i>
                                </span>
                                <br>
                                <span class="nav-label">Missed Chats</span>
                            </a>
                        </li>
                        <li @click="OnNavButtonClicked('team')" id="usersNavButton" @mouseover="hoverSideBar(true,'team')" @mouseleave="hoverSideBar(false, 'team')">
                            <a>
                                <span class="icon">
                                    <i class="fas fa-users"></i>
                                </span>
                                <br>
                                <span class="nav-label">Team</span>
                            </a>
                        </li>
                        <li v-if="$store.state.settings.ListenModeActive && $store.state.rights.MonitorChats" @click="OnNavButtonClicked('monitor')" id="monitorNavButton"  @mouseover="hoverSideBar(false,'monitor')" @mouseleave="hoverSideBar(false, 'monitor')">
                            <a>
                                <span class="icon">
                                    <i class="fas fa-user-circle"></i>
                                </span>
                                <br>
                                <span class="nav-label">Monitor All</span>
                            </a>
                        </li>
                        <li @click="OnNavButtonClicked('sites')" id="sitesNavButton" @mouseover="hoverSideBar(true,'sites')" @mouseleave="hoverSideBar(false, 'sites')">
                            <a>
                                <span class="icon">
                                    <i class="fas fa-id-badge"></i>
                                </span>
                                <br>
                                <span class="nav-label">Sites</span>
                            </a>
                        </li>
                    </ul>
                </aside>
                <aside class="menu menu-bottom">
                    <ul class="menu-list">
                        <li @click="OnNavButtonClicked('options')" id="optionsNavButton">
                            <a class="">
                                <span class="icon">
                                    <i class="fas fa-cog"></i>
                                </span>
                                <br>
                                Options
                            </a>
                        </li>
                    </ul>
                </aside>
        </div>`,
        beforeCreate() {
            hooks.Register(events.Options.SaveClicked, () => {
                this.OnNavButtonClicked("chats");
            });

            hooks.Register(events.Options.CancelClicked, () => {
                this.OnNavButtonClicked("chats");
            });

            hooks.Register(events.Connection.PasswordChanged, () => {
                this.OnNavButtonClicked("chats");
            });

            hooks.Register(events.Team.NotificationClicked, (user) => {
                this.OnNavButtonClicked("team");
            });

            hooks.Register(events.Sites.Clicked, (site) => {
                this.OnNavButtonClicked("sites");
            });
        },
        mounted() {
            this.$nextTick(function() {
                window.addEventListener("resize", this.windowResize);          
                this.windowResize()
              })
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.windowResize);
        },
        computed: {
            setOnlineActive() {
                var status = this.$store.state.currentStatus;
                if (status === 0) {return "is-active";}
            },
            setBusyActive() {
                var status = this.$store.state.currentStatus;
                if (status === 1) {return "is-active";}
            },
            setBRBActive() {
                var status = this.$store.state.currentStatus;
                if (status === 2) {return "is-active";}
            },
            setAwayActive() {
                var status = this.$store.state.currentStatus;
                if (status === 3) {return "is-active";}
            }
        },       
        methods: {            
            windowResize: function(){
                if(this.isTablet() && this.focus != "options"){    
                    this.SideBar().classList.add("is-hidden"); 
                }

                if(this.isTablet() == false && this.focus != "options"){               
                    this.SideBar().classList.remove("is-hidden"); 
                    this.OnNavButtonClicked(this.focus);
                }
            },

            hoverSideBar: function (state, el) {    
                if(el == "sidebar") {
                    if(this.isTablet() && state == false) {
                        this.SideBar().classList.add("is-hidden");
                    }
                    return;
                }

                if(this.isTablet()){ 
                    switch (el) {
                        case "chats":
                            this.showChats = true;
                            this.showTeam = false;
                            this.showSites = false;
                            break;
                        case "team":
                            this.showChats = false;
                            this.showTeam = true;
                            this.showSites = false;
                            break;
                        case "sites":
                            this.showChats = false;
                            this.showTeam = false;
                            this.showSites = true;
                            break;
                        default:
                            this.showChats = false;
                            this.showTeam = false;
                            this.showSites = false;
                            break;
                    }

                    if (state) {
                        this.SideBar().classList.remove("is-hidden");
                    }
                } 
            },

            isTablet: () => {
             return window.matchMedia("(max-width: 1024px)").matches;
            },

            isHidden: function (el) {
                var style = window.getComputedStyle(el);
                return (style.display === "none")
            },

            setToOnline() {
                hooks.Call(events.Home.StatusChanged, "online");
                this.$store.state.statusCanChangeAutomatically = true;
                this.StatusPopout().classList.toggle("is-hidden");
            },

            setToBusy() {
                hooks.Call(events.Home.StatusChanged, "busy");
                this.$store.state.statusCanChangeAutomatically = false;
                this.StatusPopout().classList.toggle("is-hidden");
            },

            setToBRB() {
                hooks.Call(events.Home.StatusChanged, "brb");
                this.$store.state.statusCanChangeAutomatically = false;
                this.StatusPopout().classList.toggle("is-hidden");
            },

            setToAway() {
                hooks.Call(events.Home.StatusChanged, "away");
                this.$store.state.statusCanChangeAutomatically = false;
                this.StatusPopout().classList.toggle("is-hidden");
            },

            UnselectAll() {
                this.StatusBtn().firstChild.classList.remove("is-active");
                this.ChatBtn().firstChild.classList.remove("is-active");
                this.UsersBtn().firstChild.classList.remove("is-active");
                this.OptionsBtn().firstChild.classList.remove("is-active");
                this.SitesBtn().firstChild.classList.remove("is-active");
                if (this.MissedChatsBtn()) {this.MissedChatsBtn().firstChild.classList.remove("is-active");}
                if (this.MonitorAllBtn()) {this.MonitorAllBtn().firstChild.classList.remove("is-active");}
            },

            online() {
                return document.getElementById("online");
            },

            busy() {
                return document.getElementById("busy");
            },

            brb() {
                return document.getElementById("brb");
            },

            away() {
                return document.getElementById("away");
            },

            StatusBtn() {
                return document.getElementById("myStatusNavButton");
            },

            ChatBtn() {
                return document.getElementById("chatsNavButton");
            },

            UsersBtn() {
                return document.getElementById("usersNavButton");
            },

            OptionsBtn() {
                return document.getElementById("optionsNavButton");
            },

            MonitorAllBtn() {
                return document.getElementById("monitorNavButton");
            },

            SitesBtn() {
                return document.getElementById("sitesNavButton");
            },

            MissedChatsBtn() {
                return document.getElementById("missedchatsNavButton");
            },

            StatusPopout() {
                return document.getElementById("statusPopout");
            },

            SideBar() {
                return document.getElementById("sideBar");
            },

            ToggleStatus() {
                this.StatusPopout().classList.toggle("is-hidden");
            },
            
            OnNavButtonClicked(status) {
                hooks.Call(navEvents.ButtonClicked, status);  
                this.focus = status;        
                if(this.isHidden(this.StatusPopout()) == false && status != "status") {this.ToggleStatus();}
                switch (status) {
                    case "status":
                        this.ToggleStatus();
                        break;
                    case "chats":
                        this.UnselectAll();
                        hooks.Call(navEvents.ChatsClicked);
                        this.showChats = true;
                        this.showTeam = false;
                        this.showSites = false;      
                        this.SideBar().classList.remove("is-hidden"); 
                        this.ChatBtn().firstChild.classList.add("is-active");
                        break;
                    case "team":
                        this.UnselectAll();                        
                        hooks.Call(navEvents.TeamClicked);
                        this.showChats = false;
                        this.showTeam = true;     
                        this.showSites = false;                
                        this.SideBar().classList.remove("is-hidden");   
                        this.UsersBtn().firstChild.classList.add("is-active");
                        break;
                    case "monitor":
                        this.UnselectAll();   
                        hooks.Call(navEvents.MonitorClicked);
                        this.showChats = false;
                        this.showTeam = false;     
                        this.showSites = false;   
                        this.showMonitorAll = true;       
                        
                        this.SideBar().classList.add("is-hidden");
                        this.MonitorAllBtn().firstChild.classList.add("is-active");
                        break;
                    case "sites":
                        if(this.showSites == false) {connection.GetDailySummary();}

                        this.UnselectAll();  
                        hooks.Call(navEvents.SitesClicked);   
                        this.showChats = false;
                        this.showTeam = false; 
                        this.showSites = true; 
                        this.SideBar().classList.remove("is-hidden");     
                        this.SitesBtn().firstChild.classList.add("is-active");  
                        break;
                    case "options":
                        this.UnselectAll();               
                        hooks.Call(navEvents.OptionsClicked);   
                        this.showChats = false;
                        this.showTeam = false;     
                        this.SideBar().classList.add("is-hidden");
                        this.OptionsBtn().firstChild.classList.add("is-active");
                        break;
                    case "missedchats":
                        this.UnselectAll();              
                        hooks.Call(navEvents.MissedChatsClicked);
                        this.showChats = false;
                        this.showTeam = false;     
                        this.SideBar().classList.add("is-hidden");
                        this.MissedChatsBtn().firstChild.classList.add("is-active");
                        break;
                }
            }
        }
    });
})(woServices);