(function(services){
    var self = this;

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    var state = services.Store.state;
    var connection =services.WhosOnConn;

    var sendingTypingStatus = false;
    var typingStatusTimer = null;

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
                    <a id="emojiBtn" v-on:click="emojiBtnClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-smile"></i>
                    </a>
                    <a id="cannedResponsesBtn" v-on:click="cannedResponsesClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-comment-dots"></i>
                    </a>
                    <a id="sendFileBtn" v-on:click="sendFileClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-paperclip"></i>
                    </a>
                    <a id="requestFileBtn" v-on:click="requestFileClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            </div>
            <fileUploader></fileUploader>
        </section>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.CloseChat, (e) => {
                this.disableInput();
         
            });
            hooks.Register(events.Connection.ChatClosed, (e) => {
                if(Object.keys(state.currentChat).length > 0 && e.Data == state.currentChat.ChatUID) {
                    this.disableInput();
                    this.emojiBtn().setAttribute("disabled", true);
                    this.cannedResponsesBtn().setAttribute("disabled", true);
                    this.sendFileBtn().setAttribute("disabled", true);
                    this.requestFileBtn().setAttribute("disabled", true);

                    hooks.Call(events.FileUploader.Hide);
                }
            });

            hooks.Register(events.Chat.AcceptChat, (e) => {
                this.enableInput();
                this.emojiBtn().removeAttribute("disabled");
                this.cannedResponsesBtn().removeAttribute("disabled");
                this.sendFileBtn().removeAttribute("disabled");
                this.requestFileBtn().removeAttribute("disabled");
            });
        },
        methods: {
            emojiBtn() {
                return document.getElementById("emojiBtn");
            },
            cannedResponsesBtn() {
                return document.getElementById("cannedResponsesBtn");
            },
            sendFileBtn() {
                return document.getElementById("sendFileBtn");
            },
            requestFileBtn() {
                return document.getElementById("requestFileBtn");
            },
            emojiBtnClicked() {
                console.log("Open Emoji Menu");
            },
            cannedResponsesClicked() {
                console.log("Open CannedResposnes Menu");
            },
            sendFileClicked() {
                hooks.Call(events.Chat.SendFileClicked);
            },
            requestFileClicked() {
                hooks.Call(events.Chat.RequestedFileUpload);
                connection.RequestFile(this.$store.state.currentChat.Number);
            },
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
                        stopTypingStatus();
                        hooks.Call(chatEvents.SendMessage, { "ChatId": services.Store.state.currentChat.ChatUID, "Num": services.Store.state.currentChat.Number, "Text": text});
                        inputArea.value = "";
                    }
                    event.preventDefault();
                } else if(event.ctrlKey == false) {
                    if(sendingTypingStatus == false) {
                        this.sendTypingStatus();
                    }
                    clearTimeout(typingStatusTimer);
                    typingStatusTimer = setTimeout(() => {
                        stopTypingStatus();
                    }, 2000);
                }
            },
            sendTypingStatus() {
                sendingTypingStatus = true;
                services.WhosOnConn.SendTypingStatus(state.currentChat.Number);
            },
        }
    });


    function stopTypingStatus() {
        services.WhosOnConn.StopTypingStatus(state.currentChat.Number);

        sendingTypingStatus = false;
        clearTimeout(typingStatusTimer);
    }

})(woServices);