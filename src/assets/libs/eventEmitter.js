class EventEmitter {
    constructor() {
        this._funcs = {};
    }

    On(eventName, func) {
        var self = this;
        var funcs = self._funcs[eventName];
        if(funcs == undefined || funcs == null) self._funcs[eventName] = [];
        self._funcs[eventName].push(func);
    }

    Call(eventName, params) {
        var self = this;
        var funcs = self._funcs[eventName];

        if(funcs == undefined || funcs == null || funcs.length <= 0) return;

        for(var i = 0; i < funcs.length; i++) {
            funcs[i](params);
        }
    }
}