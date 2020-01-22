(function(services){
    
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('chatCard', {
        props: [
            "chat",
            "selected"
        ],
        template: `
            <div class="chatCard" v-bind:class="{missed: chat.Missed, selected: selected}" v-on:click="Clicked">
                <div class="card-status"></div>
                <div class="card-info">
                    <div style="height: 22px;">
                        <b class="visitorName">{{chat.VisitorName}}</b>
                        <span class="timeBetween">{{Time}}</span>
                    </div>
                    <div class="location">
                        {{chat.Location}}
                    </div>
                    <div v-if="chat.Missed == false">
                        <div>
                            <b>{{chat.TakenByUsers}}</b>
                        </div>
                        <div>
                            <span class="dept">{{chat.TakenByDept}}</span>
                        </div>
                        <div style="min-height: 25px">
                            <div v-if="chat.Rating > 0" class="ratings">
                                <i v-for="star in chat.Rating" class="fas fa-star"></i>
                            </div>
                            <div v-if="chat.SentimentScore > 0" class="sentiment">
                                <i v-if="chat.SentimentScore >= (100 * 0.75)" class="far fa-smile"></i>
                                <i v-if="chat.SentimentScore < (100 * 0.75) && chat.SentimentScore > (100 * 0.25)" class="far fa-meh"></i>
                                <i v-if="chat.SentimentScore <= (100 * 0.25)" class="far fa-frown"></i>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <b>Not Responded</b>
                    </div>
                    <div v-if="chat.Summary" class="summary">
                        {{chat.Summary}}
                    </div>
                </div>
            </div>
        `,
        computed: {
            Time() {
                var start = new Date(this.chat.StartTime);
                var finish = new Date(this.chat.FinishTime);
                if(start.getHours() == finish.getHours() && start.getMinutes() == finish.getMinutes()) {
                    return `${this.AddZero(finish.getHours())}:${this.AddZero(finish.getMinutes())}`;
                }

                return `${this.AddZero(start.getHours())}:${this.AddZero(start.getMinutes())} - ${this.AddZero(finish.getHours())}:${this.AddZero(finish.getMinutes())}`;
            },
        },
        methods: {
            Clicked() {
                this.$emit('Clicked', this.chat);
            },
            AddZero(string) {
                if(Number(string) < 10) string = String("0"+string);
                return string;
            }
        }
    });
})(woServices);