(function(services){

    Vue.component('homeOptionsContentChangePassword', {
        props: [
            "id"
        ],
        template: `
            <div v-bind:id="id">
                Change password!
            </div>
        `
    });
})(woServices);