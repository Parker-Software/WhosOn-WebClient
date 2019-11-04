(function(services){
    Vue.component('homeTeamUsers', {
        template: `
            <div class="customColumn active-chats" id="homeTeamUsers">
                <div class="content-header">
                    <h5 class="title is-4">Connected Operators: {{$store.state.users.length}}</h5>
                </div>
                <ul v-for="item of $store.state.users">
                    <userItem :user="item"></userItem>
                </ul>
            </div>
        `
    });
})(woServices);