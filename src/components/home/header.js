(function(services){

    var state = services.Store.state;

    Vue.component('homeheader', {
        template: `
            <div class="header" id="app-header">
                <div class="has-text-centered">
                    <h1 class="is-size-5">{{topDisplayName}} ({{statusText}}) | WhosOn</h1>
                </div>
                <a id="mobileNavBtn" class="mobile-nav"  @click="OnMobileMenuClicked()" >
                    <span><i class="fas fa-bars"></i></span>
                </a>
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
            },
            methods: {
                OnMobileMenuClicked() {          
                    var x = document.getElementsByClassName("wo-sidebar")[0];
                    var page = document.getElementById("page-content");
                    var mobileNavBtn = document.getElementById("mobileNavBtn");
                    var activeChats = document.getElementById("homeActiveChats");
                    if (x.style.display === "block") {
                        x.style.display = "none";
                        page.style.width = `${window.innerWidth}px`;   
                        activeChats.style.left = 0;
                                    
                    } else {
                        x.style.display = "block";
                        var width = window.innerWidth - 80;                
                        page.style.width = `${width}px`;
                        activeChats.style.left = "80px";
                    }
                }
            }
    });
})(woServices);