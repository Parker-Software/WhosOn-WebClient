(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.ChatChanged, (e) => {
        var data = e.Data;
        var chat = null;
        var newChat = state.preRenderedChats[data.Number];
        var existingChat = state.chats.find((v) => v.ChatUID == data.ChatUID);
        if (newChat != null) {
            if(existingChat != null) {return;}
            
            chat = services.ChatFactory.FromChatChangedNew(data, newChat, state.sites, state.users);
            state.chats.push(chat);
            state.activeChatCount = Object.keys(state.chats).length;
            Vue.delete(state.preRenderedChats, data.Number);
            hooks.Call(hook.Connection.NewChat, chat);
        } else {
            if(existingChat != null) {
                chat = services.ChatFactory.FromChatChangedOld(data, existingChat, state.sites, state.users);

                if(state.currentChat.ChatUID == chat.ChatUID) {
                    state.currentChat = chat;
                }
            } else {
                var site = state.sites[data.SiteKey];
                chat = services.ChatFactory.FromChatChangedNew(data, {
                    visitorName: data.VisitorName, domain: site.Domain 
                }, state.sites, state.users);
                state.chats.push(chat);
                state.activeChatCount = Object.keys(state.chats).length;
                hooks.Call(hook.Connection.NewChat, chat);
            }
        }
    });

})(woServices);