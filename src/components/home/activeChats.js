(function(services){
    Vue.component('homeActiveChats', {
        template: `
        <div class="column is-3 is-fullheight active-chats" id="homeActiveChats">
            <div class="content-header">
                <h5 class="title is-4">Active Chats: {{this.$store.state.activeChatCount}}</h5>
            </div>
            <ul v-for="item of this.$store.state.chats">
                <homeWaitingChat v-bind:key="item.ChatUID" :chatNum="item.Number" :name="item.Name" :geoip="item.Location" :site="item.SiteName" :chatstatus="item.Status" :waitingWarning="item.waitingWarning"></homeWaitingChat>
            </ul>
        </div>
            `
    });
})(woServices);