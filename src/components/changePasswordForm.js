(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("change-password-form", {
        template: `
            <form class="change-password form" autocomplete="off" onsubmit="event.preventDefault();">
                <div class="field">
                    <label for="CurrentPassword"><small>Current password:</small></label> <br />
                    <input ref="currentPassword" class="input" type="password"  v-on:keyup.enter="ChangePassword">
                </div>
                <div class="field">
                    <label for="NewPassword"><small>New password:</small></label> <br />
                    <input ref="newPassword" class="input" type="password"  v-on:keyup.enter="ChangePassword">
                </div>  
                <div class="field">
                    <label for="RepeatNewPassword"><small>Repeat new password:</small></label> <br />
                    <input ref="repeatPassword" class="input" type="password"  v-on:keyup.enter="ChangePassword">
                </div>
                
                <button v-on:click="ChangePassword" class="button">Change</button>
            </form>
        `,

        beforeCreate() {
            hooks.Register(events.Connection.PasswordChanged, (newPassword) => {
                location.reload();
            });

            hooks.Register(events.Connection.Error, (error) => {
                if(this.Elem().style.display = "block") {
                    alert(error.Data);
                }
            });
        },

        methods: {
            CurrentPassword() {
                return this.$refs.currentPassword;
            },

            NewPassword() {
                return this.$refs.newPassword;
            },
            
            RepeatNewPassword() {
                return this.$refs.repeatPassword;
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