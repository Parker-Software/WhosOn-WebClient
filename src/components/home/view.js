(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var state = services.Store.state;
    var connection = services.WhosOnConn;

    Vue.component(services.Store.state.homeViewName, {
        data: () => {
            return {
                showChat: true,
                showClosedChat: false,
                showTeam: false,
                showOptions: false,
                showSites: false,
                showMonitorAll: false,
                showMissedChats: false,
                chat: {
                    showNoActiveChats: true,
                    showActiveChats: false
                },
                closedChats: {
                    showNoActiveChats: true,
                    showActiveChats: false
                },
                team: {
                    showNoActiveChats: true,
                    showActiveChats: false
                }
            };
        },
        template: `
            <section v-bind:id="$store.state.homeViewName" class="view">
                <appheader></appheader>               
                <div id="app-content">
                    <navigation></navigation>     
                    <div class="main-view customColumn" id="page-content">                   
                        <div class="content-body">
                            <div v-bind:class="{'is-hidden': !showChat}" class="main-view-chats" id="Chats">                              
                                <chattingArea :show="chat.showActiveChats" :chat="$store.state.currentChat" :closedChatView="false"></chattingArea>
                                <noChatsArea :show="chat.showNoActiveChats"></noChatsArea>
                            </div>
                            <div v-bind:class="{'is-hidden': !showClosedChat}" class="main-view-closedChats" id="ClosedChats">                              
                                <chattingArea :show="closedChats.showActiveChats" :chat="$store.state.currentClosedChat" :closedChatView="true"></chattingArea>
                                <noClosedChatsArea :show="closedChats.showNoActiveChats"></noClosedChatsArea>
                            </div>
                            <div v-bind:class="{'is-hidden': !showTeam}" id="Team" class="team-view">                            
                                <chattingArea :show="team.showActiveChats" :user="$store.state.selectedOperatorToOperatorUser"></chattingArea>
                                <noChatsArea :show="team.showNoActiveChats"></noChatsArea>
                            </div>
                            <div id="Options" class="options" v-bind:class="{'is-hidden': showOptions == false}">
                                <div class="options-view">
                                    <optionsHeaderTabs></optionsHeaderTabs> 
                                    <optionsContent></optionsContent>
                                </div>
                                <optionsFooter></optionsFooter>
                            </div>
                            <div id="MonitorAll" v-show="showMonitorAll">
                                <monitor-all-view :chats="$store.state.chats"></monitor-all-view>
                            </div>
                            <div id="Sites" class="sites"  v-bind:class="{'is-hidden': showSites == false}">
                                <sitesArea></sitesArea>
                            </div>
                            <div id="MissedChats" class="missedchats"  v-bind:class="{'is-hidden': showMissedChats == false}">
                                <missedChatsArea />
                            </div>
                        </div>
                    </div>

                    <changePassword />
                    <ackFailed />
                </div>
            </section>
            `,
            beforeCreate() {
                hooks.register(navEvents.MissedChatsClicked, (e) => {
                    var alreadyViewing = document.getElementById("missedchatsNavButton").firstChild.classList.contains("is-active");
                    if(alreadyViewing == false) {
                        this.hideAll();
                        this.showMissedChats = true;
                    }
                });

                hooks.register(navEvents.ChatsClicked, (e) => {
                    var alreadyViewing = document.getElementById("chatsNavButton").firstChild.classList.contains("is-active");
                    if(alreadyViewing == false) {
                        this.hideAll();
                        this.showChat = true;
                    }
                });

                hooks.register(navEvents.ClosedChatsClicked, (e) => {
                    var alreadyViewing = document.getElementById("closedChatsNavButton").firstChild.classList.contains("is-active");
                    if (alreadyViewing == false) {
                        this.hideAll();
                        this.showClosedChat = true;
                    }
                });


                hooks.register(navEvents.TeamClicked, (e) => {
                    var alreadyViewing = document.getElementById("usersNavButton").firstChild.classList.contains("is-active");
                    if(alreadyViewing == false) {
                        this.hideAll();
                        this.showTeam = true;
                    }
                });              

                hooks.register(events.Team.UserClicked, (user) => {
                    this.hideAll();
                    this.showTeam = true;
                    this.showTeamActiveChats();

                    if(user != this.selectedOperatorToOperatorUser) {
                        this.selectedOperatorToOperatorUser = this.$store.state.users.find(x => x.Username == user.Username);
                        delete this.$store.state.operatorMessages[user.Username.toLowerCase()];
                        this.$store.state.currentOperatorChatMessages = [];
                        connection.getClientChat(user.Username, 0);
                        hooks.call(events.Team.OtherUserClicked, user);
                    }
                });

                
                hooks.register(events.Team.CloseChatClicked, () => {
                    delete this.$store.state.operatorMessages[this.selectedOperatorToOperatorUser.Username.toLowerCase()];
                    this.selectedOperatorToOperatorUser = null;
                    this.showTeamNoActiveChats();
                    this.$store.state.currentOperatorChatMessages = [];
                });

                hooks.register(navEvents.OptionsClicked, (e) => {
                    this.hideAll();
                    this.showOptions = true;
                });

                hooks.register(navEvents.MonitorClicked, (e) => {
                    this.hideAll();
                    this.showMonitorAll = true;


                    for(var i = 0; i < this.$store.state.chats.length; i++) {
                        var chat = this.$store.state.chats[i];
                        var messages = this.$store.state.chatMessages[chat.ChatUID];

                        if(messages == null || messages.length <= 0) {
                            connection.getPreviousChat(chat.SiteKey, chat.ChatUID);
                        }

                    }
                });

                hooks.register(navEvents.SitesClicked, (e) => {
                    var alreadyViewing = document.getElementById("sitesNavButton").firstChild.classList.contains("is-active");
                    if(alreadyViewing == false) {
                        this.hideAll();
                        this.showSites = true;
                    }
                });

                
                hooks.register(events.Chat.WrapUpNotCompleted, (wrapupinfo) => {
                    if (wrapupinfo.IsFocused) {
                        this.hideAll();
                        this.showClosedChat = true;
                        this.showClosedChats();
                        this.showNoActiveChats();
                    }
                });


                hooks.register(events.ChatItem.AcceptClicked, (chatInfo) => {
                    this.hideAll();
                    this.showChat = true;
                    this.showActiveChats();
                });

                hooks.register(events.ChatItem.ClosedChatClicked, (chatUID) => {
                    this.hideAll();
                    this.showClosedChat = true;
                    this.showClosedChats();
                });

                hooks.register(events.Chat.CloseChatFinalised, (chatNum) => {    
                    this.hideAll();
                    this.showChat = true;
                    this.showNoActiveChats();
                });

                hooks.register(events.ChatModal.SoftCloseChatConfirmed, (chatNum) => {    
                    this.hideAll();
                    this.showChat = true;
                    this.showNoActiveChats();
                });

                hooks.register(events.ChatModal.StopMonitoringChatConfirmed, (chatNum => {
                    this.hideAll();
                    this.showChat = true;
                    this.showNoActiveChats();
                }));
                
                hooks.register(events.Chat.ChatLeft, (chatNum) => {    
                    this.hideAll();
                    this.showChat = true;
                    this.showNoActiveChats();
                });

                hooks.register(events.ChatItem.MonitorClicked, (chatNum) => {
                    this.hideAll();
                    this.showChat = true;
                    this.showActiveChats();
                });

                hooks.register(events.Home.StatusChanged, (status) => {
                   services.WhosOnConn.changeStatus(status);
                });
            },
            methods: {
                hideAll() {
                    this.showChat = false;
                    this.showClosedChat = false;
                    this.showTeam = false;
                    this.showOptions = false;
                    this.showSites = false;
                    this.showMonitorAll = false;
                    this.showMissedChats = false;
                },
                showActiveChats() {
                    this.chat.showNoActiveChats = false;
                    this.chat.showActiveChats = true;
                },
                showNoActiveChats() {
                    this.chat.showActiveChats = false;
                    this.chat.showNoActiveChats = true;
                },
                showClosedChats() {
                    this.closedChats.showActiveChats = true;
                    this.closedChats.showNoActiveChats = false;
                },
                showNoClosedChats() {
                    this.closedChats.showActiveChats = false;
                    this.closedChats.showNoActiveChats = true;
                },
                showTeamActiveChats() {
                    this.team.showNoActiveChats = false;
                    this.team.showActiveChats = true;
                },
                showTeamNoActiveChats() {
                    this.team.showActiveChats = false;
                    this.team.showNoActiveChats = true;
                }
            }
    });
})(woServices);