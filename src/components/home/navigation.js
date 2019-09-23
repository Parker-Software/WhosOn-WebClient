(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;

    Vue.component('homenav', {
        template: `
            <div class="column is-1 is-fullheight" id="navigation" style="user-select:none">
            <aside class="menu">
                <ul class="menu-list">
                    <li @click="viewStatus()" id="myStatusNavButton">
                        <a class="">
                            <span class="icon">
                                <i class="fas fa-user"></i>
                            </span>
                            <br>
                            My Status
                        </a>
                        <div v-if="this.$store.state.currentStatus == 0" class="status online" style="right: 62px; bottom: 29px;">
                            <i class="fas fa-circle"></i>
                        </div>
                        <div v-if="this.$store.state.currentStatus == 1" class="status busy" style="right: 62px; bottom: 29px;">
                            <i class="fas fa-circle"></i>
                        </div>
                        <div v-if="this.$store.state.currentStatus == 2" class="status brb" style="right: 62px; bottom: 29px;">
                            <i class="fas fa-circle"></i>
                        </div>
                        <div v-if="this.$store.state.currentStatus == 3" class="status away" style="right: 62px; bottom: 29px;">
                            <i class="fas fa-circle"></i>
                        </div>
                    </li>
                    <li @click="viewChats()" id="chatsNavButton">
                        <a class="is-active">
                            <span class="icon">
                                <i class="fas fa-comment-dots"></i>
                            </span>
                            <br>
                            Chats
                        </a>
                    </li>
                    <li @click="viewUsers()" id="usersNavButton">
                        <a class="">
                            <span class="icon">
                                <i class="fas fa-users"></i>
                            </span>
                            <br>
                            Team
                        </a>
                    </li>

                </ul>

            </aside>
            <aside class="menu menu-bottom">
                <ul class="menu-list">
                    <li @click="viewOptions()" id="optionsNavButton">
                        <a class="">
                            <span class="icon">
                                <i class="fas fa-cog"></i>
                            </span>
                            <br>
                            Options
                        </a>
                    </li>
                </ul>
            </aside>
        </div>`,
        methods: {
            viewStatus() {
                hooks.Call(navEvents.MyStatus, "");
            },
            viewChats() {
                hooks.Call(navEvents.Chats, "");
            },
            viewUsers() {
                hooks.Call(navEvents.Users, "");
            },
            viewOptions() {
                hooks.Call(navEvents.Options, "");
            }
        }
    });
})(woServices);