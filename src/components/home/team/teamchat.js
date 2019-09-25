(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var navEvents = events.Navigation;
    var state = services.Store.state;

    Vue.component('homeTeamChat', {
        template: `
        <div class="column is-9 col-pad chat-area" id="hometeamChat">
            <div class="logo">
                <i class="far fa-comment"></i>
                <br>
                <p>No Active Chats</p>
            </div>
        </div>
        `,
        beforeCreate() {
            hooks.Register(connEvents.UserPhoto, (e) => {
                var user = e.Header;
                var data = e.Data;

                if(e.Data == "") return;

                var foundUser = state.users.find((v) => v.Username == user);
                if(foundUser != null) {
                    foundUser.Photo = data;
                    var user = document.getElementsByClassName(foundUser.Username)[0];
                    user.src =  `data:image/png;base64, ${data}`;
                } 
            });
        }
    });
})(woServices);