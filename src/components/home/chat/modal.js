(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    hooks.Register(events.ChatModal.CloseChatConfirmed, (chatNum) => {
        services.WhosOnConn.CloseChat(chatNum);               
        state.chats.forEach(function(chat){
            if (chat.TalkingTo == state.userName && chat.ChatUID != state.currentChat.ChatUID) {
                hooks.Call(events.ChatItem.AcceptClicked, {"Number": chat.Number, "ChatId": chat.ChatUID});
            }
        })

    });

    hooks.Register(events.ChatModal.StopMonitoringChatConfirmed, (chatNum) => {
        services.WhosOnConn.StopMonitoringChat(chatNum);   
    });

    Vue.component('chatModal', {
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
                <p v-if="Close" class="modal-card-title">Are you sure you wish to close this chat?</p>
                <p v-if="Close == false" class="modal-card-title">Are you sure you wish to stop monitoring this chat?</p>
                <button class="delete" aria-label="close" v-on:click="No"></button>
            </header>
            <section class="modal-card-body">          
            <div class="status-options">
                <a class="button is-success" v-on:click="Yes">Yes</a> 
                <a class="button is-danger" v-on:click="No">No</a>
            </div>
            </section>
            <footer class="modal-card-foot">
            </footer>
            </div>
        </div>
            `,
        computed: {
            CurrentChat() {
                return services.Store.state.currentChat;
            }
        },
        beforeCreate() { 
            hooks.Register(events.Chat.CloseChatClicked, () => {
                this.ModalElem().classList.add("is-active");
                this.Close = true;
            });

            hooks.Register(events.Chat.StopMonitoringChatClicked, () => {
                this.ModalElem().classList.add("is-active");
                this.Close = false;
            });
        },
        methods: {
            ModalElem() {
                return document.getElementById("chatModal");
            },
            Yes() {
                this.ModalElem().classList.remove("is-active");   
                if(this.Close) hooks.Call(events.ChatModal.CloseChatConfirmed, this.CurrentChat.Number);
                else hooks.Call(events.ChatModal.StopMonitoringChatConfirmed, this.CurrentChat.Number);
            },
            No() {
                this.ModalElem().classList.remove("is-active");
            }
        }
    });
})(woServices);