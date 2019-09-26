(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('crmWindow', {
        template: `
        <div id="crmWindow" style="display: none; width:100%; height:calc(100% - 174px); position:relative;">
            <loader id="crmLoader" text='Loading CRM Form...' customStyles='color:black; left: calc(50% - 62px); top: calc(50% - 52px);'></loader>
            <iframe id="crmFormIFrame" style="width:100%; height:100%;" v-bind:src="this.$store.state.crmURL">
            
            </iframe>
        </div>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.TabClicked, (tab) => {
                if(tab != "crm") this.Element().style.display = "none";
                else this.Element().style.display = "block";
            });

            hooks.Register(events.Chat.CRMIFrameChangedSrc, (src) => {
                this.Form().style.pointerEvents = "none";
                this.Loader().style.display = "block";
                this.Form().style.opacity = 0.5;
            });

            hooks.Register(events.Chat.CRMIFrameLoaded, (src) => {
                this.Loader().style.display = "none";
                this.Form().style.opacity = 1;
                this.Form().style.pointerEvents = "all";
            });
        },
        mounted() {
            this.Form().onload = () => {
                hooks.Call(events.Chat.CRMIFrameLoaded, this.Form().src);
            };
        },
        methods: {
            Element() {
                return document.getElementById("crmWindow");
            },
            Form() {
                return document.getElementById("crmFormIFrame");
            },
            Loader() {
                return document.getElementById("crmLoader");
            }
        }
    });
})(woServices);