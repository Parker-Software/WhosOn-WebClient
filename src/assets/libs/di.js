var woServices = (function(services){
    return {
        Add: function(type, instance) {
            this[type] = instance;
        }
    }
})();