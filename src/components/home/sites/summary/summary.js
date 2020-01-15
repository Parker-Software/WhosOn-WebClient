(function(services){
    
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('siteSummary', {
        props: [
            "site",
            "chats",
            "monthlySummary"
        ],
        template: `
            <div>
                <visitorsToday 
                    :NewVisitors="Site.New" 
                    :NewVisitorsTotal="NewVisitorsTotal"
                    :TotalVisitors="Site.Total" 
                    :TotalVisitorsTotal="NewTotalVisitorsTotal" 
                    :PageViews="Site.PageViews" 
                    :PageViewsTotal="PageViewsTotal"
                    :Prospects="Site.Prospects"
                    :ProspectsTotal="ProspectsTotal">
                </visitorsToday>
                <chatsToday 
                    :site="site"
                    :chats="chats"
                    :ChatRequests="Site.ChatRequests" 
                    :ChatRequestsTotal="ChatRequestsTotal"
                    :MissedChats="Site.ChatsMissed"
                    :ChatsMissedTotal="ChatsMissedTotal"
                    :Sentiment="Site.AvgChatSentiment"></chatsToday>
                <month
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
        `,
        computed: {
            Site() {
                var site = this.$store.state.dailySummaries.find(x => x.SiteKey == this.site);
                return site;
            },
            CurrentDate() {
                return new Date();
            },
            Today() {
                return this.CurrentDate.getDay();
            },
            LastMonth() {
                var lastMonth = this.CurrentDate.getMonth();
                if(lastMonth == 0) lastMonth = 11;
                return lastMonth;
            },
            NewVisitorsTotal() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.CurrentDate.getMonth() != date.getMonth() && 
                        this.Today == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[3]);
                    }
                }
                return result + this.Site.New;
            },
            NewTotalVisitorsTotal() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.CurrentDate.getMonth() != date.getMonth() && 
                        this.Today == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[0]);
                    }
                }
                return result + this.Site.Total;
            },
            PageViewsTotal() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.CurrentDate.getMonth() != date.getMonth() && 
                        this.Today == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[11]);
                    }
                }
                return result + this.Site.PageViews;
            },
            ProspectsTotal() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.CurrentDate.getMonth() != date.getMonth() && 
                        this.Today == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[5]);
                    }
                }
                return result + this.Site.Prospects;
            },
            ChatRequestsTotal() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.CurrentDate.getMonth() != date.getMonth() && 
                        this.Today == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[8]);
                    }
                }
                return result + this.Site.ChatRequests;
            },
            ChatsMissedTotal() {
                var result = 0;
                for(var i = 0; i < this.monthlySummary.length; i++) {
                    var date = new Date(this.monthlySummary[i].Date);
                    if(
                        this.CurrentDate.getMonth() != date.getMonth() && 
                        this.Today == date.getDay()) {
                            var data = this.monthlySummary[i].Data.split("|");
                            result += Number(data[9]);
                    }
                }
                return result + this.Site.ChatsMissed;
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
                return result + this.Site.New;
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
                return result + this.Site.Total;
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
                return result + this.Site.Prospects;
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
                return result + this.Site.ChatRequests;
            }
        }
    });
})(woServices);