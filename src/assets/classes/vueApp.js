(function(services) {

    var store = services.Store;

    class VueApp {
        constructor() {

            var self = this;
            self._main = new Vue({
                el: "#app",
                store: services.Store,
                beforeCreate() {
                    store.commit("init");
                }
            }); 
        }
    }

    Vue.config.errorHandler = function(err, vm, info) {
        rg4js('send', {
          error: err,
          customData: [{ info: info }]
        });
        console.error(err);
      };

    var vue = new VueApp();
    services.Add("Vue", vue);
})(woServices);