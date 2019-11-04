(function(services){

    var state = services.Store.state;

    Vue.component('homeheader', {
        template: `
            <div class="header" id="app-header">
                <div class="has-text-centered">
                    <h1 class="is-size-5">{{topDisplayName}} ({{statusText}}) | WhosOn</h1>
                </div>
            </div>`,
            computed: {
                topDisplayName: function() {
                    return state.userInfo !== null ? state.userInfo.Name : state.userName;
                },
                statusText: function()
                {
                    switch (state.currentStatus) {
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