(function(services) {
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var store = services.Store;
    var connection = services.WhosOnConn;

    hooks.Register(events.Connection.LoggedIn, (e) => {
        state.appTitle = e.Data.AppTitle;
        state.serverBuild = e.Data.ServerBuild;
        state.registeredUser = e.Data.RegisteredUser;
        state.serverUID = e.Data.ServerUid;
        state.webChartsURL = e.Data.WebChartsUrl;
        state.chatURL = e.Data.ChatUrl;
    });

    
    hooks.Register(events.Connection.UserSites, (e) => {
        var sites = {};
        for (var index = 0; index < e.Data.Sites.length; index++)
        {
            sites[e.Data.Sites[index].SiteKey] = e.Data.Sites[index];
        }
        state.sites = sites; 
    });

    hooks.Register(events.Connection.UserInfo, (e) => {
        if(e.Data.User != null) {
            state.userInfo = e.Data.User;
        } else {state.userInfo = e.Data;}

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
            connection.StartListening();
        }
    });

    hooks.Register(events.Connection.CurrentUsersOnline, (e) => {
        var users = e.Data.Clients;

        for(var i = 0; i < users.length; i++) {
            var client = users[i];
            client.HasPhoto = true;
            services.WhosOnConn.GetUserPhoto(client.Username);
        }

        state.users = users; 
        var clientUser = state.users.find((v) => v.Username == state.userName);
        if(clientUser != null) {state.currentConnectionId = clientUser.Connection;}
        else {state.isSuperAdmin = true;}
    });

    hooks.Register(events.Connection.UserDisconnecting, (e) => {
        var userConn = e.Data;
        var user = state.users.find((v) => v.Connection == userConn);
        if(user != null) {
            var idx = state.users.indexOf(user);
            state.users.splice(idx, 1);
            
            hooks.Call(events.Home.UserImagesNeedUpdating);
        }
    });

    hooks.Register(events.Connection.UserChanged, (e) => {
        var changedUser = e.Data;
        var user = state.users.find((v) => v.Username == changedUser.Username);
        if(user != null) {
            user.Status = changedUser.Status;
            user.Chats = changedUser.Chats;
            user.Admin = changedUser.Admin;
            user.IPAddress = changedUser.IPAddress;
            user.Lang = changedUser.Lang;
            user.MaxChats = changedUser.MaxChats;
            user.Name = changedUser.Name;
            user.Connection = changedUser.Connection;
            if(user.Username == state.userName) {
                state.currentStatus = user.Status;
            }
            hooks.Call(events.Home.UserImagesNeedUpdating);
        } else {
            changedUser.HasPhoto = true;
            state.users.push(changedUser);
            services.WhosOnConn.GetUserPhoto(changedUser.Username);
        }
    });

    hooks.Register(events.Socket.Closed, (e) => {
        if (connection.LoggedOut) {
            sessionStorage.clear();
            store.commit("replaceEntireState", services.DefaultState());
        }
    });

    
    hooks.Register(events.Connection.Skills, (e) => {
        state.skills = [];
        Object.keys(e.Data).forEach(x => {
            var skill = e.Data[x];
            state.skills.push(skill);
        });
    });

    hooks.Register(events.Connection.UploadedFiles, (e) => {
        state.uploadedFiles = e.Data;
    });

    hooks.Register(events.Connection.CannedResponses, (e) => {
        state.cannedResponses = e.Data;
        state.cannedResponsesTree = cannedResponsesToTree(e.Data);
    });

    
})(woServices);