(function(services){
    
    var connection = services.WhosOnConn;
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('sitesArea', {
        data: () => {
            return {
                site: {},
                chats: [],
                monthlySummary: [],
                selectedTab: "summary"
            }
        },
        template: `
            <div class="chat-area sites-area">
                <div v-if="Object.keys(site).length > 0">
                    <div class="sites-area-header">
                        <div>
                            <div class="sites-area-header-titles">
                                <b>{{site.Name}}</b> 
                                <br />
                                <small>{{site.Domain}}</small>
                            </div>
                            <p><small>Today</small></p>
                        </div>
                        <div class="tabs options-tabs">
                            <ul>
                                <li v-on:click="TabClicked('summary')" class="is-active summary">Summary</li>
                                <!--<li>Active Visitors</li>
                                <li>Previous Visits</li>-->
                                <li v-on:click="TabClicked('previous')" class="previous">Previous Chats</li>
                                <!--<li>Search Chats</li>
                                <li>Reports</li>-->
                            </ul>
                        </div>
                    </div>
                    <div class="sites-area-content">
                        <siteSummary class="siteSummary" v-if="selectedTab == 'summary'" :site="site.SiteKey" :chats="chats" :monthlySummary="monthlySummary"></siteSummary>
                        <previousChats :site="site.SiteKey" :chats="chats" v-bind:class="{'is-hidden':selectedTab != 'previous'}"></previousChats>
                    </div>
                </div>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Sites.Clicked, (site) => {
                if(site == this.site.SiteKey) return;

                this.site = this.$store.state.sites[site];
                connection.GetMonthlySummary(site);
                
                var date = new Date();
                connection.GetPreviousChats(site, `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
            });

            hooks.Register(events.Connection.MonthSummary, (summary) => {
                this.monthlySummary = summary.Data.Days;
            });

            hooks.Register(events.Connection.PreviousChats, (chats) => {
                this.chats = chats.Data;
            });
        },
        methods: {
            AllTabs() {
                return document.querySelectorAll(".sites-area .options-tabs li");
            },
            GetTabByClass(tabClass) {
                return document.querySelector(`.sites-area .options-tabs .${tabClass}`);
            },
            UnselectAll() {
                this.AllTabs().forEach(x => x.classList.remove("is-active"));
            },
            TabClicked(tab) {
                this.UnselectAll();
                this.GetTabByClass(tab).classList.add('is-active');
                this.selectedTab = tab;
            }
        }
    });
})(woServices);