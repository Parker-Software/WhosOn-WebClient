(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;
    var state = services.Store.state;

    var myStatusId = "homeMyStatus";
    var myStatusNavId = "myStatusNavButton";

    var activeChatsId = "homeActiveChats";
    var activeChatsNavId = "chatsNavButton";

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

            beforeCreate() {
                hooks.Register(navEvents.MyStatus, (e) => {
                    hideAll();
                    document.getElementById(myStatusId).style.display = "block";
                    document.getElementById(myStatusNavId).firstChild.classList.add("is-active");
                });

                hooks.Register(navEvents.Chats, (e) => {
                    hideAll();
                    document.getElementById(activeChatsId).style.display = "block";
                    document.getElementById(activeChatsNavId).firstChild.classList.add("is-active");
                });

                hooks.Register(navEvents.Users, (e) => {
                    console.log("Users Clicked");
                });

                hooks.Register(navEvents.Options, (e) => {
                    console.log("Options Clicked");
                });

                hooks.Register(events.Chat.AcceptChat, (chatNum) => {
                    var chats = state.chats;
                    var localChatMessage = {};
                    Object.keys(state.chatMessages).forEach((key) => {
                        var chatMessage = state.chatMessages[key];
                        if(key == chatNum) {
                            localChatMessage = chatMessage;
                        }
                    });
                    
                    Object.keys(chats).forEach((key) => {
                        var chat = chats[key];
                        if(chat.Number == chatNum) {
                            chat.IsActiveChat = true;
                            state.currentChat = chat;
                            services.WhosOnConn.AcceptChat(chatNum);
                        } else {
                            chat.IsActiveChat = false;
                        }
                    });

                    hooks.Call(event.Chat.ChatClicked, {chatNum, localChatMessage});
                });

                function hideAll() {
                    document.getElementById(myStatusId).style.display = "none";
                    document.getElementById(myStatusNavId).firstChild.classList.remove("is-active");

                    document.getElementById(activeChatsId).style.display = "none";
                    document.getElementById(activeChatsNavId).firstChild.classList.remove("is-active");
                };
            }
    });
})(woServices);