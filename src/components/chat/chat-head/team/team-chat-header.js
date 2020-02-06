(function(services){
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
                    <div v-if="user.HasPhoto == false" v-bind:class="VisitorLetter.toLowerCase()" class="badge">
                        {{VisitorLetter}}
                        <div class="status online-user" v-if="user.Status == 0 && Connected"></div>
                        <div class="status busy-user" v-if="user.Status == 1 && Connected"></div>
                        <div class="status brb-user" v-if="user.Status == 2 && Connected"></div>
                        <div class="status away-user" v-if="user.Status >= 3 && Connected"></div>
                        <div class="status" v-if="Connected == false"></div>
                    </div>
                    <figure class="image is-48x48" v-if="user.HasPhoto">
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
                            <p class="chat-header-item"><small>{{FullStatus}}</small></p>
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
                    </div>             
                </div>            
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Connection.UserDisconnecting, (e) => {
                var userConn = e.Data;
                if(userConn == this.user.Connection) {
                    this.Connected = false;
                    this.user.Status = 4;
                }
            });
        },
        computed: {
            VisitorLetter(){
                if(this.user.Username === undefined) {return;}
                return this.user.Username.charAt(0).toUpperCase();
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
            }
        },
        methods: {        
            CloseClicked(e) {
                hooks.Call(events.Team.CloseChatClicked);
            },
            TransferClicked(e) {
                hooks.Call(chatEvents.TransferClicked);
            }
        }
    });
})(woServices);