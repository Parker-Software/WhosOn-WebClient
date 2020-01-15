(function(services){
    
    Vue.component('month', {
        props: [
            "NewVisitors",
            "NewVisitorsTotal",
            "TotalVisitors",
            "TotalVisitorsTotal",
            "Prospects",
            "ProspectsTotal",
            "Chats",
            "ChatsTotal"
        ],
        template: `
            <div>
                <div class="sites-area-content-title">
                    <b>This Month</b>
                </div>
                <doughnut 
                    title="New Visitors"
                    :subtitle="AverageDate(NewVisitorsTotal)"
                    :value="NewVisitors"
                    :max="NewVisitorsTotal"
                ></doughnut>
                <doughnut 
                    title="Total Visitors"
                    :subtitle="AverageDate(TotalVisitorsTotal)"
                    :value="TotalVisitors"
                    :max="TotalVisitorsTotal"
                ></doughnut>
                <doughnut 
                    title="Prospects"
                    :subtitle="AverageDate(ProspectsTotal)"
                    :value="Prospects"
                    :max="ProspectsTotal"
                ></doughnut>
                <doughnut 
                    title="Chats"
                    :subtitle="AverageDate(ChatsTotal)"
                    :value="Chats"
                    :max="ChatsTotal"
                ></doughnut>
            </div>
        `,
        computed: {
            CurrentDate() {
                return new Date();
            }
        },
        methods: {
            AverageDate(total) {
                return `Avg To Date ${total}`;
            }
        }
    });
})(woServices);