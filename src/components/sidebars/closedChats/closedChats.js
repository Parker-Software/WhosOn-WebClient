(function(services){

    var state = services.Store.state;

    Vue.component("closedChats", {
        template: `
        <div class="customColumn active-chats" id="homeClosedChats">  
            <div id="closed-chats-wrapper" class="closed-chats-wrapper">
                <div class="content-header">
                    <h5 v-show="closedChatsCount > 0" class="title is-6-half">My Closed Chats: {{closedChatsCount}}</h5>
                    <h5 v-show="closedChatsCount <= 0" class="title is-6-half">No Closed Chats</h5>
                </div>
                    <div class="closedChat">     
                        <div v-for="group, groupname in chatsGroupedAndSorted">
                            <h2 class="is-6-half has-text-weight-medium pad-4">{{groupname}} {{group.length}}</h2>
                            <ul class="chat-scroller">
                                <closedChat v-for="item in group" v-bind:key="item.ChatUID" :chat="item">
                                </closedChat>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
            `,
            methods: {
                ActiveChatsBtn() {
                  var element = document.getElementById("homeClosedChats");
                  var wrapper = document.getElementById("closed-chats-wrapper");
                  element.classList.toggle("show");   
                  wrapper.classList.toggle("opacity");
                }
            },
        computed: {          
            closedChatsCount: function() {
                if (!state.chatsClosed) {
                    return 0;
                }
                return state.chatsClosed.length;
            },

            chatsGroupedAndSorted: function () {
                let result = {};
                
                let wrapup = [];
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
                
                if(state.chatsClosed.length > 1) {
                    state.chatsClosed.sort(sorter);
                }
                
                state.chatsClosed.forEach(chat => {
                    var site = state.sites[chat.SiteKey];
                    if (site != null && site.WrapUp.Show != "" && chat.WrapUpCompleted == false) {
                        wrapup.push(chat);
                    } else {
                        other.push(chat);
                    }
                });

                if (wrapup.length > 0)
                {
                    result["Needing Wrapup"] = wrapup;
                }
                                
                if (other.length > 0)
                {
                    result["Closed"] = other;
                }

                return result;
            }
        }
    });
})(woServices);