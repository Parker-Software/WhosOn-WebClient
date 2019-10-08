(function(services){
    Vue.component('chatConversationVisitor', {
        props: [
            'message',
            'timeStamp',
            'isFile'
        ],
        template: `
            <div class="columns is-gapless">
                <div class="column is-8">
                    <div v-bind:class="{'fileMessage':isFile}" class="notification visitor" v-html="messageFormatted">
                    </div>
                </div>
                <div class="column is-3"></div>
                <div class="column is-1 is-flex time-col"
                    style="margin: auto;flex-direction: column;text-align: center;">
                    <time>{{timeStamp}}</time>
                </div>
            </div>
        `,
        computed: {
            messageFormatted: function() {
                if(this.isFile) {
                    var message = "";
                    var split = this.message.split('\t');
                    var name = split[0];
                    var link = split[1];

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
                } else return this.message;
            }
        }
    });
})(woServices);