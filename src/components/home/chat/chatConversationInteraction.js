(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    var state = services.Store.state;

    Vue.component('chatConversationInteraction', {
        template: `
        <section class="reply-container">
            <div class="column is-full visitor-typing" v-if="this.$store.state.currentChatTypingstate">
                <span>{{this.$store.state.currentChat.Name}} is typing...</span>
            </div>
            <div class="column is-full">
                <textarea id="inputArea" class="textarea" placeholder="Enter your reply"
                    style="resize: none;" v-on:keydown="keymonitor"></textarea>
            </div>
            <div class="column is-full" style="padding-top:0px;">
                <div class="is-pulled-right chat-icons">
                    <!--<i class="fas fa-smile"></i>
                    <a href="#" data-show="quickview" data-target="responsesView">
                        <i class="fas fa-comment-dots"></i>
                    </a>

                    <i class="fas fa-paperclip"></i>
                    <i class="fas fa-download"></i>-->

                </div>
            </div>
        </section>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.CloseChat, (e) => {
                this.disableInput();
            });

            hooks.Register(events.Connection.ChatClosed, (e) => {
                if(Object.keys(state.currentChat).length > 0 && e.Data == state.currentChat.ChatUID) {
                    this.disableInput();
                }
            });

            hooks.Register(events.Chat.AcceptChat, (e) => {
                this.enableInput();
            });
        },
        methods: {
            disableInput() {
                var input = document.getElementById("inputArea");
                input.disabled = true;
            },
            enableInput() {
                var input = document.getElementById("inputArea");
                input.disabled = false;
            },
            keymonitor(event) {
                if (event.shiftKey == false && event.keyCode == 13)
                {
                    var inputArea = document.getElementById("inputArea");
                    var text = inputArea.value.trim();
                    if (text.length > 0)
                    {
                        hooks.Call(chatEvents.SendMessage, { "ChatId": services.Store.state.currentChat.ChatUID, "Num": services.Store.state.currentChat.Number, "Text": text});
                        inputArea.value = "";
                    }
                    event.preventDefault();
                }
            }
        }
    });
})(woServices);