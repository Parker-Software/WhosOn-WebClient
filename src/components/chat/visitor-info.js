(function(services){

    Vue.component("visitor-info", {

        props: {
            visitor: {
                required: true
            },

            site: {
                required: true
            }
        },

        template: `
            <div v-if="visitor != null" class="visitorInfo">
                <div class="info-header">
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>DNS:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.DNS}} 
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>IP Address:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.IP}} 
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Started:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{Date}} 
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Username:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.SessionID}} 
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Country:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.GeoIP.CountryName}} 
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Location:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.GeoIP.City}} 
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Visit number:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.VisitNumber}} Of {{visitor.TotalVisits}} 
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Operating system:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.OS}}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Browser:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.Browser}}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Contact name:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.ContactName}}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Company name:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.ContactCompany}}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Address:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{Address}}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> 
                            <b>Chatted:</b> 
                        </div>
                        <div class="is-pulled-left"> 
                            {{visitor.Chatting ? "Yes":"No"}}
                        </div>
                    </div>
                </div>
                <div class="info-pages-viewed">
                    <small><b>Pages Viewed</b></small>
                    <table>
                        <tr>
                            <th>
                                No.
                            </th>
                            <th>
                                Time
                            </th>
                            <th>
                                Name
                            </th>
                        </tr>
                        <tr v-for="page, key in visitor.Pages" class="page" v-on:click="PageClicked(page)">
                            <td>
                                {{key + 1}}
                            </td> 
                            <td>
                                {{TimeOnly(page.Dated)}}
                            </td>
                            <td>
                                {{page.Name}}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        `,

        computed: {
            Date() {
                return new Date(this.visitor.SessionStarted).toString();
            },

            Address() {

                var address = "";

                if (this.visitor.ContactStreet) address += this.visitor.ContactStreet
                if (this.visitor.ContactCity) address += this.visitor.ContactCity;
                if (this.visitor.ContactZip) address += this.visitor.ContactZip;
                if (this.visitor.ContactCountry) address += this.visitor.ContactCountry;

                return address;
            }

        },

        methods: {
            
            TimeOnly(datestring) {
                var date = new Date(datestring);
                var hour = this.AddZero(date.getHours());
                var mins = this.AddZero(date.getMinutes());
                var seconds = this.AddZero(date.getSeconds());
                return `${hour}:${mins}:${seconds}`;
            },

            AddZero(string) {
                if(Number(string) < 10) {string = String("0"+string);}
                return string;
            },
            
            PageClicked(page) {
                window.open(`https://${this.site.Domain}`);
            }

        }

    });

})(woServices);