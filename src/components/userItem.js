(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var state = services.Store.state;

    hooks.Register(events.Home.UserImagesNeedUpdating, () => {
        setTimeout(function() {
            for(var i = 0; i < state.users.length; i++) {
                var user = state.users[i];
                if(user.HasPhoto && user.Photo != null && user.Photo != "") {
                    var userElems = document.getElementsByClassName(user.Username);
                    for(var k = 0; k < userElems.length; k++) {
                        var userElem = userElems[k];   
                        userElem.src =  `data:image/png;base64, ${user.Photo}`;
                    }
                } 
            }
        }, 100);
    });

    hooks.Register(connEvents.UserPhoto, (e) => {
        var user = e.Header;
        var data = e.Data;

        var foundUser = state.users.find((v) => v.Username == user);
        if(foundUser != null) {
            if(e.Data != "") {
                foundUser.Photo = data;
            } else {
                foundUser.HasPhoto = false;
                foundUser.Photo = "";
            }
        } 
        state.users = Copy(state.users);
        hooks.Call(events.Home.UserImagesNeedUpdating);
    });

    Vue.component('userItem', {
        props: [
            "collectionGroup",
            "user"
        ],
        template: `
            <li v-bind:class="ItemClass" v-on:click="Clicked" class="selectableItem userItem">
                <div class="box chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <figure class="image is-64x64" style="margin:0; float:left;">
                                    <i v-if="user.HasPhoto == false" class="fas fa-user fa-3x" style="margin-top: 10px"></i>
                                    <img v-if="user.HasPhoto" v-bind:class="user.Username" src="https://bulma.io/images/placeholders/64x64.png" alt="Image" class="userPhoto is-rounded">
                                    <div v-if="user.Status == 0" class="status online"><i class="fas fa-circle"></i></div>
                                    <div v-if="user.Status == 1" class="status busy"><i class="fas fa-circle"></i></div>
                                    <div v-if="user.Status == 2" class="status brb"><i class="fas fa-circle"></i></div>
                                    <div v-if="user.Status == 3" class="status away"><i class="fas fa-circle"></i></div>
                                </figure>
                                <div style="float:left; margin-left: 10px; margin-top: 10px;">  
                                    <strong>{{user.Name}}</strong> <br />
                                    <small style="margin-left: 5px">{{user.Dept}}</small>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
        `,
        computed: {
            ItemClass() {
                var classes = {};
                classes[this.collectionGroup || 'userItem'] = true;
                classes[(this.collectionGroup || 'userItem') + '-' +  this.user.Username] = true;
                return classes;
            }
        },
        methods: {
            Elem() {
                return document.getElementsByClassName(`${this.collectionGroup || 'userItem'}-${this.user.Username}`)[0];
            },
            Clicked() {
                this.$emit("Clicked", this.user);
                if (this.Elem().classList.contains("is-active")) {
                    this.Elem().classList.remove("is-active");
                } else this.Elem().classList.add("is-active");
            }
        }
    });
})(woServices);