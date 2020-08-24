(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    hooks.Register(events.ChatModal.CloseChatConfirmed, (chatNum) => {
        services.WhosOnConn.CloseChat(chatNum);
        state.currentChat = {};

        setTimeout(function() {
            state.chats.forEach(function(chat){
                if (chat.Number != chatNum && chat.TalkingToClientConnection == state.currentConnectionId) {
                    hooks.Call(events.ChatItem.AcceptClicked, {"Number": chat.Number, "ChatId": chat.ChatUID});
                }
            });
        }, 200);
    });

    hooks.Register(events.ChatModal.StopMonitoringChatConfirmed, (chatNum) => {
        services.WhosOnConn.StopMonitoringChat(chatNum);   
    });

    Vue.component("chatModal", {
        data: () => {
            return {
                Close: false
            }
        },
        template: `
        <div id="chatModal" class="modal">
            <div class="modal-background" v-on:click="No"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Close Chat</p>     
                    <button class="delete" aria-label="close" v-on:click="No"></button>
                </header>
                <section class="modal-card-body">
                    <p>
                        <span class="fa-stack fa-lg">
                        <i class="fas fa-circle fa-stack-2x"></i>
                        <i class="fas fa-question fa-stack-1x" style="color:white"></i>
                        </span> 
                        <span>Are you sure you want to close with {{getVisitorName}}?</span>
                    </p>
                </section>
                <footer class="modal-card-foot">
                    <a class="button" v-on:click="Yes">Yes</a> 
                    <a class="button" v-on:click="No">No</a>
                </footer>
            </div>
        </div>
            `,
        computed: {
            CurrentChat() {
                return services.Store.state.currentChat;
            },
            getVisitorName() {
               var visitorName = state.currentChat.Name;
               if(visitorName == null) {return;}
               return visitorName;
            }
        },
        beforeCreate() { 
            hooks.Register(events.Chat.CloseChatClicked, () => {
                this.ModalElem().classList.add("is-active");
                this.Close = true;
            });

            // hooks.Register(events.Chat.StopMonitoringChatClicked, () => {
            //     this.ModalElem().classList.add("is-active");
            //     this.Close = false;
            // });
        },
        methods: {
      
            ModalElem() {
                return document.getElementById("chatModal");
            },
            Yes() {
                this.ModalElem().classList.remove("is-active");   
                if(this.Close) {hooks.Call(events.ChatModal.CloseChatConfirmed, this.CurrentChat.Number);}
                else {hooks.Call(events.ChatModal.StopMonitoringChatConfirmed, this.CurrentChat.Number);}
            },
            No() {
                this.ModalElem().classList.remove("is-active");
            }
        }
    });
})(woServices);