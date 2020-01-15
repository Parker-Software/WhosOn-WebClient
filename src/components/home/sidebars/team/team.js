(function(services){
    Vue.component('team', {
        template: `
            <div class="active-chats" id="homeTeamUsers">
                <div class="active-team-wrapper">
                    <div class="content-header">
                        <h5 class="title is-6-half">Connected Operators: {{$store.state.users.length}}</h5>
                    </div>
                    <div class="users-list">
                        <ul v-for="item of $store.state.users" class="user-list-team">
                            <user collectionGroup="team" :user="item"></user>
                        </ul>
                    </div>
                </div>
            </div>
        `
    });
})(woServices);