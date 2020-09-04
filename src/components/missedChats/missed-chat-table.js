(function(services){

    var state = services.Store.state;

    Vue.component("missed-chat-table", {
        props: [
            "chats",
            "selected"
        ],
        template: `
            <table class="missed-chat-table">
                <thead>
                    <th>Visitor Name</th>
                    <th>Time</th>
                    <th>Site</th>
                    <th>Call Back</th>
                    <th>Email Address</th>
                    <th>Telephone</th>
                    <th>Is Responding</th>
                    <th>Summary</th>
                    <th>Location</th>
                </thead>
                <tbody>
                    <tr v-for="chat in chats" v-bind:class="{'callback': chat.MissedWantsCallback, 'selected': chat == selected}" v-on:click="Clicked(chat)">
                        <td> {{ chat.VisitorName }} </td>
                        <td> {{ Time(chat) }} </td>
                        <td> {{ Site(chat) }} </td>
                        <td> <input disabled type="checkbox" v-bind:checked="chat.MissedWantsCallback" /> </td>
                        <td> {{ chat.Email }} </td>
                        <td> {{ chat.Phone }} </td>
                        <td> 
                            <span v-if="chat.MissedResponseStarted"> 
                                {{ RespondingUser(chat) }} 
                            </span>
                        </td>
                        <td> 
                            {{ chat.Message }} 
                        </td>
                        <td> 
                            {{ chat.Location }} 
                        </td>
                    </tr>
                </tbody>
            </table>
        `,
        methods: {  
            Site(chat) {
                return state.sites[chat.SiteKey].Name;
            },

            Time(chat) {
                let time = new Date(chat.Started);
                return `${this.AddZero(time.getHours())}:${this.AddZero(time.getMinutes())}`;
            },

            RespondingUser(chat) {
                return state.users.find(x => x.Username == chat.MissedResponseStartedBy).Name;
            },
            
            AddZero(string) {
                if(Number(string) < 10) {string = String("0"+string);}
                return string;
            },

            Clicked(chat) {
                this.$emit("Clicked", chat);
            }
        }
    });
})(woServices);