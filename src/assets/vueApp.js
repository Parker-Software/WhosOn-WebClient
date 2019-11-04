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

    var vue = new VueApp();
    services.Add("Vue", vue);
})(woServices);