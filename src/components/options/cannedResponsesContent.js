(function(services){

    Vue.component("homeOptionsContentCannedResponses", {
        props: [
            "id"
        ],
        template: `
            <div v-bind:id="id">
                Canned Responses!
            </div>
        `
    });
})(woServices);