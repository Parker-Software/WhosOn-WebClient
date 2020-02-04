(function(services){
    var connection = services.WhosOnConn;
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("team", {
        data: () => {
            return {
                selectedUser: null
            }  
        },
        template: `
            <div class="active-chats" id="homeTeamUsers">
                <div class="active-team-wrapper">
                    <div class="content-header">
                        <h5 class="title is-6-half">Connected Operators: {{UserCount}}</h5>
                    </div>
                    <div class="users-list">
                        <ul v-for="user of Users" class="user-list-team">
                            <user collectionGroup="team" :user="user" @Clicked="UserClicked" :selected="selectedUser == user"></user>
                        </ul>
                    </div>
                </div>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Team.CloseChatClicked, () => {
                this.selectedUser = null;
            });
        },
        computed: {
            UserCount() {
                return this.$store.state.users.length;
            },
            Users() {
                return this.$store.state.users;
            }
        },
        methods: {
            UserClicked(user) {
                this.selectedUser = user;
                hooks.Call(events.Team.UserClicked, user);
            }
        }
    });
})(woServices);