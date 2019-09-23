(function(services){
    Vue.component('homeheader', {
        template: `
            <div class="columns is-fixed-top header is-marginless" id="app-header">
                <div class="column is-12 has-text-centered">
                    <h1 class="is-size-5">{{this.$store.state.userInfo.Name}} ({{statusText}}) | WhosOn</h1>
                </div>
            </div>`,
            computed: {
                statusText: function()
                {
                    switch (this.$store.state.currentStatus) {
                        case 0:
                            return "Online";
                        case 1:
                            return "Busy";
                        case 2:
                            return "Be right back";
                        case 3:
                            return "Away";
                    }
                }
            }
    });
})(woServices);