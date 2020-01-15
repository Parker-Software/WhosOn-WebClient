(function(services){

    Vue.component('visitorsToday', {
        props: [
            "NewVisitors",
            "NewVisitorsTotal",
            "TotalVisitors",
            "TotalVisitorsTotal",
            "PageViews",
            "PageViewsTotal",
            "Prospects",
            "ProspectsTotal"
        ],
        template: `
            <div>
                <div class="sites-area-content-title">
                    <b>Visitors Today</b>
                </div>
                <doughnut 
                    title="New Visitors"
                    :subtitle="AverageDay(NewVisitorsTotal)"
                    :value="NewVisitors"
                    :max="NewVisitorsTotal"
                ></doughnut>
                <doughnut 
                    title="Total Visitors"
                    :subtitle="AverageDay(TotalVisitorsTotal)"
                    :value="TotalVisitors"
                    :max="TotalVisitorsTotal"
                ></doughnut>
                <doughnut 
                    title="Page Views"
                    :subtitle="AverageDay(PageViewsTotal)"
                    :value="PageViews"
                    :max="PageViewsTotal"
                ></doughnut>
                <doughnut 
                    title="Prospects"
                    :subtitle="AverageDay(ProspectsTotal)"
                    :value="Prospects"
                    :max="ProspectsTotal"
                ></doughnut>
            </div>
        `,
        computed: {
            CurrentDate() {
                return new Date();
            }
        },
        methods: {
            AverageDay(total) {
                var day;
                switch(this.CurrentDate.getDay()) {
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
            }
        }
    });
})(woServices);