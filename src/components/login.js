
(function(){
    class LoginView extends EventEmitter {
        constructor() {
            super();

            var self = this;

            Vue.component('login', {
                data: function () {
                    return {
                        
                    }
                },
                template: '<div>Test</div>'
            })

            setTimeout(() => {
                self.Call("Loaded", null);
            }, 1000);
        }
    }

    var view = new LoginView();
    woServices.Add("LoginView", view);
})();

