(function(){
    Vue.component('homeheader', {
        template: `
            <div class="columns is-fixed-top header is-marginless" id="app-header">
                <div class="column is-12 has-text-centered">
                    <h1 class="is-size-5">{{this.$store.state.userName}} | WhosOn</h1>
                </div>
            </div>`
    });
})();