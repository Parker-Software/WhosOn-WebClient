(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    var state = services.Store.state;

    Vue.component('chatHeader', {
        template: `
        <div v-bind:class="{'beingMonitored': BeingMonitoredByYou}" style="padding: 1rem; height:130px;">
            <div class="customColumn is-narrow" style="width:80px">
                <figure class="avatar image is-64x64">
                    <i class="fas fa-user fa-4x"></i>
                    <div v-if="this.$store.state.currentChat.Closed == false" class="status online"><i class="fas fa-circle"></i></div>
                    <div v-if="this.$store.state.currentChat.Closed == true" class="status busy"><i class="fas fa-circle"></i></div>
                </figure>
            </div>
            <div class="customColumn">
                <div class="chat-header">
                    <div class="content">
                        <p>
                            <strong v-if="BeingMonitoredByYou == false">
                                {{this.$store.state.currentChat.Name}} 
                                <span v-if="this.$store.state.currentChat.Closed">(Closed)</span> 
                            </strong><br  v-if="BeingMonitoredByYou == false">
                            <strong v-if="BeingMonitoredByYou">
                                {{this.$store.state.currentChat.Name}} Chatting to {{this.$store.state.currentChat.TalkingTo}}
                            </strong><br  v-if="BeingMonitoredByYou" />
                            <small v-if="BeingMonitoredByYou"><strong>Monitoring</strong><br/></small>
                            <small>{{this.$store.state.currentChat.SiteName}}</small><br />
                            <small>{{this.$store.state.currentChat.Location}}</small><br />
                            <small>{{visitorsEmail}}</small>
                        </p>
                    </div>
                </div>
            </div>
            <div class="customColumn" style="float:right;">
                <div class="chat-header-icons is-pulled-right">
                    <a v-if="BeingMonitoredByYou" id="stopMonitoringChatBtn" class="tooltip" data-tooltip="Stop Monitoring" v-on:click="StopMonitoringClicked">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <a v-if="BeingMonitoredByYou == false" id="closeChatBtn" class="tooltip" data-tooltip="Close this chat" v-on:click="CloseClicked">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <a v-if="BeingMonitoredByYou == false" id="transferBtn" data-show="quickview" data-target="quickviewDefault" v-on:click="TransferClicked" class="tooltip" data-tooltip="Show transfer list">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-users fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <!--
                    <a href="#" class="tooltip" data-tooltip="Request monitor">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-graduation-cap fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <a href="#" class="tooltip" data-tooltip="Email transcript">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-envelope fa-stack-1x fa-inverse white"></i>
                        </span>
                    </a>
                    <a href="#" class="tooltip" data-tooltip="Show block options">
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
                if(surveys.length <= 0) return "";

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
                if(this.CloseBtn() != null) this.CloseBtn().setAttribute("disabled", true);
            },
            EnableCloseChatButton() {
                if(this.CloseBtn() != null) this.CloseBtn().removeAttribute("disabled");
            },
            EnableStopMonitoringButton() {
                if(this.StopMonitoringBtn() != null) this.StopMonitoringBtn().removeAttribute("disabled");
            },
            DisableStopMonitoringButton() {
                if(this.StopMonitoringBtn() != null) this.StopMonitoringBtn().setAttribute("disabled", true);
            },
            DisableTransferButton() {
                if(this.TransferBtn() != null) this.TransferBtn().setAttribute("disabled", true);
            },
            EnableTransferButton() {
                if(this.TransferBtn() != null)  this.TransferBtn().removeAttribute("disabled");
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
                hooks.Call(chatEvents.StopMonitoringChatClicked, state.currentChat.Number);
            }
        }
    });
})(woServices);