(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("sites", {
        data: () => {
            return {
                allSites: [],
                sites: []
            }
        },
        template: `
            <div class="active-chats" id="sites">  
                <div class="active-sites-wrapper">
                    <div class="content-header" style="padding: 5px;">
                        <h5 class="title is-6-half">Monitored Sites: {{Object.keys($store.state.sites).length}}</h5>
                        <form autocomplete="off" onsubmit="event.preventDefault();">
                            <div class="field">
                                <p class="control has-icons-right">
                                    <input id="sitesSearchTxtBox" type="text" class="input searchBox" placeholder="Search Sites" v-on:keyup.enter="Search">
                                    <span class="icon is-small is-right" style="height: 2em;">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </p>
                            </div>
                        </form>
                    </div>
                    <div>   
                        <ul v-if="sites.length > 0">
                            <site v-for="site of sites" :site="site" v-bind:key="site.SiteKey">
                            </site>
                        </ul>  
                        <small class="noSites" v-if="sites.length <= 0"> No Sites </small>
                    </div>
                </div>
            </div>
        `,
        beforeCreate() {
            hooks.register(events.Connection.UserSites, (e) => {
                this.allSites = e.Data.Sites;
                this.sites = this.allSites;
            });

            hooks.register(events.Connection.UserSitesNew, (e) => {
                this.allSites = e.Data.Sites;
                this.sites = this.allSites;
            });
        },
        methods: {
            SearchElem() {
                return document.getElementById("sitesSearchTxtBox");
            },
            SearchTerms() {
                if(this.SearchElem()) {return this.SearchElem().value.trim();}
                return "";
            },  
            Search() {
                if(this.SearchTerms().length > 0) {
                    var actualText = this.SearchTerms().toLowerCase();
                    this.sites = this.allSites.filter(x => x.Name.toLowerCase().includes(actualText));
                } else {
                    this.sites = this.allSites;
                }
            },
        }
    });
})(woServices);