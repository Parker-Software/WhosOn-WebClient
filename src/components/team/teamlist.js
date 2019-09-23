(function(services){
    Vue.component('homeTeamUsers', {
        template: `
            <div class="column is-3 is-fullheight active-chats" id="homeTeamUsers">
                <div class="content-header">
                    <h5 class="title is-4">Connected Operators: {{this.$store.state.users.length}}</h5>
                </div>
                <ul v-for="item of this.$store.state.users">
                    <homeTeamUser :name="item.Name" :photo="item.Photo" :status="item.Status"></homeTeamUser>
                </ul>
            </div>
        `
    });
})(woServices);