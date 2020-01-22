(function(services){
    
    var connection = services.WhosOnConn;
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('sitesArea', {
        data: () => {
            return {
                site: {},
                selectedDate: Math.floor(Date.now() / 1000),
                chats: [],
                monthlySummary: [],
                dailySummary: [],
                selectedTab: ''
            }
        },
        template: `
            <div class="chat-area sites-area">
                <div v-if="Object.keys(site).length > 0">
                    <div class="sites-area-header">
                        <div>
                            <div style="height: 45px">
                                <div class="sites-area-header-titles is-pulled-left">
                                    <b>{{site.Name}}</b> 
                                    <br />
                                    <small>{{site.Domain}}</small>
                                </div>
                                <div class="chat-header-icons is-pulled-right">
                                    <button id="moveBackBtn" class="has-tooltip-left" data-tooltip="View Previous Day" v-on:click="MoveBack">
                                        <span class="fa-stack fa-2x">
                                            <i class="fas fa-circle fa-stack-2x"></i>
                                            <i class="fas fa-arrow-left fa-stack-1x fa-inverse white"></i>
                                        </span>
                                    </button>
                                    <button id="moveRightBtn" class="has-tooltip-left" data-tooltip="View Next Day" v-bind:disabled="IsToday(selectedDate)" v-on:click="MoveForward">
                                        <span class="fa-stack fa-2x">
                                            <i class="fas fa-circle fa-stack-2x"></i>
                                            <i class="fas fa-arrow-right fa-stack-1x fa-inverse white"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <p> 
                                <small v-if="IsToday(selectedDate)">Today</small>
                                <small v-if="IsYesterday(selectedDate)">Yesterday</small>
                                <small v-if="IsToday(selectedDate) == false && IsYesterday(selectedDate) == false">
                                    {{
                                        UnixToDate(selectedDate).toDateString()
                                    }}
                                </small>
                            </p>
                        </div>
                        <div class="tabs options-tabs">
                            <ul>
                                <li v-if="CanSeeSummary" v-on:click="TabClicked('summary')" class="summary" v-bind:class="{'is-active': SelectedTab() == 'summary'}">Summary</li>
                                <!--<li>Active Visitors</li>
                                <li>Previous Visits</li>-->
                                <li v-on:click="TabClicked('previous')" class="previous" v-bind:class="{'is-active': SelectedTab() == 'previous'}">Previous Chats <i v-if="chats.filter(x => x.Missed).length > 0" class="fas fa-exclamation-circle"></i></li>
                                <!--<li>Search Chats</li>
                                <li>Reports</li>-->
                            </ul>
                        </div>
                    </div>
                    <div class="sites-area-content">
                        <siteSummary 
                            class="siteSummary" 
                            v-if="CanSeeSummary && SelectedTab() == 'summary'"
                            :selectedDate="selectedDate"
                            :site="site.SiteKey"
                            :chats="chats" 
                            :dailySummary="dailySummary" 
                            :monthlySummary="monthlySummary"
                        ></siteSummary>
                        <previousChats 
                            :site="site.SiteKey" 
                            :chats="chats" 
                            v-bind:class="{'is-hidden':SelectedTab() != 'previous'}"
                        ></previousChats>
                    </div>
                </div>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Sites.Clicked, (site) => {
                if(site == this.site.SiteKey) return;
                this.site = this.$store.state.sites[site];

                var date = this.UnixToDate(this.selectedDate);
                connection.GetPreviousChats(site, `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);

                if(this.$store.state.rights.ViewDailySummary) connection.GetMonthlySummary(site);
            });

            hooks.Register(events.Connection.DailySummary, (e) => {
                this.dailySummary = e.Data.DaySummary;
            });

            hooks.Register(events.Connection.MonthSummary, (summary) => {
                this.monthlySummary = summary.Data.Days;
            });

            hooks.Register(events.Connection.PreviousChats, (chats) => {
                this.chats = chats.Data;
            });
        },
        computed: {
            Today() {
                return new Date();
            },
            CanSeeSummary() {
                return this.$store.state.rights.ViewDailySummary;
            }
        },
        methods: {
            SelectedTab() {
                if(this.selectedTab == '') {
                    if(this.Tabs().length > 0) {
                        var tab = this.Tabs()[0].className;
                        this.selectedTab = tab;
                        return tab;
                    }
                } else {
                    return this.selectedTab;
                }
            },
            Tabs() {
                return document.querySelectorAll(".sites-area .tabs li");
            },
            TabClicked(tab) {
                this.selectedTab = tab;
            },
            SameDay(date1, date2) {
                return  date1.getFullYear() == date2.getFullYear() &&
                        date1.getMonth() == date2.getMonth() &&
                        date1.getDate() == date2.getDate();
            },
            IsToday(unix) {
                var date = this.UnixToDate(unix);
                return this.SameDay(date, this.Today);
            },
            IsYesterday(unix) {
                var date = this.UnixToDate(unix);
                return  date.getFullYear() == this.Today.getFullYear() &&
                        date.getMonth() == this.Today.getMonth() &&
                        date.getDate() == this.Today.getDate() - 1;
            },
            MoveBack() {
                var date = this.UnixToDate(this.selectedDate);
                date.setDate(date.getDate() - 1);
                this.selectedDate = Math.floor(date.getTime() / 1000);

                connection.GetPreviousChats(this.site.SiteKey, `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
            },
            MoveForward() {
                var date = this.UnixToDate(this.selectedDate);
                date.setDate(date.getDate() + 1);
                this.selectedDate = Math.floor(date.getTime() / 1000);


                connection.GetPreviousChats(this.site.SiteKey, `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
            },
            UnixToDate(UNIX_timestamp) {
                return new Date(UNIX_timestamp * 1000);
            }
        }
    });
})(woServices);