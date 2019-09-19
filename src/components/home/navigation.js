(function(services){
    Vue.component('homenav', {
        template: `
            <div class="column is-1 is-fullheight" id="navigation" style="user-select:none">
            <aside class="menu">
                <ul class="menu-list">
                    <li @click="viewStatus()">
                        <a class="">
                            <span class="icon">
                                <i class="fas fa-user"></i>
                            </span>
                            <br>
                            My Status
                        </a>
                    </li>
                    <li @click="viewChats()">
                        <a class="is-active">
                            <span class="icon">
                                <i class="fas fa-comment-dots"></i>
                            </span>
                            <br>
                            Chats
                        </a>
                    </li>
                    <li @click="viewUsers()">
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
                    <li>
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
                console.log("View Status Page")
            },
            viewChats() {
                console.log("View Chats Page");
            },
            viewUsers() {
                console.log("ViewUSers");
            }
        }
    });
})(woServices);