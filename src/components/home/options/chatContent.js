(function(services){
    Vue.component('homeOptionsContentChat', {
        props: [
            "id"
        ],
        template: `
        <div v-bind:id="id">
            Chat Content!
        </div>
        `
    });
})(woServices);