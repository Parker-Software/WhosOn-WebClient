(function(services){
    Vue.component('homeOptionsContentAbout', {
        props: [
            "id"
        ],
        template: `
            <div v-bind:id="id">
                About!
            </div>
        `
    });
})(woServices);