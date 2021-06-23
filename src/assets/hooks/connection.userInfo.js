(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var hook = services.HookEvents;
    var connection = services.WhosOnConn;

    hooks.register(hook.Connection.UserInfo, (e) => {
        if (state.userInfo == null || state.userName == e.Data.Username) {
        if(e.Data.User != null) {
            state.userInfo = e.Data.User;
        } else {state.userInfo = e.Data;}
        }

        var split = state.userInfo.Rights.split("");
        state.rights.LoginToSettingsPortal = YNToBool(split[0]);
        state.rights.ViewReports = YNToBool(split[1]);
        state.rights.ViewDailySummary = YNToBool(split[2]);
        state.rights.EditLocalSettings = YNToBool(split[3]);
        state.rights.TakeChats = YNToBool(split[4]);
        state.rights.SendChatInvites = YNToBool(split[5]);
        state.rights.RespondToMissedChats = YNToBool(split[6]);
        state.rights.ChatToOtherOperators = YNToBool(split[7]);
        state.rights.MonitorChats = YNToBool(split[8]);
        state.rights.ChangeOwnName = YNToBool(split[9]);
        state.rights.DeleteChats = YNToBool(split[10]);
        state.rights.SeeUsersOutsideOfOwnDepartment = YNToBool(split[11]);
        state.rights.TransferChatsToOutsideOwnDepartment = YNToBool(split[12]);
        state.rights.CreateTickets = YNToBool(split[13]);
        state.rights.StartVideoChats = YNToBool(split[14]);
        state.rights.UserToUserStoredInDatase = YNToBool(split[15]);
        state.rights.StartRemoteControl = YNToBool(split[16]);
        state.rights.SingleUseFile = split[17];
        state.rights.SuperAdmin = split.indexOf("S") != -1;
        state.rights.Invisible = split.indexOf("I") != -1;


        var settings = state.userInfo.ClientOptions.split("\n");
        for(var i = 0; i < settings.length; i++) {
            if(settings[i].indexOf("=") != -1) {
                var extracted = IniExtraction(settings[i]);
                state.settings[extracted[0]] = extracted[1];
            }
        }



        if(state.settings.ListenModeActive) {
            connection.startListening();
        }
    });
    
})(woServices);