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
                    </li>
                    <li @click="viewChats()" id="chatsNavButton">
                        <a id="chatsNavButton" class="is-active">
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
                            users
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