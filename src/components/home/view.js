(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var state = services.Store.state;

    Vue.component(services.Store.state.homeViewName, {
        template: `
            <section v-bind:id="$store.state.homeViewName" class="view">
                <appheader></appheader>               
                <div id="app-content">
                    <navigation></navigation>     
                    <div class="main-view customColumn" id="page-content">                   
                        <div class="content-body">
                            <div class="main-view-chats" id="Chats">                              
                                <chattingArea></chattingArea>
                                <noChatsArea></noChatsArea>
                            </div>
                            <div id="Team" class="team-view">                            
                                <teamArea></teamArea>
                            </div>
                            <div id="Options" class="options">
                                <div class="options-view">
                                    <optionsHeaderTabs></optionsHeaderTabs> 
                                    <optionsContent></optionsContent>
                                </div>
                                <optionsFooter></optionsFooter>
                            </div>
                            <div id="Sites" class="sites">
                                <sitesArea></sitesArea>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            `,
            mounted() {
                hideAll();
                showChat();
                showNoActiveChats();               
            },
            beforeCreate() {
                hooks.Register(navEvents.ChatsClicked, (e) => {
                    var alreadyViewing = document.getElementById("chatsNavButton").firstChild.classList.contains("is-active");
                    if(alreadyViewing == false) {
                        hideAll();
                        showChat();
                    }
                });

                hooks.Register(navEvents.TeamClicked, (e) => {
                    hideAll();
                    showTeam();
                });              

                hooks.Register(navEvents.OptionsClicked, (e) => {
                    hideAll();
                    showOptions();
                });

                hooks.Register(navEvents.SitesClicked, (e) => {
                    hideAll();
                    showSites();
                });

                hooks.Register(events.ChatItem.AcceptClicked, (chatInfo) => {
                    hideAll();
                    showChat();
                    showActiveChats();
                });

                hooks.Register(events.ChatModal.CloseChatConfirmed, (chatNum) => {    
                    hideAll();
                    showChat();
                    showNoActiveChats();
                });

                hooks.Register(events.ChatModal.StopMonitoringChatConfirmed, (chatNum => {
                    hideAll();
                    showChat();
                    showNoActiveChats();
                }));
                
                hooks.Register(events.Chat.ChatLeft, (chatNum) => {    
                    hideAll();
                    showChat();
                    showNoActiveChats();
                });

                hooks.Register(events.ChatItem.MonitorClicked, (chatNum) => {
                    hideAll();
                    showChat();
                    showActiveChats();
                });

                hooks.Register(events.Home.StatusChanged, (status) => {
                   services.WhosOnConn.ChangeStatus(status);
                });
            }
    });

    function hideAll() {
        document.getElementById("Chats").style.display = "none";
        document.getElementById("Team").style.display = "none";
        document.getElementById("Options").style.display = "none";
        document.getElementById("Sites").style.display = "none";
    };


    function showTeam() {
        document.getElementById("Team").style.display = "block";
    }

    function showChat() {
        document.getElementById("Chats").style.display = "flex";
    }

    function showOptions() {
        document.getElementById("Options").style.display = "block";
    }

    function showSites() {
        document.getElementById("Sites").style.display = "block";
    }

    function showNoActiveChats() {
        hooks.Call(events.Chat.ShowNoActiveChats);
    }

    function showActiveChats() {
        hooks.Call(events.Chat.ShowActiveChats);
    }
})(woServices);