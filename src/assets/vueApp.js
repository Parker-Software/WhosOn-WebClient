(function(services) {

    Number.prototype.toFormattedWaitTime = function () {
        var sec_num = this;
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        var string = "";
        if(minutes > 0)  string += `${minutes} Mins`;

        return `${string} ${seconds} Secs`;
    }

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

            self._chatWaitingTimer = setInterval(() => {
                var chats = services.Store.state.chats;

                if(chats != null && Object.keys(chats).length > 0) {
                    Object.keys(chats).forEach((v) => {
                        var chat = chats[v];
                        if(chat.TalkingTo == null || chat.TalkingTo == "") {
                            chat.WaitedSecs++;

                            if(chat.WaitedSecs > 10) {
                                chat.WaitingWarning = true;
                            }

                            chat.WaitedFor = chat.WaitedSecs.toFormattedWaitTime();
                            chat.Status = chat.WaitedFor;
                        }
                    });
                }
            }, 1000);
        }
    }

    var vue = new VueApp();
    services.Add("Vue", vue);
})(woServices);