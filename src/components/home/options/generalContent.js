(function(services){
    Vue.component('homeOptionsContentGeneral', {
        props: [
            "id"
        ],
        template: `
        <div v-bind:id="id">
            General Content!
        </div>
        `
    });
})(woServices);