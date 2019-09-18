
(function(){
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
                woServices.Hooks.Call(woServices.HookEvents.Login.SubmitClicked, "test");
            }
        }
    });
})();
