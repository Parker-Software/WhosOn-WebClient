(function(services){
    Vue.component('homeTeam', {
        template: `
            <div class="column is-3 is-fullheight active-chats" id="homeTeam">
                <div class="content-header">
                
                </div>
                <ul v-for="item of this.$store.state.users">
                <li> Test </li>
                </ul>
            </div>
        `
    });
})(woServices);