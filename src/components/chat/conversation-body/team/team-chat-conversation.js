(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;

    Vue.component("team-chat-conversation", {   
        props: [
            "user",
            "messages",
        ],  
        data: () => {
            return {
                ContainerId: elementId(),
                ChatScrollerId: elementId(),
                ShowCannedResponses: false,
                SelectedCannedResponse: null,
                SearchText: "",
                ShowGetPreviousLines: true,
            }
        }, 
        template: `
            <div class="chat-conversation">
                <div class="team-convo">
                    <div class="field searchField">
                        <p class="control has-icons-right">
                            <input id="searchConversation" class="input" type="text" placeholder="Search" v-on:keyup.enter="Search">                        
                            <span class="icon is-small is-right">
                                <i class="fas fa-search"></i>
                            </span>
                        </p>
                    </div>
                    <div v-if="ShowGetPreviousLines" class="previousLinesContainer" v-on:click="GetPreviousLines">
                        <i class="fas fa-level-up-alt"></i>
                    </div>
                </div>
                <div v-bind:id="ContainerId" class="chat-conversation-container">
                    <div class="active-chat" id="Conversation">
                        <div class="columns">
                            <div v-bind:id="ChatScrollerId" class="message-list no-gap-bottom team-message-list">
                                <div v-for="(v,k) in GroupedMessages" class="messages">
                                    <me-message v-if="v.isMe" :groupedMessage="v"></me-message>
                                    <them-message v-if="v.isMe == false" :groupedMessage="v"></them-message>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <canned-responses
                    :showing="ShowCannedResponses"
                    :selectedResponse="SelectedCannedResponse"
                    v-on:Close="CloseCannedResponses"
                ></canned-responses>
                <team-conversation-interaction 
                    :disabled="false"
                    v-on:CannedReponsesClicked="CannedResponsesClicked"
                >
                </team-conversation-interaction>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Connection.OperatorChat, (e) => {
                var userName = e.Header.toLowerCase();
                var exists = this.$store.state.operatorMessages[userName];
                var reversed = e.Data.reverse();

                if(reversed.length <= 0) this.ShowGetPreviousLines = false;
                if (exists != null) {
                    for(var i = reversed.length - 1; i >= 0; i--) {
                        this.$store.state.operatorMessages[userName].splice(0, 0, reversed[i]);
                    }
                } else {
                    this.$store.state.operatorMessages[userName] = reversed;
                    hooks.Call(events.Team.MessagedAdded);
                }

                this.$store.state.currentOperatorChatMessages = this.$store.state.operatorMessages[userName];
            });

            hooks.Register(events.Team.UserClicked, (user) => {
                delete this.$store.state.operatorMessages[this.user.Username.toLowerCase()];

                this.SearchText = "";
                this.SearchElem().value = "";
            });

            hooks.Register(events.Team.MessagedAdded, () => {
                this.ShowGetPreviousLines = true;
                this.ScrollChat();
            });

            hooks.Register(events.Chat.CannedResponsesClicked, (type) => {
                if (type != "team") return;
                this.Split();
            });

            hooks.Register(events.Chat.CannedResponsesClosed, (type) => {
                if (type != "team") return;
                this.Normal();
            });
        },
        methods: {
            Container() {
                return document.getElementById(this.ContainerId);
            },

            SearchElem() {
                return document.getElementById("searchConversation");
            },

            Split() {
                this.Container().style.width = "calc(70% - 4px)";
                this.Container().style.float = "left";
            },

            Normal() {
                this.Container().style.width = "calc(100% - 4px)";
                this.Container().style.float = "none";
            },

            ScrollChat() {
                var scroller = document.getElementById(this.ChatScrollerId);
                setTimeout(() => {
                    if(scroller != null) {
                        scroller.scrollBy({
                            top: scroller.scrollHeight,
                            left: 0,
                            behavior: "smooth"
                        });
                    }
                }, 100);
            },

            CloseCannedResponses() {
                this.ShowCannedResponses = false;
                this.Normal();
            },

            CannedResponsesClicked() {
                this.ShowCannedResponses = !this.ShowCannedResponses;
                if(this.ShowCannedResponses) {
                    this.Split();
                } else {
                    this.Normal();
                }
            },

            GetPreviousLines() {
                if (this.messages.length > 0) {
                    var lastMessage = this.messages[0];
                    connection.GetClientChat(this.user.Username, lastMessage.ID, this.SearchText);
                }
            },

            Search() {
                var txt = this.SearchElem().value;
                if(txt.length > 0) {
                    this.SearchText = txt;

                    this.$store.state.operatorMessages[this.user.Username.toLowerCase()] = [];
                    delete this.$store.state.operatorMessages[this.user.Username.toLowerCase()];
                    this.$store.state.currentOperatorChatMessages = [];
                    
                    connection.GetClientChat(this.user.Username, 0, this.SearchText);
                } else {
                    this.SearchText = "";
                    connection.GetClientChat(this.user.Username, 0);
                }
            },
        },
        computed: {
            GroupedMessages() {
                var grouped = [];
                for(var i = 0; i < this.messages.length; i++) {
                    var message = this.messages[i];
                    var name = message.MyLine ? this.$store.state.userInfo.Name : this.user.Name;
                    var groupedMessage = {
                        messages: [
                            message
                        ],
                        time: new Date(message.Dated).toLocaleTimeString(),
                        isLink: message.isLink || false,
                        Name: name,
                        isMe: message.MyLine
                    };
                    var currentTime = new Date(message.Dated);
                    if(message.isLink == undefined || message.isLink == false) { 
                        for(var k = i + 1; k < this.messages.length; k++) {
                            var messageTime = new Date(this.messages[k].Dated);
                            var diff = (messageTime - currentTime) / 1000;
                            if(this.messages[k].isLink == undefined) {this.messages[k].isLink = false;}
                            if(
                                this.messages[k].MyLine == message.MyLine &&
                                diff <= 10 &&
                                this.messages[k].isLink == groupedMessage.isLink
                            ) {

                                groupedMessage.messages.push(this.messages[k]);
                                groupedMessage.time = new Date(this.messages[k].Dated).toLocaleTimeString();
                            } else {
                                break;
                            }
                        } 
                    }

                    grouped.push(groupedMessage);
                    i += groupedMessage.messages.length - 1;
                }
                
                return grouped;
            }
        }
    });
})(woServices);