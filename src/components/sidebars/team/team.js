(function(services){
    var connection = services.WhosOnConn;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;
    

    hooks.Register(events.Connection.OperatorTyping, (e) => {
        var user = state.users.find(x => x.Connection == e.Data);
        if (user) {
            user.IsTyping = true;
            state.users = Copy(state.users);
        }
    });

    hooks.Register(events.Connection.OperatorTypingStopped, (e) => {
        var user = state.users.find(x => x.Connection == e.Data);
        if (user) {
            user.IsTyping = false;
            state.users = Copy(state.users);
        }
    });

    Vue.component("team", {
        template: `
            <div class="active-chats" id="homeTeamUsers">
                <div class="active-team-wrapper">
                    <div class="content-header">
                        <h5 class="title is-6-half">Connected Operators: {{UserCount}}</h5>
                    </div>
                    <div class="users-list">
                        <ul class="user-list-team">
                            <user v-for="user of Users" collectionGroup="team" v-bind:class="{'unanswered': user.UnAnswered != null && user.UnAnswered}" :user="user" @Clicked="UserClicked" :selected="Selected(user)" :isTyping="user.IsTyping"></user>
                        </ul>
                    </div>
                </div>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Team.CloseChatClicked, () => {
                this.$store.state.selectedOperatorToOperatorUser = null;
            });

            hooks.Register(events.Team.NotificationClicked, (user) => {
                this.$store.state.selectedOperatorToOperatorUser = user;
                hooks.Call(events.Team.UserClicked, user);
            });
        },
        computed: {
            UserCount() {
                return this.$store.state.users.length;
            },
            Users() {
                return this.$store.state.users;
            },
            SelectedUser() {
                return this.$store.state.selectedOperatorToOperatorUser;
            },
        },
        methods: {
            UserClicked(user) {
                if (this.$store.state.rights.ChatToOtherOperators == false && this.$store.state.operatorMessages[user.Username] == null) {return;}

                this.$store.state.selectedOperatorToOperatorUser = user;
                hooks.Call(events.Team.UserClicked, user);
            },
            Selected(user) {
                if(this.SelectedUser == null) {return false;}
                else {
                    return this.SelectedUser.Username == user.Username;
                }
            }
        }
    });
})(woServices);