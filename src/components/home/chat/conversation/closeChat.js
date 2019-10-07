(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('homeCloseChat', {
        template: `
        <div id="closeChatModal" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Are you sure you wish to close this chat?</p>
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
        beforeCreate() { 
            hooks.Register(events.Chat.CloseChatClicked, () => {
                this.ModalElem().classList.add("is-active");
            });
        },
        methods: {
            ModalElem() {
                return document.getElementById("closeChatModal");
            },
            Yes() {
                this.ModalElem().classList.remove("is-active");   
                hooks.Call(events.Chat.CloseChat, services.Store.state.currentChat.Number);
            },
            No() {
                this.ModalElem().classList.remove("is-active");
            }
        }
    });
})(woServices);