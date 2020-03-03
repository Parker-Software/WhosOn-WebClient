(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    
    Vue.component("inline-chat-notification", {
        props: {
            msg: {
                required: true
            }
        },
        template: `
            <div class="columns is-gapless">        
                <div class="column is-4 emptyNotificationArea"></div>
                <div class="column is-4 inline-chat-notification-message">     
                    <small>{{messageFormatted}}</small>
                </div>
                <div class="column is-4 emptyNotificationArea"></div>
            </div>
        `,  
        computed: {
            messageFormatted: function() {
                var messages = this.msg.messages;
                var message = "";

                for(var i = 0; i < messages.length; i++) {
                    var messageItem = messages[i];
                    message += messageItem.msg;
                }

                return `${message} at ${this.msg.time}`;
            }
        }
    });
})(woServices);