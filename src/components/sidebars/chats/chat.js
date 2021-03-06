(function(services){
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    
    Number.prototype.toFormattedWaitTime = function () {
        var sec_num = this;
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        var string = "";

        if(hours > 0) {
            string = `${hours} Hours ${minutes} Mins`;
        } else {
            if(minutes > 0)  {string += `${minutes} Mins`;}
            string = `${string} ${seconds} Seconds`;
        }

        return string;
    }

    var chatWaitingTimer = setInterval(() => {
        var chats = state.chats;

        if(chats != null && Object.keys(chats).length > 0) {
            Object.keys(chats).forEach((v) => {
                var chat = chats[v];
                if(chat.TalkingTo == null || chat.TalkingTo == "") {
                    chat.WaitedSecs++;

                    if(chat.WaitedSecs > 30) {
                        chat.WaitingWarning = true;
                    }
                    chat.WaitedFor = chat.WaitedSecs.toFormattedWaitTime();
                    chat.Status = chat.WaitedFor;
                }
            });
            

            state.chats = Copy(state.chats);
        }
    }, 1000);

    Vue.component("chat", {
        props: [
            "chat"
        ],
        template: `
            <li @click="onClicked">
                <div :class="{'is-selected':chat.IsActiveChat, 'beingMonitored':chat.BeingMonitoredByYou && chat.IsActiveChat, 'blink':WaitingResponse}" class="box status-border chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <p class="chat-info-item"><strong>{{chat.Name}}</strong></p>
                                <p v-if="chat.Channel" class="chat-info-item"><small>{{chat.Channel}}</small></p>
                                <p v-else class="chat-info-item"><small>{{chat.Location}}</small></p>
                                <p class="chat-info-item"><small><strong>{{chat.SiteName}}</strong></small></p>
                                <p class="chat-info-item"><small><strong  :class="{'chat-waiting-warning':chat.WaitingWarning}">{{chat.Status}} <span v-if="chat.QueuePos > 0">(Queued)</span></strong></small></p>
                                <p class="chat-info-item"><small v-if="chat.Monitoredby != null"><strong>Monitored By {{MonitoredByWho}}</strong></small></p>                            
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `,
        computed: {
            MonitoredByWho() {
                if(this.chat.Monitoredby == state.userInfo.Name) {return "You";}
                else {return this.chat.Monitoredby;}
            },

            WaitingResponse() {
                if (
                    this.chat.TalkingToClientConnection != 0 &&
                    this.chat.TalkingToClientConnection != this.$store.state.currentConnectionId
                ) {
                    return;
                }

                let chatMessages = this.$store.state.chatMessages[this.chat.ChatUID];
                
                if(chatMessages) {
                    let lastMessage = chatMessages[chatMessages.length - 1];
                    if(lastMessage && lastMessage.code == 0) {
                        return true;
                    }
                } else {
                    return true;
                }

                return false;
            }
        },
        methods: {
            onClicked() {
                if(Object.keys(state.currentChat).length > 0) {
                    var currentSiteWrapUpRequired = 
                        state.sites[state.currentChat.SiteKey].WrapUp.Required &&
                        state.sites[state.currentChat.SiteKey].WrapUp.Enabled;
                    
                        if(state.currentChat.BeingMonitoredByYou == false && state.currentChat.Closed && currentSiteWrapUpRequired && state.currentChat.WrapUpCompleted == false) 
                    {
                        hooks.Call(chatEvents.WrapUpNotCompleted, state.currentChat.Number);
                        return;
                    }
                }

                var element = document.getElementById("homeActiveChats");
                var wrapper = document.getElementById("active-chats-wrapper");
                if(this.chat.TalkingToClientConnection == 0 || this.chat.TalkingToClientConnection  == state.currentConnectionId) {
                    var inputArea = document.getElementById("inputArea");
                    if (inputArea != null) inputArea.innerText = "";
                    hooks.Call(events.ChatItem.AcceptClicked, { "Number": this.chat.Number, "ChatId": this.chat.ChatUID});
                    element.classList.toggle("show");   
                    wrapper.classList.toggle("opacity");
                } else if (this.chat.TalkingToClientConnection !== state.currentConnectionId) {
                    if(state.rights.MonitorChats) {hooks.Call(events.ChatItem.MonitorClicked, {"Number": this.chat.Number, "ChatId": this.chat.ChatUID });}
                    element.classList.toggle("show");   
                    wrapper.classList.toggle("opacity");
                }
            }
        }
    });
})(woServices);