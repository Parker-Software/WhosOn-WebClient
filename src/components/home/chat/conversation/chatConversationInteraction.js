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
        data: function() {
            return {
                HasSuggestion: false,
                AttachedFile: null,
            }
        },
        template: `
        <section class="reply-container">
            <div class="column is-full visitor-typing" v-if="this.$store.state.currentChatTypingstate">
                <span>{{this.$store.state.currentChat.Name}} is typing...</span>
            </div>
            <div class="column is-full">
                <div id="inputArea" v-bind:class="{'beingMonitored':BeingMonitoredByYou}" class="textarea" contenteditable="true"  placeholder="Enter your reply"
                    style="resize: none;" v-on:keydown="keymonitor"></div>
            </div>
            <div class="column is-full" style="padding-top:0px;">
                <div class="is-pulled-right chat-icons">
                    <a id="emojiBtn" v-on:click="emojiBtnClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-smile"></i>
                    </a>
                    <a id="cannedResponsesBtn" v-on:click="cannedResponsesClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-comment-dots"></i>
                    </a>
                    <a v-if="BeingMonitoredByYou == false" id="sendFileBtn" v-on:click="sendFileClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-paperclip"></i>
                    </a>
                    <a v-if="BeingMonitoredByYou == false" id="requestFileBtn" v-on:click="requestFileClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            </div>
            <fileUploader></fileUploader>
            <transfer></transfer>
        </section>
        `,
        beforeCreate() {
            hooks.Register(events.Chat.CloseChat, (e) => {
                this.disableInput();
            });

            hooks.Register(events.Connection.CurrentChatClosed, (e) => {
                this.disableInput();
                this.emojiBtn().setAttribute("disabled", true);
                this.cannedResponsesBtn().setAttribute("disabled", true);
                if(this.sendFileBtn() != null) this.sendFileBtn().setAttribute("disabled", true);
                if(this.requestFileBtn() != null) this.requestFileBtn().setAttribute("disabled", true);

                this.InputArea().innerText = "";
            });

            hooks.Register(events.Connection.ChatAccepted, (e) => {
                this.HasSuggestion = false;
                this.AttachedFile = null;
                
                this.InputArea().innerText = "";
                this.enableInput();
                this.emojiBtn().removeAttribute("disabled");
                this.cannedResponsesBtn().removeAttribute("disabled");
                if(this.sendFileBtn() != null) this.sendFileBtn().removeAttribute("disabled");
                if(this.requestFileBtn() != null) this.requestFileBtn().removeAttribute("disabled");
            });

            hooks.Register(events.Connection.MonitoredChat, (e) => {
                this.HasSuggestion = false;
                this.AttachedFile = null;
                
                this.InputArea().innerText = "";
                this.enableInput();
                this.emojiBtn().removeAttribute("disabled");
                this.cannedResponsesBtn().removeAttribute("disabled");
            });

            
            hooks.Register(events.Chat.SuggestionFromServer, (msg) => {
                var attachmentStartTag = "<Attachment>";
                var attachmentEndTag = "</Attachment>";
                var content = msg;
                var hasAttachedment = msg.indexOf(attachmentStartTag);
                if(hasAttachedment != -1) {
                    var endingTagIdx = msg.indexOf(attachmentEndTag);
                    var hashedFileName = content.substring(hasAttachedment + attachmentStartTag.length, endingTagIdx);
                    this.AttachedFile = state.uploadedFiles.find(x => x.HashedFileName == hashedFileName);
                    content = content.substring(0, hasAttachedment);
                    content += ` <span spellcheck="false" contenteditable="false" class="tag attachedFileToMessage noselect">${this.AttachedFile.FileName}</span>`;
                } else {
                    this.AttachedFile = null;
                }

                this.InputArea().innerHTML = content;
                this.HasSuggestion = true;
                this.InputArea().focus();
            });

            
            hooks.Register(events.CannedResponses.Clicked, (item) => {
                var content = item.Content;

                if(item.Attachments != "") {
                    this.AttachedFile = state.uploadedFiles.find(x => x.HashedFileName == item.Attachments);
                    content += ` <span spellcheck="false" contenteditable="false" class="tag attachedFileToMessage noselect">${this.AttachedFile.FileName}</span>`;
                } else {
                    this.AttachedFile = null;
                }

                this.InputArea().innerHTML = content;
                this.HasSuggestion = true;
                this.InputArea().focus();
            });
        },
        computed: {
            BeingMonitoredByYou() {
                return this.$store.state.currentChat.BeingMonitoredByYou;
            }
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
                hooks.Call(events.Chat.CannedResponsesClicked);
            },
            sendFileClicked() {
                hooks.Call(events.Chat.SendFileClicked);
            },
            requestFileClicked() {
                connection.RequestFile(this.$store.state.currentChat.Number);
                hooks.Call(events.Chat.RequestedFileUpload);
            },
            InputArea() {
                return document.getElementById("inputArea");
            },
            disableInput() {
                this.InputArea().setAttribute("contenteditable", false);
                this.InputArea().setAttribute("disabled",true);
            },
            enableInput() {
                this.InputArea().setAttribute("contenteditable", true);
                this.InputArea().removeAttribute("disabled");
            },
            keymonitor(event) {
                if (event.shiftKey == false && event.keyCode == 13)
                {
                    var text = this.InputArea().innerHTML.trim();
                    if (text.length > 0)
                    {
                        if(this.HasSuggestion) {
                            if(this.AttachedFile != null) {
                                var idx = text.indexOf(`<span spellcheck="false" contenteditable="false" class="tag attachedFileToMessage noselect">`);
                                text = text.substring(0, idx);

                                var url =  `${state.webChartsURL}document.aspx?f=${this.AttachedFile.HashedFileName}`;
                                connection.SendFile(state.currentChat.Number, this.AttachedFile.FileName, url);
                                var msg = {code:1, msg:`<link><name>${this.AttachedFile.FileName}</name><url>${url}</url></link>`, date: getDate(new Date()), isLink: true};
                                
                                if(state.chatMessages[this.$store.state.currentChat.ChatUID] == null) state.chatMessages[this.$store.state.currentChat.ChatUID] = [];
                                state.chatMessages[this.$store.state.currentChat.ChatUID].push(msg);
                                state.currentChatMessages.push(msg);
                                this.AttachedFile = null;
                            }

                            hooks.Call(events.Chat.SuggestionSent);
                            this.HasSuggestion = false;
                        }

                        stopTypingStatus();
                        hooks.Call(chatEvents.SendMessage, { "ChatId": services.Store.state.currentChat.ChatUID, "Num": services.Store.state.currentChat.Number, "Text": text});
                        this.InputArea().innerText = "";
                    }
                    event.preventDefault();
                } else if(event.ctrlKey == false) {
                    if(this.HasSuggestion) {
                        this.InputArea().innerText = "";
                        hooks.Call(events.Chat.SuggestionNotUsed);
                        this.HasSuggestion = false;
                        this.AttachedFile = null;
                    }

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