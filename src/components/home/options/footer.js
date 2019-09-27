(function(services){

    Vue.component('homeOptionsFooter', {
        template: `
        <div id="homeOptionsFooter" style="position:absolute; bottom:100px;">
            <button class="button btn-login">Save</button>
            <button class="button btn-login">Cancel</button>
            <button class="button btn-login" v-on:click="Logout">Logout</button>
        </div>
        `,
        methods: {
            Logout() {
                console.log("Logout clicked!");
            }
        }
    });
})(woServices);