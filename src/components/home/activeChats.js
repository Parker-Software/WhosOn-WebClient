(function(services){
    Vue.component('homeActiveChats', {
        template: `
        <div class="column is-3 is-fullheight active-chats">
            <div class="content-header">
                <h5 class="title is-4">Active Chats: {{this.$store.state.activeChatCount}}</h5>
            </div>
            <ul v-for="item of this.$store.state.chats">
                <homeWaitingChat :name="item.Name" :geoip="item.Location" :site="item.SiteName" :chatstatus="item.Status"></homeWaitingChat>
            </ul>
        </div>
            `
    });
})(woServices);