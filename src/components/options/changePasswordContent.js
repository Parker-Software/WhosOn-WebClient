(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("homeOptionsContentChangePassword", {
        props: [
            "id"
        ],
        template: `
            <div v-bind:id="id">
                <form class="form" autocomplete="off" onsubmit="event.preventDefault();">
                    <div class="field">
                        <label for="currentPassword"><small>Current password:</small></label> <br />
                        <input id="currentPassword" class="input" type="password"  v-on:keyup.enter="ChangePassword">
                    </div>
                    <div class="field">
                        <label for="newPassword"><small>New password:</small></label> <br />
                        <input id="newPassword" class="input" type="password"  v-on:keyup.enter="ChangePassword">
                    </div>  
                    <div class="field">
                        <label for="repeatNewPassword"><small>Repeat new password:</small></label> <br />
                        <input id="repeatNewPassword" class="input" type="password"  v-on:keyup.enter="ChangePassword">
                    </div>
                    <div class="field">
                        <button class="button btn" v-on:click="ChangePassword">Change</button>
                    </div>
                </form>
            </div>
        `,
        beforeCreate() {
            hooks.Register(events.Connection.PasswordChanged, (newPassword) => {
                this.$store.state.password = newPassword;

                this.CurrentPassword().value = "";
                this.NewPassword().value = "";
                this.RepeatNewPassword().value = "";
            });

            hooks.Register(events.Connection.Error, (error) => {
                if(this.Elem().style.display = "block") {
                    alert(error.Data);
                }
            });
        },
        methods: {
            Elem() {
                return document.getElementById(this.id);
            },
            CurrentPassword() {
                return document.getElementById("currentPassword");
            },
            NewPassword() {
                return document.getElementById("newPassword");
            },
            RepeatNewPassword() {
                return document.getElementById("repeatNewPassword");
            },
            ChangePassword() {
                if (this.CurrentPassword().value.length <= 0 ||
                    this.NewPassword().value.length <= 0 ||
                    this.RepeatNewPassword().value.length <= 0) {
                        alert("Current password invalid");
                        return;
                }

                if(this.NewPassword().value != this.RepeatNewPassword().value) {
                    alert("Current password invalid");
                    return;
                }

                services.WhosOnConn.ChangePassword(
                    this.$store.state.userName, 
                    this.CurrentPassword().value,
                    this.NewPassword().value);
            }
        }
    });
})(woServices);