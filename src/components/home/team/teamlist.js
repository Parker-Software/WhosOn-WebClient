(function(services){
    Vue.component('homeTeamUsers', {
        template: `
            <div class="customColumn active-chats" id="homeTeamUsers">
                <div class="active-team-wrapper">
                    <div class="content-header">
                        <h5 class="title is-6-half">Connected Operators: {{$store.state.users.length}}</h5>
                    </div>
                    <div class="users-list">
                        <ul v-for="item of $store.state.users" class="user-list-team">
                            <userItem collectionGroup="team" :user="item"></userItem>
                        </ul>
                    </div>
                </div>
            </div>
        `
    });
})(woServices);