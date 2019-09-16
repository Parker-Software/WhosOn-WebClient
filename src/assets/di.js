var woServices;

(function(){
    class Services {
        Add(type, instance) {
            this[type] = instance;
        }
    }

    woServices = new Services();
})();