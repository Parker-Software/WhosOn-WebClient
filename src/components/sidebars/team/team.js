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
        data: () => {
            return {
                showGroupMembers: false,
                terms: ""
            }
        },

        template: `
            <div class="active-chats" id="homeTeamUsers">
                <div class="active-team-wrapper">
                    <div class="content-header" style="padding: 5px;">
                        <h5 class="title is-6-half">Connected Operators: {{UserCount}}</h5>
                        
                        <div v-if="User && User.GroupID" class="field">
                            <input id="showGroupMembersCheckbox" type="checkbox" v-model="showGroupMembers" class="switch is-rounded" />
                            <label for="showGroupMembersCheckbox"><small>Show My Group</small></label>
                        </div>

                        <form autocomplete="off" onsubmit="event.preventDefault();">
                            <div class="field">
                                <p class="control has-icons-right">
                                    <input ref="searchBox" type="text" class="input searchBox" placeholder="Search Team" v-on:keyup.enter="Search">
                                    <span class="icon is-small is-right" style="height: 2em;">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </p>
                            </div>
                        </form>
                    </div>
                    <div class="users-list">
                        <ul class="user-list-team">
                            <user 
                                v-for="user of Users"
                                collectionGroup="team"
                                v-bind:class="{'unanswered': user.UnAnswered != null && user.UnAnswered}"
                                :user="user"
                                @Clicked="UserClicked"
                                :selected="Selected(user)"
                                :isTyping="user.IsTyping" 
                            />
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
            Users() {
                let self = this;
                let users = [];
                if(self.terms) {
                    users = self.$store.state.users.filter(
                        x => x.Dept.toLowerCase().includes(self.terms) ||
                            x.Email.toLowerCase().includes(self.terms) ||
                            x.GroupName.toLowerCase().includes(self.terms) ||
                            x.Name.toLowerCase().includes(self.terms) ||
                            x.Skills.toLowerCase().includes(self.terms) ||
                            x.Username.toLowerCase().includes(self.terms)
                    );
                } else {
                    users = self.$store.state.users;
                }

                if(self.User && self.User.GroupID && self.showGroupMembers) {
                    users = users.filter(
                        x => parseInt(x.GroupID) == parseInt(self.User.GroupID)
                    );
                }

                setTimeout(() => {
                    hooks.Call(events.Home.UserImagesNeedUpdating);
                }, 100);

                return users;
            },

            UserCount() {
                return this.$store.state.users.length;
            },

            SelectedUser() {
                return this.$store.state.selectedOperatorToOperatorUser;
            },

            User() {
                return this.$store.state.userInfo;
            }
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
            },

            Search() {
                this.terms = this.$refs.searchBox.value.toLowerCase();
            }
        }
    });
})(woServices);