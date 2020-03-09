(function(services){
    Vue.component("monitor-all-view", {
        props: {
            chats: {
                required: true,
            }
        },
        template: `
            <div class="monitorAllView">
                <h5 v-if="chats.length <= 0" class="title is-6-half">No Active Chats</h5>
                <h5 v-if="chats.length > 0" class="title is-6-half">Active Chats: {{chats.length}}</h5>
                <div v-if="chats.length > 0" class="chats">
                    <monitor-all-chat v-for="chat in chats" :chat="chat"> </monitor-all-chat>
                </div>
            </div>
        `,
    });
})(woServices);