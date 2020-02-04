(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    var state = services.Store.state;

    Vue.component("visitor-chat-header", {       
        props: [
            "chat"
        ],
        template: `
            <div v-bind:class="{'beingMonitored': BeingMonitoredByYou}" class="columns chat-header">
                <div class="customColumn is-narrow column no-gap-right is-tablet">
                    <div v-bind:class="setBackgroundColor" class="badge">{{visitorLetter}}<div class="status"></div></div>         
                </div>
                <div class="customColumn column is-tablet">
                    <div class="chat-header">
                        <div class="content">
                            <p class="chat-header-item">
                                <strong v-if="BeingMonitoredByYou == false" class="has-text-weight-medium">
                                    {{chat.Name}} 
                                    <span v-if="chat.Closed">(Closed)</span> 
                                </strong>
                                <strong v-if="BeingMonitoredByYou">
                                    {{chat.Name}} Chatting to {{chat.TalkingTo}}
                                </strong>
                            </p>
                            <p class="chat-header-item monitor-label"><small v-if="BeingMonitoredByYou"><strong>Monitoring</strong></small></p>
                            <p class="chat-header-item"><small>{{chat.SiteName}}</small></p>
                            <p class="chat-header-item"><small>{{chat.Location}}</small></p>
                            <p class="chat-header-item"><small>{{visitorsEmail}}</small></p>
                        </div>
                    </div>
                </div>        
                <div class="customColumn column is-tablet">
                    <div class="chat-header-icons is-pulled-right">
                        <button v-if="BeingMonitoredByYou" id="stopMonitoringChatBtn" class="has-tooltip-left" data-tooltip="Stop Monitoring" v-on:click="StopMonitoringClicked">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                            </span>
                        </button>
                        <button v-if="BeingMonitoredByYou == false" id="closeChatBtn" class="has-tooltip-left" data-tooltip="Close this chat" v-on:click="CloseClicked">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                            </span>
                        </button>
                        <button v-if="BeingMonitoredByYou == false" id="transferBtn" data-show="quickview" data-target="quickviewDefault" v-on:click="TransferClicked" class="has-tooltip-left" data-tooltip="Show transfer list">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-users fa-stack-1x fa-inverse white"></i>
                            </span>
                        </button>
                        <!--
                        <button href="#" class="has-tooltip-left" data-tooltip="Request monitor">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-graduation-cap fa-stack-1x fa-inverse white"></i>
                            </span>
                        </button>
                        <button href="#" class="has-tooltip-left" data-tooltip="Email transcript">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-envelope fa-stack-1x fa-inverse white"></i>
                            </span>
                        </button>
                        <button href="#" class="has-tooltip-left" data-tooltip="Show block options">
                            <span class="fa-stack fa-2x">
                                <i class="fas fa-circle fa-stack-2x"></i>
                                <i class="fas fa-ban fa-stack-1x fa-inverse white"></i>
                            </span>
                        </a>-->
                    </div>             
                </div>            
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.ChatModal.CloseChatConfirmed, () => {
                this.DisableCloseChatButton();
                this.DisableStopMonitoringButton();
                this.DisableTransferButton();
            });

            hooks.Register(events.Connection.CurrentChatClosed, () => {
                this.DisableTransferButton();
            });

            hooks.Register(events.ChatItem.AcceptClicked, (e) => {
                this.EnableCloseChatButton();
                this.EnableTransferButton();
            });

            hooks.Register(events.Connection.MonitoredChat, () => {
                this.EnableStopMonitoringButton();
            });

            hooks.Register(events.ChatItem.MonitorClicked, () => {
                setTimeout(() => {
                    this.EnableStopMonitoringButton();
                }, 100);
            });
        },
        computed: {
            visitorsEmail() {
                var surveys = woServices.Store.state.currentChatPreSurveys;
                if(surveys.length <= 0) {return "";}

                for(var i = 0; i < surveys.length; i++)
                {
                    var survey = surveys[i];
                    if(survey.BuiltInField == "email address")
                    {
                        return survey.Value;
                    }
                }
                return "";
            },
            BeingMonitoredByYou() {
                return state.currentChat.BeingMonitoredByYou;
            },
            currentSite() {
                var site = null;
                if(Object.keys(state.currentChat).length > 0) {
                    site = state.sites[state.currentChat.SiteKey];
                }

                return site;
            },
            currentChat() {
                return state.currentChat;
            },
            visitorLetter(){
                var name = state.currentChat.Name;
                if(name === undefined) {return;}
                return name.charAt(0).toUpperCase();
            },
            setBackgroundColor() {
                var name = state.currentChat.Name;
                if(name === undefined) {return;}              
                return name.charAt(0).toLowerCase();
            }
        },
        methods: {         
            CloseBtn() {
                return document.getElementById("closeChatBtn");
            },
            StopMonitoringBtn() {
                return document.getElementById("stopMonitoringChatBtn");
            },
            TransferBtn() {
                return document.getElementById("transferBtn");
            },
            DisableCloseChatButton() {
                if(this.CloseBtn() != null) {this.CloseBtn().setAttribute("disabled", true);}
            },
            EnableCloseChatButton() {
                if(this.CloseBtn() != null) {this.CloseBtn().removeAttribute("disabled");}
            },
            EnableStopMonitoringButton() {
                if(this.StopMonitoringBtn() != null) {this.StopMonitoringBtn().removeAttribute("disabled");}
            },
            DisableStopMonitoringButton() {
                if(this.StopMonitoringBtn() != null) {this.StopMonitoringBtn().setAttribute("disabled", true);}
            },
            DisableTransferButton() {
                if(this.TransferBtn() != null) {this.TransferBtn().setAttribute("disabled", true);}
            },
            EnableTransferButton() {
                if(this.TransferBtn() != null)  {this.TransferBtn().removeAttribute("disabled");}
            },
            CloseClicked(e) {
                var currentSiteWrapUpRequired = state.sites[state.currentChat.SiteKey].WrapUp.Required;
                if(currentSiteWrapUpRequired == false || (currentSiteWrapUpRequired && state.currentChat.WrapUpCompleted)) 
                {
                    hooks.Call(chatEvents.CloseChatClicked, state.currentChat.Number);
                } else {
                    hooks.Call(chatEvents.WrapUpNotCompleted, state.currentChat.Number);
                }
            },
            TransferClicked(e) {
                hooks.Call(chatEvents.TransferClicked);
            },
            StopMonitoringClicked(e) {
                hooks.Call(events.ChatModal.StopMonitoringChatConfirmed, state.currentChat.Number);                
            }
        }
    });
})(woServices);