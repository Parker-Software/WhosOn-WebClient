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
                <div class="columns">
                    <div class="customColumn is-narrow column no-gap-right">
                        <div v-if="user.HasPhoto == false" v-bind:class="setBackgroundColor" class="badge">{{visitorLetter}}<div class="status"></div></div>
                        <figure class="image is-48x48" v-if="user.HasPhoto">
                        <div class="status online-user" v-if="user.Status == 0"></div>
                        <div class="status busy-user" v-if="user.Status == 1"></div>
                        <div class="status brb-user" v-if="user.Status == 2"></div>
                        <div class="status away-user" v-if="user.Status >= 3"></div>
                        <img v-bind:class="user.Username" src="https://bulma.io/images/placeholders/48x48.png" alt="Image" class="is-rounded">    
                        </figure>                           
                    </div>
                    <div class="column">
                        <strong class="useritem-username">{{user.Name}}</strong><br/>
                        <small>{{user.Dept}}Test</small>
                    </div>
                </div>
            </li>
        `,
        computed: {
            ItemClass() {
                var classes = {};
                classes[this.collectionGroup || 'userItem'] = true;
                classes[(this.collectionGroup || 'userItem') + '-' +  this.user.Username] = true;
                return classes;
            },
            visitorLetter(){
                var name = this.user.Username;
                if(name === undefined) return;
                return name.charAt(0).toUpperCase();
            },
            setBackgroundColor() {
                var name = this.user.Username;
                if(name === undefined) return;              
                return name.charAt(0).toLowerCase();
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