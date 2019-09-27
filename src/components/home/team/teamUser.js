(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var state = services.Store.state;

    Vue.component('homeTeamUser', {
        props: [
            "userName",
            "name",
            "status",
            "hasPhoto"
        ],
        template: `
            <li>
                <div class="box chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <figure class="image is-64x64" style="margin:0; float:left;">
                                    <i v-if="hasPhoto == false" class="fas fa-user fa-3x" style="margin-top: 10px"></i>
                                    <img v-if="hasPhoto" v-bind:class="userName" src="https://bulma.io/images/placeholders/64x64.png" alt="Image" class="userPhoto is-rounded">
                                    <div v-if="status == 0" class="status online"><i class="fas fa-circle"></i></div>
                                    <div v-if="status == 1" class="status busy"><i class="fas fa-circle"></i></div>
                                    <div v-if="status == 2" class="status brb"><i class="fas fa-circle"></i></div>
                                    <div v-if="status == 3" class="status away"><i class="fas fa-circle"></i></div>
                                </figure>
                                <strong style="float:left; margin-left: 10px; margin-top: 10px;">{{name}}</strong>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
        `,
        beforeCreate() {
            hooks.Register(connEvents.UserPhoto, (e) => {
                var user = e.Header;
                var data = e.Data;

                var foundUser = state.users.find((v) => v.Username == user);
                if(foundUser != null) {
                    if(e.Data != "") {
                        foundUser.Photo = data;
                        var userElem = document.getElementsByClassName(foundUser.Username)[0];
                        userElem.src =  `data:image/png;base64, ${data}`;
                    } else {
                        foundUser.HasPhoto = false;
                    }
                } 
            });
        }
    });
})(woServices);