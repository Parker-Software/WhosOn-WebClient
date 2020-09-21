(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;

    hooks.Register(hook.Connection.CurrentChats, (e) => {
        var chats = e.Data;
        state.chats = services.ChatFactory.FromChatting(chats, state.sites, state.users);
        state.activeChatCount = Object.keys(state.chats).length; 
    });

})(woServices);