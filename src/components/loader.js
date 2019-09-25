
(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var state = services.Store.state;

    Vue.component("loader", {
        template:
        `
            <div class="customLoader">
                <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
                <br />
                <br />
               <span>Connecting To WhosOn...</span>
               <br />
            </div>
        `,
        computed: {
            address: function(){
                var address = this.$store.state.connectionAddress;
                address = address.replace("ws://", "");

                var portIdx = address.indexOf(":");
                address = address.substring(0, portIdx);

                return address;
            }
        }
    });
})(woServices);
