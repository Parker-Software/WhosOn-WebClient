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
                store: woServices.Store,
                beforeCreate() {
                    this.$store.commit("init");
                }
            }); 

            self._chatWaitingTimer = setInterval(() => {
                var chats = self._state.chats;

                if(chats != null && chats.length > 0) {
                    for(var i = 0; i < chats.length; i++) {
                        var chat = chats[i];
                        if(chat.TalkingTo == null || chat.TalkingTo == "") {
                            chat.WaitedSecs++;
                            chat.WaitedFor = chat.WaitedSecs.toFormattedWaitTime();
                            console.log(chat.WaitedFor);
                        }
                    }
                }
            }, 1000);
        }
    }

    var vue = new VueApp();
    services.Add("Vue", vue);
})(woServices);