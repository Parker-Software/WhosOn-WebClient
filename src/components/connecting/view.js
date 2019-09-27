(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var socketEvents = events.Socket;
    var state = services.Store.state;

    Vue.component(state.connectingViewName, {
        template:
        `
            <div v-bind:id="this.$store.state.connectingViewName" class="loadingWindow">   
               <loader text="Attemping connection to WhosOn..." customStyles="left: calc(50% - 120px);"></loader>
            </div>
        `
    });
})(woServices);
