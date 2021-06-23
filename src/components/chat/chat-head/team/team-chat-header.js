(function(services){
    var connection = services.WhosOnConn;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component("team-chat-Header", {       
        props: [
            "user"
        ],
        data: () => {
            return {
                "Connected": true
            };
        },
        template: `
            <div class="columns chat-header team-chat-header">
                <div class="is-narrow column no-gap-right is-tablet">
                    <div v-if="user.HasPhoto == false" v-bind:class="VisitorLetter[0].toLowerCase()" class="badge">
                        {{VisitorLetter}}
                        <div class="status online-user" v-if="user.Status == 0 && Connected"></div>
                        <div class="status busy-user" v-if="user.Status == 1 && Connected"></div>
                        <div class="status brb-user" v-if="user.Status == 2 && Connected"></div>
                        <div class="status away-user" v-if="user.Status >= 3 && Connected"></div>
                        <div class="status" v-if="Connected == false"></div>
                    </div>
                    <figure class="image is-35x35" v-if="user.HasPhoto">
                        <div class="status online-user" v-if="user.Status == 0 && Connected"></div>
                        <div class="status busy-user" v-if="user.Status == 1 && Connected"></div>
                        <div class="status brb-user" v-if="user.Status == 2 && Connected"></div>
                        <div class="status away-user" v-if="user.Status >= 3 && Connected"></div>
                        <div class="status" v-if="Connected == false"></div>
                        <img v-bind:class="user.Username" v-bind:src="Photo" alt="Image" class="is-rounded">    
                    </figure>  
                </div>
                <div class="column is-tablet">
                    <div class="chat-header">
                        <div class="content">
                            <p class="chat-header-item">
                                <strong class="has-text-weight-medium">
                                    {{user.Name}} 
                                    <span v-if="user.Closed">(Closed)</span> 
                                </strong>
                            </p>
                            <p class="chat-header-item">
                                <select 
                                    ref="statusSelect" 
                                    v-if="ImTeamLeader &&
                                          Connected
                                        "
                                    v-bind:value="user.Status"
                                    v-on:change="OnStatusChanged" 
                                >
                                    <option value="0">Online</option>
                                    <option value="1">Busy</option>
                                    <option value="2">Be right back</option>
                                    <option value="3">Away</option>
                                </select>
                                
                                <small 
                                    v-else
                                >
                                    {{FullStatus}}
                                </small>
                            </p>
                            <p class="chat-header-item"><small>{{user.Dept}} <span v-if="user.Skills">({{user.Skills}})</span></small></p>
                            <p class="chat-header-item"><small>{{user.Email}}</small></p>
                        </div>
                    </div>
                </div>        
                <div class="column is-tablet">
                    <div class="chat-header-icons is-pulled-right">
                        <button id="closeChatBtn" class="has-tooltip-left" data-tooltip="Close this chat" v-on:click="CloseClicked">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                            </span>
                        </button>
                        <button v-if="ImTeamLeader" v-bind:disabled="Connected == false" class="has-tooltip-left" data-tooltip="Force logout for this user" v-on:click="Kick">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-sign-out-alt fa-stack-1x fa-inverse white"></i>
                            </span>
                        </button>
                    </div>             
                </div>            
            </div>
        `,
        beforeCreate() {
            hooks.register(events.Connection.UserDisconnecting, (e) => {
                var userConn = e.Data;
                if(userConn == this.user.Connection) {
                    this.Connected = false;
                    this.user.Status = 4;
                }
            });

            hooks.register(events.Team.OtherUserClicked, (user) => {
                this.Connected = true;
            });
        },
        computed: {
            MyUserName() {
                return this.$store.state.userName;
            },

            MyUser() {
                return this.$store.state.userInfo;
            },

            ImTeamLeader() {
                return  this.MyUser.TeamLeader &&
                        this.MyUserName != this.user.Username &&
                        this.MyUser.GroupID == this.user.GroupID;
            },

            VisitorLetter(){
                var name = this.user.Name;
                if(name) {
                    var split = name.split(' ');
                    var characters = name.charAt(0).toUpperCase();

                    if(split.length > 1) {
                        characters += split[1].charAt(0).toUpperCase();
                    } 

                    return characters;
                }
                return;
            },

            FullStatus() {
                var statuses = {
                    0: "Online",
                    1: "Busy",
                    2: "Be Right Back",
                    3: "Away",
                    4: "Disconnected"
                }

                return statuses[this.user.Status];
            },

            Photo() {
                return `data:image/png;base64, ${this.user.Photo}`;
            },

            StatusSelect() {
                return this.$refs.statusSelect;
            }
        },
        methods: {        
            CloseClicked(e) {
                hooks.call(events.Team.CloseChatClicked);
            },

            TransferClicked(e) {
                hooks.call(chatEvents.TransferClicked);
            },

            OnStatusChanged(e) {
                connection.changeStatusOfUser(
                    this.user.Connection,
                    this.StatusSelect.value
                );
            },

            Kick() {
                connection.kickOtherOperator(
                    this.user.Connection,
                    ""
                );
            }
        }
    });
})(woServices);