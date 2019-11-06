(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var navEvents = events.Navigation;

    Vue.component('homenav', {
        template: `
            <div id="navigation" class="customColumn" style="user-select:none">
            <aside class="menu">
                <ul class="menu-list">
                    <li @click="OnNavButtonClicked('status')" id="myStatusNavButton">
                        <a class="">
                            <span class="icon">
                                <i class="fas fa-user"></i>
                                <span v-if="$store.state.currentStatus == 0" class="status online" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                                <span v-if="$store.state.currentStatus == 1" class="status busy" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                                <span v-if="$store.state.currentStatus == 2" class="status brb" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                                <span v-if="$store.state.currentStatus == 3" class="status away" style="right: -6px; bottom: -18px;">
                                    <i class="fas fa-circle"></i>
                                </span>
                            </span>
                            <br>
                            My Status
                        </a>
                       
                    </li>
                    <li @click="OnNavButtonClicked('chats')" id="chatsNavButton">
                        <a class="is-active">
                            <span class="icon">
                                <i class="fas fa-comment-dots"></i>
                            </span>
                            <br>
                            Chats
                        </a>
                    </li>
                    <li @click="OnNavButtonClicked('team')" id="usersNavButton">
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
                    <li @click="OnNavButtonClicked('options')" id="optionsNavButton">
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
            UnselectAll() {
                this.StatusBtn().firstChild.classList.remove("is-active");
                this.ChatBtn().firstChild.classList.remove("is-active");
                this.UsersBtn().firstChild.classList.remove("is-active");
                this.OptionsBtn().firstChild.classList.remove("is-active");
            },
            StatusBtn() {
                return document.getElementById("myStatusNavButton");
            },
            ChatBtn() {
                return document.getElementById("chatsNavButton");
            },
            UsersBtn() {
                return document.getElementById("usersNavButton");
            },
            OptionsBtn() {
                return document.getElementById("optionsNavButton");
            },
            OnNavButtonClicked(status) {
                hooks.Call(navEvents.ButtonClicked, status);
                switch(status) {
                    case "status":
                        hooks.Call(navEvents.MyStatusClicked);
                        break;
                    case "chats":
                        this.UnselectAll();
                        hooks.Call(navEvents.ChatsClicked);
                        this.ChatBtn().firstChild.classList.add("is-active");
                        break;
                    case "team":
                        this.UnselectAll();
                        hooks.Call(navEvents.TeamClicked);
                        this.UsersBtn().firstChild.classList.add("is-active");
                        break;
                    case "options":
                        this.UnselectAll();
                        hooks.Call(navEvents.OptionsClicked);
                        this.OptionsBtn().firstChild.classList.add("is-active");
                        break;
                }
            }
        }
    });
})(woServices);