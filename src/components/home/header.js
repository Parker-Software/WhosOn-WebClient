(function(services){
    Vue.component('homeheader', {
        template: `
            <div class="columns is-fixed-top header is-marginless" id="app-header">
                <div class="column is-12 has-text-centered">
                    <h1 v-if="this.$store.state.currentStatus == 0" class="is-size-5">{{this.$store.state.userName}} (Online) | WhosOn</h1>
                    <h1 v-if="this.$store.state.currentStatus == 1" class="is-size-5">{{this.$store.state.userName}} (Busy) | WhosOn</h1>
                    <h1 v-if="this.$store.state.currentStatus == 2" class="is-size-5">{{this.$store.state.userName}} (Be right back) | WhosOn</h1>
                    <h1 v-if="this.$store.state.currentStatus == 3" class="is-size-5">{{this.$store.state.userName}} (Away) | WhosOn</h1>
                </div>
            </div>`
    });
})(woServices);