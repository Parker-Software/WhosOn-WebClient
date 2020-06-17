(function(services){

    var state = services.Store.state;

    Vue.component("missed-chat", {
        props: [
            "chat",
            "selected"
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
                            <b>{{chat.Site}}</b>
                        </div>
                        <div>
                            <b><span class="dept">{{chat.Email}}</span></b>
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