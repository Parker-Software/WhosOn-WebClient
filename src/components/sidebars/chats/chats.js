(function(services){

    var state = services.Store.state;

    Vue.component("chats", {
        template: `
        <div class="customColumn active-chats" id="homeActiveChats">  
            <div id="active-chats-wrapper" class="active-chats-wrapper">
                <div class="content-header">
                    <h5 v-show="$store.state.activeChatCount > 0" class="title is-6-half">Active Chats: {{$store.state.activeChatCount}}</h5>
                    <h5 v-show="$store.state.activeChatCount <= 0" class="title is-6-half">No Active Chats</h5>
                </div>
                    <div class="chats">     
                        <div v-for="group, groupname in chatsGroupedAndSorted">
                            <h2 class="is-6-half has-text-weight-medium pad-4">{{groupname}} {{group.length}}</h2>
                            <ul class="chat-scroller">
                                <chat v-for="item in group" v-bind:key="item.ChatUID"
                                    :chat = "item" 
                                    v-if="item.TalkingToClientConnection == 0 || (item.TalkingToClientConnection == $store.state.currentConnectionId) || 
                                        (item.TalkingToClientConnection != $store.state.currentConnectionId && $store.state.settings.ShowOtherUsersChats)">
                                </chat>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
            `,
            methods: {
                ActiveChatsBtn() {
                  var element = document.getElementById("homeActiveChats");
                  var wrapper = document.getElementById("active-chats-wrapper");
                  element.classList.toggle("show");   
                  wrapper.classList.toggle("opacity");
                }
            },
        computed: {          

            chatsGroupedAndSorted: function () {
                let result = {};
                let mychats = [];
                let waiting = [];
                let queued = [];
                let other = [];

                let sorter = function(chatA, chatB) {
                    let sortIdx = 0;
                
                    if(chatB.Channel == null && chatA.Channel) {
                        sortIdx = 1;
                    } else if (chatB.Channel && chatA.Channel == null) {
                        sortIdx = -1;
                    }
    
                    return sortIdx;
                }
                
                if(state.chats.length > 1) {
                    state.chats.sort(sorter);
                }
                
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