(function(services){

    var state = services.Store.state;

    Vue.component('appheader', {
        template: `
            <div class="header" id="app-header">
                <div class="has-text-centered">
                    <h1 class="is-size-6-half has-text-weight-medium">{{topDisplayName}} ({{statusText}}) | WhosOn</h1>
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