(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;
    
    Vue.component('chatsToday', {
        props: [
            "site",
            "selectedDate",
            "chats",
            "ChatRequests",
            "ChatRequestsTotal",
            "MissedChats",
            "ChatsMissedTotal",
            "Sentiment"
        ],
        data: () => {
            return {
                answeredOnTime: 0,
                answeredOnTimeTotal: 0,
                averageRating: 0,
            };
        },
        template: `
            <div>
                <div class="sites-area-content-title">
                    <b>Chats Today</b>
                </div>
                <doughnut 
                    title="Chat Requests"
                    :subtitle="AverageDay(ChatRequestsTotal)"
                    :value="ChatRequests"
                    :max="ChatRequestsTotal"
                ></doughnut>
                <doughnut 
                    title="Missed Chats"
                    :subtitle="AverageDay(ChatsMissedTotal)"
                    :value="MissedChats"
                    :max="ChatsMissedTotal"
                ></doughnut>
                <doughnut 
                    title="Answered On Time"
                    :subtitle="AverageWait(AnsweredOnTimeTotal)"
                    :value="AnsweredOnTime"
                    :max="ChatRequests"
                ></doughnut>
                <doughnut 
                    title="Sentiment & Rating"
                    :subtitle="Stars(AverageRating)"
                    :value="Sentiment"
                    :happiness="true"
                ></doughnut>
            </div>
        `,
        computed: {
            Site() {
                return this.$store.state.sites[this.site];
            },
            AnsweredOnTime() {
                var result = 0;
                if(this.chats == null) return result;
                for(var i = 0; i < this.chats.length; i++) {
                    var chat = this.chats[i];
                    if(chat.Missed == false && chat.WaitedForSecs <= this.Site.SLAWarnSeconds2) {
                        result += 1;
                    }
                }
                return result;
            },
            AnsweredOnTimeTotal() {
                var result = 0;
                if(this.chats == null) return result;
                for(var i = 0; i < this.chats.length; i++) {
                    var chat = this.chats[i];
                    result += chat.WaitedForSecs;
                }
                return Math.round(result / this.chats.length);
            },
            AverageRating() {
                var result = 0;
                var totalRated = 0;
                if(this.chats == null) return result;

                for(var i = 0; i < this.chats.length; i++) {
                    var chat = this.chats[i];
                    if(chat.Rating > 0) {
                        totalRated += 1;
                        result += chat.Rating;
                    }
                }

                result = Math.floor(result / totalRated).toFixed(0);
                return isNaN(result) ? 0 : result;
            },
        },
        methods: {
            UnixToDate(UNIX_timestamp) {
                return new Date(UNIX_timestamp * 1000);
            },
            AverageDay(total) {
                var day;
                switch(this.UnixToDate(this.selectedDate).getDay()) {
                    case 0:
                        day = "Sun";
                        break;
                    case 1:
                        day = "Mon";
                        break;
                    case 2:
                        day = "Tues";
                        break;
                    case 3:
                        day = "Wed";
                        break;
                    case 4:
                        day = "Thu";
                        break;
                    case 5:
                        day = "Fri";
                        break;
                    case 6:
                        day = "Sat";
                        break;
                }
                
                return `Avg For ${day} ${total}`;
            },
            AverageWait(seconds) {
                var result = "00:00";
                if(seconds > 0)
                {
                    var minutes = seconds / 60;
                    if(minutes >= 1) {
                        var secs = seconds % 60;
                        result =  `${this.AddZero(Math.floor(minutes).toFixed(0))}:${this.AddZero(secs).toFixed(0)}`;
                    } else {
                        result = `00:${this.AddZero(Math.floor(seconds.toFixed(0)))}`;
                    }
                }
               
                return `Avg Wait ${result}`;
            },
            AddZero(string) {
                if(Number(string) < 10) string = String("0"+string);
                return string;
            },
            Stars(count) {
                var stars = "";
                if(count > 0) {
                    for(var i = 0; i < count; i++){
                        stars += `<i v-for="star in chat.Rating" class="fas fa-star"></i>`;
                    }
                }
                return stars;;
            }
        }
    });
})(woServices);