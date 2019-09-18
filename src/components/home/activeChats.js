(function(){
    var hooks = woServices.Hooks;
    var events = woServices.HookEvents;
    var connEvents = events.Connection;

    Vue.component('homeActiveChats', {
        template: `
        <div class="column is-3 is-fullheight active-chats">
        <div class="content-header">
            <h5 class="title is-4">Active Chats: {{this.$store.state.activeChatCount}}</h5>
        </div>
        <ul v-for="item of this.$store.state.chats">
            <homeWaitingChat :name="item.name"></homeWaitingChat>
        </ul>
    </div>
            `
    });
})();