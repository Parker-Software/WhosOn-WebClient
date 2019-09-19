(function() {
    class VueApp {
        constructor() {

            var self = this;
            self._main = new Vue({
                el: "#app",
                store: woServices.Store,
                beforeCreate() {
                    this.$store.commit("init");
                }
            }); 
        }
    }

    var vue = new VueApp();
    woServices.Add("Vue", vue);
})();