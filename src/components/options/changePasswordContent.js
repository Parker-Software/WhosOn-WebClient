(function(services){
    Vue.component("homeOptionsContentChangePassword", {
        props: [
            "id"
        ],

        template: `
            <div v-bind:id="id">
                <change-password-form />
            </div>
        `
    });
})(woServices);