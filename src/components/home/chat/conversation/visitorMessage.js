(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;

    Vue.component("chatConversationVisitor", {
        props: [
            "groupedMessage",
            "preview"
        ],
        template: `
            <div class="columns is-gapless">
                <div class="column is-8">  
                    <div class="visitor-message">
                        <div v-bind:class="{'fileMessage':groupedMessage.isLink}" class="notification visitor">
                        <p><small>{{groupedMessage.Name}} <span v-if="preview">@</span> <time>{{groupedMessage.time}}</time></small></p>
                        <p v-html="messageFormatted" class="visitor-message-text"></p>
                        </div>
                    </div>
                </div>
                <div class="column is-4"></div>
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
                var messages = this.groupedMessage.messages;
                var message = "";
                if(this.groupedMessage.isLink) {
                    var linkedMessage = this.groupedMessage.messages[0];
                    var name;
                    var link;

                    if(linkedMessage.msg.indexOf("<link>") != -1) {
                        var xml = new DOMParser().parseFromString(linkedMessage.msg, "text/xml");
                        name = xml.getElementsByTagName("name")[0].innerHTML;
                        link = xml.getElementsByTagName("url")[0].innerHTML;
                    } else {
                        var split = linkedMessage.msg.split("\t");
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
                    message += `${state.currentChat.Name} Uploaded File - <a href="${link}" target="_blank">Download <i class="fas fa-file-download"></i></a>`;
                } else {
                    for(var i = 0; i < messages.length; i++) {
                        var messageItem = messages[i];
                        message += messageItem.msg + " <br />";
                    }
                }

                return message;
            }
        }
    });
})(woServices);