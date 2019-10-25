(function(services) {
    class VueApp {
        constructor() {

            var self = this;
            self._main = new Vue({
                el: "#app",
                store: services.Store,
                beforeCreate() {
                    this.$store.commit("init");
                }
            }); 
        }
    }

    var vue = new VueApp();
    services.Add("Vue", vue);
})(woServices);