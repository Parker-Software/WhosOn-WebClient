(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    var connection = services.WhosOnConn;
    var store = services.Store;

    hooks.Register(hook.Connection.ChatClosed, (e) => {
        var data = e.Data;
        var chat = state.chats.find((v) => v.ChatUID == data);
        
        var myChat = false;

        if(chat != null) {            
            if(state.currentChat.ChatUID == chat.ChatUID) {
                hooks.Call(hook.Connection.CurrentChatClosed);
                state.currentChat.Closed = true;
            }

            myChat = chat.TalkingToClientConnection == state.currentConnectionId;

            chat.Messages = state.chatMessages[chat.ChatUID];
            chat.VisitorDetail = state.visitorDetail[chat.ChatUID];

            Object.keys(state.chatMessages).forEach((v) => {
                if(v == chat.Number)
                {
                    Vue.delete(state.chatMessages, v);
                }
            });

            var idx = state.chats.indexOf(chat);
            state.chats.splice(idx, 1);

            if (myChat) {
                chat.PreSurveys = state.chatPreSurveys[chat.Number]    
                chat.Closed = true;
                chat.IsActiveChat = false;
                state.chatsClosed.push(chat);
                
                store.commit("chatClosed", chat.ChatUID);
            }

            state.activeChatCount = Object.keys(state.chats).length;
        }

        var yourChats = state.chats.filter(x => x.TalkingToClientConnection == state.currentConnectionId);
        var reached = state.userInfo.MaxChats <= yourChats.length;

        if(myChat == false) return;

        if (state.currentStatus <= 1) {
            if(state.userInfo.MaxChats == 0 || reached == false) {
                connection.ChangeStatus("online");
                state.statusCanChangeAutomatically = true;
            } else {
                connection.ChangeStatus("busy");
                state.statusCanChangeAutomatically = false;
            }
        }
        
    });

})(woServices);