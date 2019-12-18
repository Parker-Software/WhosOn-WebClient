(function (services) {

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var state = services.state;

    Vue.component('homenav', {
        template: `    
             <div class="wo-sidebar customColumn">
                <div id="sideBar" class="view-container view-container-hover is-hidden" @mouseover="hoverSideBar(true, 'sidebar')" @mouseleave="hoverSideBar(false, 'sidebar')"> 
                        <homeActiveChats v-if="showChats"></homeActiveChats>
                        <homeTeamUsers v-if="showTeam"></homeTeamUsers>
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
                        <li @click="OnNavButtonClicked('team')" id="usersNavButton" @mouseover="hoverSideBar(true,'team')" @mouseleave="hoverSideBar(false, 'team')">
                            <a class="">
                                <span class="icon">
                                    <i class="fas fa-users"></i>
                                </span>
                                <br>
                                <span class="nav-label">Team</span>
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
        },
        mounted() {
            this.$nextTick(function() {
                window.addEventListener('resize', this.windowResize);          
                //Init
                this.windowResize()
              })
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.windowResize);
          },
        data: () => {
            return {
                showChats: true,
                showTeam: false,
                focus: 'chats'
            }
        },
        computed: {
            setOnlineActive() {
                var status = this.$store.state.currentStatus;
                if (status === 0) return "is-active";
            },
            setBusyActive() {
                var status = this.$store.state.currentStatus;
                if (status === 1) return "is-active";
            },
            setBRBActive() {
                var status = this.$store.state.currentStatus;
                if (status === 2) return "is-active";
            },
            setAwayActive() {
                var status = this.$store.state.currentStatus;
                if (status === 3) return "is-active";
            }
        },       
        methods: {            
            windowResize: function(){
                if(this.isTablet() && this.focus != "options"){    
                    this.SideBar().classList.add("is-hidden"); 
                }
                if(!this.isTablet() && this.focus != "options"){               
                    this.SideBar().classList.remove("is-hidden"); 
                }
            },
            hoverSideBar: function (state, el) {    
                if(this.isTablet()){ 
                    switch (el) {
                        case "chats":
                            this.showChats = true;
                            this.showTeam = false;
                            break;
                        case "team":
                            this.showChats = false;
                            this.showTeam = true;
                            break;
                        case "options":
                            this.showChats = false;
                            this.showTeam = false;
                            break;
                    }
                    if (state) {
                        this.SideBar().classList.remove("is-hidden");
                    }
                    if (!state) {
                        this.SideBar().classList.add("is-hidden");  
                    }
                } 
            },
            isTablet: () => {
             return window.matchMedia("(max-width: 1024px)").matches;
            },
            isHidden: function (el) {
                var style = window.getComputedStyle(el);
                return (style.display === 'none')
            },
            setToOnline() {
                hooks.Call(events.Home.StatusChanged, "online");
                this.StatusPopout().classList.toggle("is-hidden");
            },
            setToBusy() {
                hooks.Call(events.Home.StatusChanged, "busy");
                this.StatusPopout().classList.toggle("is-hidden");
            },
            setToBRB() {
                hooks.Call(events.Home.StatusChanged, "brb");
                this.StatusPopout().classList.toggle("is-hidden");
            },
            setToAway() {
                hooks.Call(events.Home.StatusChanged, "away");
                this.StatusPopout().classList.toggle("is-hidden");
            },
            UnselectAll() {
                this.StatusBtn().firstChild.classList.remove("is-active");
                this.ChatBtn().firstChild.classList.remove("is-active");
                this.UsersBtn().firstChild.classList.remove("is-active");
                this.OptionsBtn().firstChild.classList.remove("is-active");
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
            StatusPopout() {
                return document.getElementById("statusPopout");
            },
            SideBar() {
                return document.getElementById("sideBar");
            },
            OnNavButtonClicked(status) {
                hooks.Call(navEvents.ButtonClicked, status);  
                this.focus = status;        
                switch (status) {
                    case "status":
                        //hooks.Call(navEvents.MyStatusClicked);
                        this.StatusPopout().classList.toggle("is-hidden");
                        break;
                    case "chats":
                        this.UnselectAll();
                        hooks.Call(navEvents.ChatsClicked);
                        this.showChats = true;
                        this.showTeam = false;
                        this.SideBar().classList.remove("is-hidden"); 
                        this.ChatBtn().firstChild.classList.add("is-active");
                        break;
                    case "team":
                        this.UnselectAll();                        
                        hooks.Call(navEvents.TeamClicked);
                        this.showChats = false;
                        this.showTeam = true;                    
                        this.SideBar().classList.remove("is-hidden");   
                        this.UsersBtn().firstChild.classList.add("is-active");
                        break;
                    case "options":
                        this.UnselectAll();        
                        this.showChats = false;
                        this.showTeam = false;     
                        this.SideBar().classList.add("is-hidden");          
                        hooks.Call(navEvents.OptionsClicked);
                        this.OptionsBtn().firstChild.classList.add("is-active");
                        break;
                }
            }
        }
    });
})(woServices);