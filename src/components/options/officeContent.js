(function(services){
    Vue.component("homeOptionsContentOffice", {
        props: [
            "id"
        ],
        template: `
        <div v-bind:id="id">
            Office Content!
        </div>
        `
    });
})(woServices);