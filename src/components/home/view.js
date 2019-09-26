(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var state = services.Store.state;

    Vue.component(services.Store.state.homeViewName, {
        template: `
            <section v-bind:id="this.$store.state.homeViewName">
                <homeheader></homeheader>
                <div class="columns" id="app-content">
                    <homenav></homenav>
                    <div class="column is-11" id="page-content">
                        <div class="content-body">
                                    <homeMyStatus></homeMyStatus>
                                    <div id="Chats" style="width: 100%; height: 100%;">
                                        <div class="columns">
                                            <homeActiveChats></homeActiveChats>
                                            <homeChatArea></homeChatArea>
                                            <homeNoChatsArea></homeNoChatsArea>
                                        </div>
                                    </div>
                                   <div id="Team" style="display: none; width:100%; height: 100%;">
                                        <div class="columns">
                                            <homeTeamUsers></homeTeamUsers>
                                            <homeTeamChat></homeTeamChat>
                                        </div>
                                   </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            `,
            mounted() {
                hideAll();
                showNoActiveChats();
            },
            beforeCreate() {
                hooks.Register(navEvents.ChatsClicked, (e) => {
                    var alreadyViewing = document.getElementById("chatsNavButton").firstChild.classList.contains("is-active");
                    if(alreadyViewing == false) {
                        hideAll();
                        showNoActiveChats();
                    }
                });

                hooks.Register(navEvents.TeamClicked, (e) => {
                    hideAll();
                    showTeam();
                });

                hooks.Register(navEvents.OptionsClicked, (e) => {
                    hideAll();
                });

                hooks.Register(events.Chat.AcceptChat, (chatInfo) => {
                    hideAll();
                    showActiveChats();
                });

                hooks.Register(events.Chat.CloseChat, (chatNum) => {    
                    hideAll();
                    showNoActiveChats();
                });

                hooks.Register(events.Chat.MonitorChat, (chatInfo) => {
                    // todo: implement monitoring
                    alert('Monitoring not available');
                });

                hooks.Register(events.Home.StatusClosed, () => {
                    hideAll();
                    showNoActiveChats();
                 });

                hooks.Register(events.Home.StatusChanged, (status) => {
                   services.WhosOnConn.ChangeStatus(status);
                });

                
            }
    });

    function hideAll() {
        document.getElementById("Chats").style.display = "none";
        document.getElementById("Team").style.display = "none";
    };


    function showTeam() {
        document.getElementById("Chats").style.display = "none";
        document.getElementById("Team").style.display = "block";
    }

    function showNoActiveChats() {
        document.getElementById("Chats").style.display = "block";
        hooks.Call(events.Chat.ShowNoActiveChats);
    }

    function showActiveChats() {
        document.getElementById("Chats").style.display = "block";
        hooks.Call(events.Chat.ShowActiveChats);
    }

    function getDate(timeStamp)
    {
        var h = (timeStamp.getHours() < 10 ? '0' : '') + timeStamp.getHours();
        var m = (timeStamp.getMinutes() < 10 ? '0' : '') + timeStamp.getMinutes();
        var s = (timeStamp.getSeconds() < 10 ? '0' : '') + timeStamp.getSeconds();

        return h + ':' + m + ':' + s;
    }
})(woServices);