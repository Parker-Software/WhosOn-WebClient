(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    
    Vue.component("me-message", {
        props: [
            "groupedMessage",
            "preview"
        ],
        template: `
        <div class="columns is-gapless">        
            <div class="column is-4"></div>
            <div class="column is-8">                
                <div 
                    v-bind:class="{'fileMessage':groupedMessage.isLink,'is-pulled-right':groupedMessage.isLink}"
                    class="notification operator"
                >
                    <p class="top-text">
                        <small> 
                            <time>{{groupedMessage.time}}</time>
                        </small>
                    </p>
                    <p v-html="messageFormatted" class="operator-message-text"></p>
                </div>
            </div>
        </div>
        `,  
        computed: {
            messageFormatted: function() {
                var messages = Copy(this.groupedMessage.messages);
                var message = "";
                if(this.groupedMessage.isLink) {
                    var linkMessage = this.groupedMessage.messages[0].Text;
                    var name;
                    var link;
                    var html = linkMessage.includes("<link>");
                    if(html) {
                        var xml = new DOMParser().parseFromString(linkMessage, "text/xml");
                        name = xml.getElementsByTagName("name")[0].innerHTML;
                        link = xml.getElementsByTagName("url")[0].innerHTML;
                    } else {
                        var split = linkMessage.split("\t");
                        name = split[0];
                        link = split[1];
                    }

                    if (name.indexOf(".jpg") != -1 ||
                        name.indexOf(".png") != -1 ||
                        name.indexOf(".jpeg") != -1 ||
                        name.indexOf(".gif") != -1) 
                    {
                        message += `<a href="${link}&view=true" target="_blank"><img class="clickableImage ${link}" src="${link}" width="300" height="300" /></a> <br />`;
                    } else {
                        message += `<a href="${link}" style="text-decoration: none;" target="_blank"><div class="clickableImage" style="width:300px;">${name}</div></a>`;
                    }

                    message += `Sent File - <a href="${link}" target="_blank">Download <i class="fas fa-file-download"></i></a>`;
                } else {
                    for(var i = 0; i < messages.length; i++) {
                        var messageItem = messages[i];
                        var haslink = hasLink(messageItem.Text);
                        if(haslink) {
                            for(var k = 0; k < haslink.length; k++) {
                                var link = linkToAnchor(haslink[k]);
                                messageItem.Text = messageItem.Text.replace(haslink[k], link);
                            }
                        }
                        message += messageItem.Text + " <br />";
                    }
                }
                return message;
            }
        }
    });
})(woServices);