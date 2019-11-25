(function(services){

    var state = services.Store.state;

    Vue.component('homeActiveChats', {
        template: `
        <div class="customColumn active-chats" id="homeActiveChats">
            <div id="activeChatsBtn" class="open-chats js-cd-panel-trigger" @click="ActiveChatsBtn()">Active Chats</div>
  
            <div id="active-chats-wrapper" class="active-chats-wrapper">
                <div class="content-header">
                    <h5 v-show="$store.state.activeChatCount > 0" class="title is-4">Active Chats: {{$store.state.activeChatCount}}</h5>
                    <h5 v-show="$store.state.activeChatCount <= 0" class="title is-4">No Active Chats</h5>
                </div>
                    <div class="chats">     
                        <div v-for="group, groupname in chatsGroupedAndSorted">
                            <h2>{{groupname}}</h2>
                            <ul>
                                <homeWaitingChat v-for="item in group" v-bind:key="item.ChatUID"
                                    :chat = "item">
                                </homeWaitingChat>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
            `,
            methods: {
                ActiveChatsBtn() {
                  console.log("click");
                  var element = document.getElementById("homeActiveChats");
                  var wrapper = document.getElementById("active-chats-wrapper");
                  element.classList.toggle("show");   
                  wrapper.classList.toggle("opacity");
                }
            },
        computed: {          
            chatsGroupedAndSorted: function () {
                const result = {};
                const mychats = [];
                const waiting = [];
                const queued = [];
                const other = [];
                
                
                state.chats.forEach(chat => {
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