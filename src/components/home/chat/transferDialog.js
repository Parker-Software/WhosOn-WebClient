(function (services) {

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;
    var state = services.Store.state;

    Vue.component('transferDialog', {
        props: ['user','visitorName'],  
        template: `
        <div id="transferDialog" class="modal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Transfer Chat</p>
              <button class="delete" aria-label="close" v-on:click="close"></button>
            </header>
            <section class="modal-card-body">
              <p>
              <span class="fa-stack fa-lg">
              <i class="fas fa-circle fa-stack-2x"></i>
              <i class="fas fa-question fa-stack-1x" style="color:white"></i>
              </span> 
            <span>Transfer the chat with {{getVisitorName}} to {{getUser}}?</span></p>
            </section>
            <footer class="modal-card-foot">
              <button class="button" v-on:click="Transfer" >Yes</button>
              <button class="button" v-on:click="close">No</button>
            </footer>
          </div>
        </div>
        `,            
        computed: {
        getUser() {
           if(this.user === null) return;
           return this.user.Username;
        },
        getVisitorName() {
            if(this.visitorName === null) return;
           return this.visitorName;
        }
        },
        methods: {
            ModalElem() {
                return document.getElementById("transferDialog");
            },
            close() {
                this.ModalElem().classList.remove("is-active");
            },
            Transfer(){
                this.$emit("Transfer");
                this.close();
            }
        }
    });
})(woServices);