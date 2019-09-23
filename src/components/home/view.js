(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var state = services.Store.state;

    var myStatusId = "statusModal";
    var myStatusNavId = "myStatusNavButton";

    var activeChatsId = "homeActiveChats";
    var activeChatsNavId = "chatsNavButton";

    var chatAreaId = "homeChatArea";
    var noChatsId = "homeNoChatsArea";

    Vue.component(services.Store.state.homeViewName, {
        template: `
            <section v-bind:id="this.$store.state.homeViewName">
                <homeheader></homeheader>
                <div class="columns" id="app-content">
                    <homenav></homenav>
                    <div class="column is-11" id="page-content">
                        <div class="content-body">
                            <div class="columns" style="height: 100%">
                                <homeActiveChats></homeActiveChats>
                                <homeMyStatus></homeMyStatus>
                                <homeChatArea></homeChatArea>
                                <homeNoChatsArea></homeNoChatsArea>
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
                hooks.Register(navEvents.MyStatus, (e) => {
                    showStatus();
                });

                hooks.Register(navEvents.Chats, (e) => {

                    var alreadyViewing = document.getElementById(activeChatsNavId).firstChild.classList.contains("is-active");
                    if(alreadyViewing == false) {
                        hideAll();
                        showNoActiveChats();
                    }
                });

                hooks.Register(navEvents.Users, (e) => {
                    console.log("Users Clicked");
                });

                hooks.Register(navEvents.Options, (e) => {
                    console.log("Options Clicked");
                });

                hooks.Register(events.Chat.AcceptChat, (chatNum) => {
                    var chats = state.chats;
                    Object.keys(chats).forEach((key) => {
                        var chat = chats[key];
                        if(chat.Number == chatNum) {
                            chat.IsActiveChat = true;
                            state.currentChat = chat;

                            if(state.chatMessages[chat.Number] != null) {
                                state.currentChatMessages = JSON.parse(JSON.stringify(state.chatMessages[chat.Number]));
                            }

                            services.WhosOnConn.AcceptChat(chatNum);
                        } else {
                            chat.IsActiveChat = false;
                        }
                    });
                    showActiveChats();
                });

                hooks.Register(events.Home.StatusClosed, () => {
                    document.getElementById(myStatusId).classList.remove("is-active");
                });

                hooks.Register(events.Home.StatusChanged, (status) => {
                   services.WhosOnConn.ChangeStatus(status);
                });

                hooks.Register(events.Chat.SendMessage, (message) => {
                    var chatObject = {
                        "code" : 1,
                        "date" : "12345",
                        "msg" : message.Text
                    }

                    if(services.Store.state.chatMessages[message.Num] == null) services.Store.state.chatMessages[message.Num] = [];

                    services.Store.state.chatMessages[message.Num].push(chatObject);
                    services.Store.state.currentChatMessages.push(chatObject)
                    services.WhosOnConn.SendMessage(message.Num, message.Text);
                });
            }
    });

    function hideAll() {
        document.getElementById(myStatusNavId).classList.remove("is-active");
        document.getElementById(myStatusId).classList.remove("is-active");

        document.getElementById(activeChatsId).style.display = "none";
        document.getElementById(activeChatsNavId).firstChild.classList.remove("is-active");

        document.getElementById(chatAreaId).style.display = "none";
        document.getElementById(noChatsId).style.display = "none";
    };

    function unSelectAll() {
        document.getElementById(myStatusNavId).firstChild.classList.remove("is-active");
        document.getElementById(activeChatsNavId).firstChild.classList.remove("is-active");
    }

    function showStatus() {
        document.getElementById(myStatusId).classList.add("is-active");
    }

    function showNoActiveChats() {
        document.getElementById(activeChatsId).style.display = "block";
        document.getElementById(activeChatsNavId).firstChild.classList.add("is-active");
        document.getElementById(chatAreaId).style.display = "none";
        document.getElementById(noChatsId).style.display = "block";
    }

    function showActiveChats() {
        document.getElementById(activeChatsId).style.display = "block";
        document.getElementById(activeChatsNavId).firstChild.classList.add("is-active");
        document.getElementById(noChatsId).style.display = "none";
        document.getElementById(chatAreaId).style.display = "block";
    }
})(woServices);