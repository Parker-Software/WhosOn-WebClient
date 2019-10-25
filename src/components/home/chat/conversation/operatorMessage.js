(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    
    Vue.component('chatConversationOperator', {
        props: [
            'message'
        ],
        template: `
        <div class="columns is-gapless">
            <div class="column is-3"></div>
            <div class="column is-8">
                <strong v-if="this.message.Name != null && this.message.Name != ''"><small>Whisper From {{this.message.Name}}</small></strong>
                <div v-bind:class="{'fileMessage':this.message.isLink, 'is-pulled-right':this.message.isLink, 'beingMonitored':this.message.isWhisper == true}" class="notification operator" v-html="messageFormatted">
                </div>
            </div>
            <div class="column is-1 is-flex time-col"
                style="margin: auto;flex-direction: column;text-align: center;">
                <time>{{this.message.date}}</time>
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
                    var xml = new DOMParser().parseFromString(this.message.msg, "text/xml");
                    var name = xml.getElementsByTagName("name")[0].innerHTML;
                    var link = xml.getElementsByTagName("url")[0].innerHTML;

                    if (name.indexOf(".jpg") != -1 ||
                        name.indexOf(".png") != -1 ||
                        name.indexOf(".jpeg") != -1 ||
                        name.indexOf(".gif") != -1) 
                    {
                        message += `<a href="${link}&view=true" target="_blank"><img class="clickableImage ${link}" src="${link}" width="300" height="300" /></a> <br />`;
                    } else {
                        message += `<a href="${link}" style="text-decoration: none;" target="_blank"><div class="clickableImage" style="width:300px;">${name}</div></a>`;
                    }
                    message += `Operator Sent File - <a href="${link}" target="_blank">Download <i class="fas fa-file-download"></i></a>`;
                    return message;
                } else return this.message.msg;
            }
        }
    });
})(woServices);