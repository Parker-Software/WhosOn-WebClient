(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var state = services.Store.state;

    Vue.component(services.Store.state.homeViewName, {
        template: `
            <section v-bind:id="this.$store.state.homeViewName" class="view">
                <homeheader></homeheader>
                <div id="app-content">
                    <homenav></homenav>
                    <div class="customColumn" id="page-content">
                        <div class="content-body">
                            <homeMyStatus></homeMyStatus>
                            <div id="Chats" style="width: 100%; height: 100%;">
                                <homeActiveChats></homeActiveChats>
                                <homeChatArea></homeChatArea>
                                <homeNoChatsArea></homeNoChatsArea>
                            </div>
                            <div id="Team" style="display: none; width:100%; height: 100%;">
                                <homeTeamUsers></homeTeamUsers>
                                <homeTeamChat></homeTeamChat>
                            </div>
                            <div id="Options" style="display: none; width:100%; height: 100%; position:relative; padding:20px;">
                                <homeOptionsHeaderTabs></homeOptionsHeaderTabs> 
                                <homeOptionsContent></homeOptionsContent>
                                <homeOptionsFooter></homeOptionsFooter>
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

                hooks.Register(events.Chat.AcceptChat, (chatInfo) => {
                    hideAll();
                    showChat();
                    showActiveChats();
                });

                hooks.Register(events.Chat.CloseChat, (chatNum) => {    
                    hideAll();
                    showChat();
                    showNoActiveChats();
                });
                
                hooks.Register(events.Chat.ChatLeft, (chatNum) => {    
                    hideAll();
                    showChat();
                    showNoActiveChats();
                });

                hooks.Register(events.Chat.MonitorChat, (chatInfo) => {
                    // todo: implement monitoring
                    alert('Monitoring not available');
                });

                hooks.Register(events.Home.StatusChanged, (status) => {
                   services.WhosOnConn.ChangeStatus(status);
                });

                hooks.Register(events.Options.LogoutClicked, () => {
                    hooks.Call(events.Chat.HideAll);
                });
                
            }
    });

    function hideAll() {
        document.getElementById("Chats").style.display = "none";
        document.getElementById("Team").style.display = "none";
        document.getElementById("Options").style.display = "none";
    };


    function showTeam() {
        document.getElementById("Team").style.display = "block";
    }

    function showChat() {
        document.getElementById("Chats").style.display = "block";
    }

    function showOptions() {
        document.getElementById("Options").style.display = "block";
    }

    function showNoActiveChats() {
        hooks.Call(events.Chat.ShowNoActiveChats);
    }

    function showActiveChats() {
        hooks.Call(events.Chat.ShowActiveChats);
    }
})(woServices);