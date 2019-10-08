(function(services){
    Vue.component('homeActiveChats', {
        template: `
        <div class="customColumn active-chats" id="homeActiveChats">
            <div class="content-header">
                <h5 v-show="this.$store.state.activeChatCount > 0" class="title is-4">Active Chats: {{this.$store.state.activeChatCount}}</h5>
                <h5 v-show="this.$store.state.activeChatCount <= 0" class="title is-4">No Active Chats</h5>
            </div>
            <div class="chats">
                <div v-for="group, groupname in chatsGroupedAndSorted">
                    <h2>{{groupname}}</h2>
                    <ul>
                        <homeWaitingChat v-for="item in group"
                            :chatId = "item.ChatUID"
                            :chatNum="item.Number"
                            :name="item.Name"
                            :geoip="item.Location"
                            :site="item.SiteName" 
                            :chatstatus="item.Status" 
                            :waitingWarning="item.WaitingWarning" 
                            :isSelected="item.IsActiveChat">
                        </homeWaitingChat>
                    </ul>
                </div>
            </div>
        </div>
            `,
        computed: {
            chatsGroupedAndSorted: function () {
                const result = {};
                const mychats = [];
                const waiting = [];
                const queued = [];
                const other = [];
                
                
                this.$store.state.chats.forEach(chat => {
                    if (chat.TalkingToClientConnection == 0) {
                        waiting.push(chat);
                    } else if (chat.TalkingToClientConnection == services.Store.state.currentConnectionId) {
                        mychats.push(chat);
                    } else if (chat.QueuePos > 0) {
                        queued.push(chat);
                    } else {
                        other.push(chat);
                    }

                });

                if (mychats.length > 0)
                {
                    result["My Chats"] = mychats;
                }
                
                if (waiting.length > 0)
                {
                    result["Waiting"] = waiting;
                }
                
                if (queued.length > 0)
                {
                    result["Queued"] = queued;
                }
                
                if (other.length > 0)
                {
                    result["Chatting"] = other;
                }

                return result;
            }
        }
    });
})(woServices);