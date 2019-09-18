
(function(){
    var hooks = woServices.Hooks;
    var events = woServices.HookEvents;
    var connEvents = events.Connection;

    Vue.component('login', {
        data: function () {
            return {
                
            }
        },
        template: `<div id="login"><input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="submit" value="Login" v-on:click="onSubmit"></div>`,
        methods: {
            onSubmit() {
                hooks.Call(events.Login.SubmitClicked, "test");
            }
        }
    });

    hooks.Register(connEvents.LoggedIn, () => {
        
    });
})();
