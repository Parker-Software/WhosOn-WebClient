(function(services){
    
    var hooks = services.Hooks;
    var events = services.HookEvents;

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    Vue.component("siteSummary", {
        props: [
            "selectedDate",
            "site",
            "chats",
            "dailySummary",
            "monthlySummary"
        ],
        template: `
            <div>
                <div v-if="DaySummaries != null">
                    <visitorsToday 
                        :selectedDate="selectedDate"
                        :NewVisitors="DaySummaries.New" 
                        :NewVisitorsTotal="NewVisitorsTotal"
                        :TotalVisitors="DaySummaries.Total" 
                        :TotalVisitorsTotal="NewTotalVisitorsTotal" 
                        :PageViews="DaySummaries.PageViews" 
                        :PageViewsTotal="PageViewsTotal"
                        :Prospects="DaySummaries.Prospects"
                        :ProspectsTotal="ProspectsTotal">
                    </visitorsToday>
                    <chatsToday 
                        :site="site"
                        :selectedDate="selectedDate"
                        :chats="chats"
                        :ChatRequests="DaySummaries.ChatRequests" 
                        :ChatRequestsTotal="ChatRequestsTotal"
                        :MissedChats="DaySummaries.ChatsMissed"
                        :ChatsMissedTotal="ChatsMissedTotal"
                        :Sentiment="DaySummaries.AvgChatSentiment"></chatsToday>
                    <month
                        :selectedDate="selectedDate"
                        :NewVisitors="MonthNewVisitors"
                        :NewVisitorsTotal="LastMonthsNewVisitors"
                        :TotalVisitors="MonthTotalVisitors"
                        :TotalVisitorsTotal="LastMonthsTotalVisitors"
                        :Prospects="MonthProspects"
                        :ProspectsTotal="LastMonthsTotalProspects"
                        :Chats="MonthChats"
                        :ChatsTotal="LastMonthsTotalChats"
                    ></month>
                </div>
                <div v-else>
                    <small>No Data Available</small>
                </div>
            </div>
        `,
        computed: {
            DaySummaries() {
                if(this.SameDay(this.CurrentDate, this.UnixToDate(this.selectedDate)))
                {
                    var site = this.dailySummary.find(x => x.SiteKey == this.site);
                    return site;
                } else {
                    var summary = null;

                    for(var i = this.monthlySummary.length - 1; i >= 0; i--) {
                        var monthlySummary = this.monthlySummary[i];
                        if(monthlySummary == undefined || monthlySummary == null) {
                            break;
                        }

                        var date = new Date(monthlySummary.Date);

                        if(this.SameDay(date, this.UnixToDate(this.selectedDate))) {
                            var data = monthlySummary.Data.split("|");
                            summary = {
                                New: Number(data[3]),
                                Total: Number(data[0]),
                                PageViews: Number(data[10]),
                                Prospects: Number(data[5]),
                                ChatRequests: Number(data[8]),
                                ChatsMissed: Number(data[9]),
                                AvgChatSentiment: Number(data[15]),
                            };
                            summary.ChatRequests = this.chats.length;
                            summary.ChatsMissed = this.chats.filter(x => x.Missed).length;

                            summary.AvgChatSentiment = 0;

                            for(var k = 0; k < this.chats.length; k++){
                                var chat = this.chats[k];
                                summary.AvgChatSentiment += Number(chat.SentimentScore);
                            }
                            summary.AvgChatSentiment = Math.round(summary.AvgChatSentiment / this.chats.filter(x => x.SentimentScore > 0).length);
                           
                        }
                    }
                    return summary;
                }
            },
            CurrentDate() {
                return new Date();
            },
            Day() {
                return this.UnixToDate(this.selectedDate).getDay();
            },
            LastMonth() {
                var month = this.CurrentDate.getMonth() - 1;
                if(month == -1) {month = 11;}
                return month;
            },
            NewVisitorsTotal() {
                var result = 0;
                var count = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(this.Day == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[3]);
                            count += 1;
                    }
                }
                return Math.round(result / count);
            },
            NewTotalVisitorsTotal() {
                var result = 0;
                var count = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(this.Day == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[0]);
                            count += 1;
                    }
                }
                
                return Math.round(result / count);
            },
            PageViewsTotal() {
                var result = 0;
                var count = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(this.Day == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[10]);
                            count += 1;
                    }
                }
                return Math.round(result / count);
            },
            ProspectsTotal() {
                var result = 0;
                var count = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(this.Day == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[5]);
                            count += 1;
                    }
                }

                return Math.round(result / count);
            },
            ChatRequestsTotal() {
                var result = 0;
                var count = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(this.Day == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[8]);
                            count += 1;
                    }
                }
                return Math.round(result / count);
            },
            ChatsMissedTotal() {
                var result = 0;
                var count = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(this.Day == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[9]);
                            count += 1;
                    }
                }
                return Math.round(result / count);
            },
            LastMonthsNewVisitors() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.LastMonth == date.getMonth() &&
                        date.getDate() <= this.CurrentDate.getDate()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[3]);
                    }
                }
                return result;
            },
            LastMonthsTotalVisitors() {
                var result = 0;

                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.LastMonth == date.getMonth() &&
                        date.getDate() <= this.CurrentDate.getDate()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[0]);
                    }
                }
                return result;
            },
            LastMonthsTotalProspects() {
                var result = 0;

                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.LastMonth == date.getMonth() &&
                        date.getDate() <= this.CurrentDate.getDate()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[5]);
                    }
                }
                return result;
            },
            LastMonthsTotalChats() {
                var result = 0;

                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.LastMonth == date.getMonth() &&
                        date.getDate() <= this.CurrentDate.getDate()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[8]);
                    }
                }
                return result;
            },
            MonthNewVisitors() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);

                    if(this.CurrentDate.getMonth() == date.getMonth()) {
                        var data = this.monthlySummary[i].Data.split("|");
                        result += Number(data[3]);
                    }
                }
                
                if(this.SameDay(this.CurrentDate, this.UnixToDate(this.selectedDate)) 
                    &&  this.DaySummaries != null) 
                {   
                     result += this.DaySummaries.New;
                }
                return result;
            },
            MonthTotalVisitors() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);

                    if(this.CurrentDate.getMonth() == date.getMonth()) {
                        var data = this.monthlySummary[i].Data.split("|");
                        result += Number(data[0]);
                    }
                }
                
                if(this.SameDay(this.CurrentDate, this.UnixToDate(this.selectedDate)) 
                    &&  this.DaySummaries != null) 
                {   
                    result += this.DaySummaries.Total;
                }
                return result;
            },
            MonthProspects() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);

                    if(this.CurrentDate.getMonth() == date.getMonth()) {
                        var data = this.monthlySummary[i].Data.split("|");
                        result += Number(data[5]);
                    }
                }
                
                if(this.SameDay(this.CurrentDate, this.UnixToDate(this.selectedDate)) 
                    &&  this.DaySummaries != null) 
                {   
                     result += this.DaySummaries.Prospects;
                }
                return result;
            },
            MonthChats() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);

                    if(this.CurrentDate.getMonth() == date.getMonth()) {
                        var data = this.monthlySummary[i].Data.split("|");
                        result += Number(data[8]);
                    }
                }
                
                if(this.SameDay(this.CurrentDate, this.UnixToDate(this.selectedDate)) 
                    &&  this.DaySummaries != null) 
                {   
                    result += this.DaySummaries.ChatRequests;
                }
                return result;
            }
        },
        methods: {
            UnixToDate(UNIX_timestamp) {
                return new Date(UNIX_timestamp * 1000);
            },
            SameDay(date1, date2) {
                return  date1.getFullYear() == date2.getFullYear() &&
                        date1.getMonth() == date2.getMonth() &&
                        date1.getDate() == date2.getDate();
            }
        }
    });
})(woServices);