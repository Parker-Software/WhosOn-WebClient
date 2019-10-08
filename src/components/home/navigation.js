(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;

    Vue.component('homenav', {
        template: `
            <div id="navigation" class="customColumn" style="user-select:none">
            <aside class="menu">
                <ul class="menu-list">
                    <li @click="onNavButtonClicked('status')" id="myStatusNavButton">
                        <a class="">
                            <span class="icon">
                                <i class="fas fa-user"></i>
                                <span v-if="this.$store.state.currentStatus == 0" class="status online" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                                <span v-if="this.$store.state.currentStatus == 1" class="status busy" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                                <span v-if="this.$store.state.currentStatus == 2" class="status brb" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                                <span v-if="this.$store.state.currentStatus == 3" class="status away" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                            </span>
                            <br>
                            My Status
                        </a>
                       
                    </li>
                    <li @click="onNavButtonClicked('chats')" id="chatsNavButton">
                        <a class="is-active">
                            <span class="icon">
                                <i class="fas fa-comment-dots"></i>
                            </span>
                            <br>
                            Chats
                        </a>
                    </li>
                    <li @click="onNavButtonClicked('team')" id="usersNavButton">
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
                    <li @click="onNavButtonClicked('options')" id="optionsNavButton">
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
        beforeCreate() {
        },
        methods: {
            unselectAll() {
                document.getElementById("myStatusNavButton").firstChild.classList.remove("is-active");
                document.getElementById("chatsNavButton").firstChild.classList.remove("is-active");
                document.getElementById("usersNavButton").firstChild.classList.remove("is-active");
                document.getElementById("optionsNavButton").firstChild.classList.remove("is-active");
            },
            onNavButtonClicked(status) {
                hooks.Call(navEvents.ButtonClicked, status);
                switch(status) {
                    case "status":
                        hooks.Call(navEvents.MyStatusClicked, "");
                        break;
                    case "chats":
                        this.unselectAll();
                        hooks.Call(navEvents.ChatsClicked, "");
                        document.getElementById("chatsNavButton").firstChild.classList.add("is-active");
                        break;
                    case "team":
                        this.unselectAll();
                        hooks.Call(navEvents.TeamClicked, "");
                        document.getElementById("usersNavButton").firstChild.classList.add("is-active");
                        break;
                    case "options":
                        this.unselectAll();
                        hooks.Call(navEvents.OptionsClicked, "");
                        document.getElementById("optionsNavButton").firstChild.classList.add("is-active");
                        break;
                }
            }
        }
    });
})(woServices);