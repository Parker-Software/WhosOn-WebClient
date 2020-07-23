(function(services){

    var state = services.Store.state;

    Vue.component("missed-chat", {
        props: [
            "chat",
            "selected",
            "callbackNow"
        ],
        template: `
            <div class="chatCard missed" v-bind:class="{selected: selected}" v-on:click="Clicked">
                <div class="card-status"></div>
                <div class="card-info">
                    <div style="height: 22px;">
                        <b class="visitorName">{{chat.VisitorName}}</b>
                        <span class="timeBetween">{{Time}}</span> 
                    </div>
                    <div class="location">
                        {{chat.Location}}
                    </div>
                    <div>
                        <div>
                            <b>{{Site}}</b>
                        </div>
                        <div v-if="chat.MissedWantsCallback == false">
                            <b><span class="dept">{{chat.Email}}</span></b>
                        </div>
                        <div v-if="chat.MissedWantsCallback">
                            <div style="float:left;">
                                <b><span class="dept">{{chat.Phone}}</span></b>
                            </div>
                            <div style="float:right;">
                                <i class="fas fa-phone"></i>
                            </div>
                        </div>
                    </div>
                    <div v-if="chat.Message" class="summary">
                        {{chat.Message}}
                    </div>
                    <div v-if="chat.MissedResponseStarted" class="responding">
                        {{RespondingUser}} Is Responding
                    </div>
                </div>
            </div>
        `,
        computed: {
            Site() {
                return state.sites[this.chat.SiteKey].Name;
            },

            RespondingUser() {
                return state.users.find(x => x.Username == this.chat.MissedResponseStartedBy).Name;
            },

            Time() {
                let time = new Date(this.chat.Started);
                return `${this.AddZero(time.getHours())}:${this.AddZero(time.getMinutes())}`;
            },
        },
        methods: {
            Clicked() {
                this.$emit("Clicked", this.chat);
            },
            
            AddZero(string) {
                if(Number(string) < 10) {string = String("0"+string);}
                return string;
            }
        }
    });
})(woServices);