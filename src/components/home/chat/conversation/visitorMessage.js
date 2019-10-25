(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('chatConversationVisitor', {
        props: [
            'message'
        ],
        template: `
            <div class="columns is-gapless">
                <div class="column is-8">
                    <div v-bind:class="{'fileMessage':message.isLink}" class="notification visitor" v-html="messageFormatted">
                    </div>
                </div>
                <div class="column is-3"></div>
                <div class="column is-1 is-flex time-col"
                    style="margin: auto;flex-direction: column;text-align: center;">
                    <time>{{message.date}}</time>
                </div>
            </div>
        `,
        mounted() {
            hooks.Call(events.Chat.ScrollChat);
            var images = document.getElementsByClassName("clickableImage");
            for(var i = 0; i < images.length; i++){
                images[i].onload = function() {
                    hooks.Call(events.Chat.ScrollChat);
                }
            }
        },
        computed: {
            messageFormatted: function() {
                if(this.message.isLink) {
                    var message = "";
                    var name;
                    var link;

                    if(this.message.msg.indexOf("<link>") != -1) {
                        var xml = new DOMParser().parseFromString(this.message.msg, "text/xml");
                        name = xml.getElementsByTagName("name")[0].innerHTML;
                        link = xml.getElementsByTagName("url")[0].innerHTML;
                    } else {
                        var split = this.message.msg.split('\t');
                        name = split[0];
                        link = split[1];
                    }

                    if (name.indexOf(".jpg") != -1 ||
                        name.indexOf(".png") != -1 ||
                        name.indexOf(".jpeg") != -1 ||
                        name.indexOf(".gif") != -1) 
                    {
                        message += `<a href="${link}&view=true" target="_blank"><img class="clickableImage" src="${link}" width="300" height="300" /></a> <br />`;
                    } else {
                        message += `<a href="${link}" style="text-decoration: none;" target="_blank"><div class="clickableImage" style="width:300px;">${name}</div></a>`;
                    }
                    message += `${this.$store.state.currentChat.Name} Uploaded File - <a href="${link}" target="_blank">Download <i class="fas fa-file-download"></i></a>`;
                    return message;
                } else return this.message.msg;
            }
        }
    });
})(woServices);