(function(services){
    var self = this;

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var chatEvents = events.Chat;
    var state = services.Store.state;
    var connection =services.WhosOnConn;

    var sendingTypingStatus = false;
    var typingStatusTimer = null;

    Vue.component("chatConversationInteraction", {
        data: function() {
            return {
                HasSuggestion: false,
                AttachedFile: null,
                CurrentlyTypingNameMonitored: "",
                ShowingEmojiMenu: false,
                ShowingCannedResponses: false,
                ShowingFiles: false,
            }
        },
        template: `
        <section class="reply-container">
            <emojiMenu v-if="ShowingEmojiMenu"></emojiMenu>
            <fileMenu v-bind:class="{'is-hidden': !ShowingFiles}"></fileMenu>
            <div class="column is-full visitor-typing" v-if="$store.state.currentChatTypingstate && BeingMonitoredByYou == false">
                <span>{{$store.state.currentChat.Name}} is typing</span>
            </div>
            <div class="column is-full visitor-typing" v-if="$store.state.currentChatTypingstate && BeingMonitoredByYou">
                <span>{{this.CurrentlyTypingNameMonitored}} is typing</span>
            </div>
            <div class="column is-full" style="padding-top:0.5rem;">
                <div id="inputArea" v-bind:class="{'beingMonitored':BeingMonitoredByYou}" class="textarea" contenteditable="true"  placeholder="Enter your reply"
                    style="resize: none;" v-on:keydown="keymonitor" @focus="hideEmojiMenuOnFocus()"></div>
            </div>
            <div class="column is-full" style="padding-top:0px;">
                <div class="is-pulled-right chat-icons" style="position:relative">
                 
                    <button v-if="$store.state.currentChatSite.AllowEmoji" id="emojiBtn" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Emoji's" v-bind:class="{'is-info':ShowingEmojiMenu}" v-on:click="emojiBtnClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="far fa-smile"></i>
                    </button>
                    <button id="cannedResponsesBtn" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Canned Responses" v-bind:class="{'is-info':ShowingCannedResponses}" v-on:click="cannedResponsesClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="far fa-comment-dots"></i>
                    </button>
                    <button v-if="BeingMonitoredByYou == false" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Send File" v-bind:class="{'is-info':ShowingFiles}" id="sendFileBtn" v-on:click="sendFileClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-paperclip"></i>
                    </button>
                    <button v-if="BeingMonitoredByYou == false" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Request File From Visitor" id="requestFileBtn" v-on:click="requestFileClicked" data-show="quickview" data-target="responsesView" disabled>
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
            <!--<fileUploader></fileUploader>-->         
        </section>
        `,
        beforeCreate() {

            hooks.Register(events.FileUploader.Yes, (e) => { 
                this.ShowingFiles = false;
            });

            hooks.Register(events.FileUploader.Successful, (e) => {
                this.ShowingFiles = false;
            });

            hooks.Register(events.Connection.MonitoredOperatorTyping, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    state.currentChatTypingstate = true;
                    this.CurrentlyTypingNameMonitored = name;
                }
            });
            hooks.Register(events.Connection.MonitoredOperatorTypingOff, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    state.currentChatTypingstate = false;
                    this.CurrentlyTypingNameMonitored = name;
                }
            });
            hooks.Register(events.Connection.MonitoredVisitorTyping, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    state.currentChatTypingstate = true;
                    this.CurrentlyTypingNameMonitored = state.currentChat.Name;
                }
            });
            hooks.Register(events.Connection.MonitoredVisitorTypingOff, (e) => {
                var msg = e;
                var info = msg.Data.split(":");
                var chatNum = info[0];
                var name = info[1];
                if(state.currentChat.Number == chatNum) {
                    state.currentChatTypingstate = false;
                    this.CurrentlyTypingNameMonitored = state.currentChat.Name;
                }
            });

            hooks.Register(events.ChatModal.CloseChatConfirmed, (e) => {
                this.disableInput();
            });

            hooks.Register(events.Chat.CannedResponsesClosed, () => {
                this.ShowingCannedResponses = false;
            });

            hooks.Register(events.Chat.PickAFileClosed, () => {
                this.ShowingFiles = false
            });

            hooks.Register(events.Connection.CurrentChatClosed, (e) => {
                this.disableInput();
                if(this.emojiBtn() != null) {this.emojiBtn().setAttribute("disabled", true);}
                this.cannedResponsesBtn().setAttribute("disabled", true);
                if(this.sendFileBtn() != null) {this.sendFileBtn().setAttribute("disabled", true);}
                if(this.requestFileBtn() != null) {this.requestFileBtn().setAttribute("disabled", true);}

                this.InputArea().innerText = "";

                this.ShowingEmojiMenu = false;
                this.ShowingCannedResponses = false;
                this.ShowingFiles = false
            });

            hooks.Register(events.ChatItem.AcceptClicked, (e) => {
                var self = this;
                this.HasSuggestion = false;
                this.AttachedFile = null;
                
                this.InputArea().innerText = "";
                this.enableInput();
                setTimeout(function() {
                    if(self.emojiBtn() != null) {self.emojiBtn().removeAttribute("disabled");}
                    self.cannedResponsesBtn().removeAttribute("disabled");
                    self.sendFileBtn().removeAttribute("disabled");
                    self.requestFileBtn().removeAttribute("disabled");
                }, 100);

            });

            hooks.Register(events.Connection.ChatChanged, (e) => {
                if(this.$store.state.currentChat.ChatUID == e.Data.ChatUID) {
                    if(this.$store.state.currentChatMessages.length <= 0 || (
                        this.$store.state.currentChatMessages.length == 1 && this.$store.state.currentChatMessages[0].code == 99)) {
                            if(this.InputArea().innerText == "") {

                                var finalGreetings = this.$store.state.settings.Greeting;
                                var currentTime = new Date();

                                finalGreetings = finalGreetings.replace(/%TimeOfDay%/g, `${currentTime.getHours() < 12 ? "Morning" : "Afternoon"}`);
                                finalGreetings = finalGreetings.replace(/%Name%/g, this.$store.state.currentChat.Name);
                                finalGreetings = finalGreetings.replace(/%MyName%/g, this.$store.state.userInfo !== null ? this.$store.state.userInfo.Name : this.$store.state.userName);
                                this.InputArea().innerText = finalGreetings;
                                this.InputArea().focus();
                            }
                    }
                }
            });

            hooks.Register(events.Connection.MonitoredChat, (e) => {
                this.HasSuggestion = false;
                this.AttachedFile = null;
                
                this.InputArea().innerText = "";
                this.enableInput();
                if(this.emojiBtn() != null) {this.emojiBtn().removeAttribute("disabled");}
                this.cannedResponsesBtn().removeAttribute("disabled");
            });

            hooks.Register(events.ChatItem.MonitorClicked, (e) => {
                this.HasSuggestion = false;
                this.AttachedFile = null;
                
                this.InputArea().innerText = "";
                this.enableInput();
                if(this.emojiBtn() != null) {this.emojiBtn().removeAttribute("disabled");}
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

            
            hooks.Register(events.CannedResponses.Clicked, (e) => {
                var {item, event} = e;
                var content = item.Content;
                if(item.Attachments != "") {
                    this.AttachedFile = state.uploadedFiles.find(x => x.HashedFileName == item.Attachments);
                    if(this.AttachedFile) {content += ` <span spellcheck="false" contenteditable="false" class="tag attachedFileToMessage noselect">${this.AttachedFile.FileName}</span>`;}
                } else {
                    this.AttachedFile = null;
                }

                this.InputArea().innerHTML = event.ctrlKey ? `${this.InputArea().innerHTML}  ${content}` : content;
                this.HasSuggestion = true;
                this.InputArea().focus();
            });

            hooks.Register(events.EmojiMenu.Clicked, (emoji) => {
                var oldContent = this.InputArea().innerHTML;
                this.InputArea().innerHTML = oldContent + emoji;
                this.InputArea().focus();
                document.execCommand("selectAll", false, null);
                document.getSelection().collapseToEnd();
            });
        },
        computed: {
            BeingMonitoredByYou() {
                return state.currentChat.BeingMonitoredByYou;
            }
        },
        methods: {
            hideEmojiMenuOnFocus() {                
                if(this.ShowingEmojiMenu){
                    this.ShowingEmojiMenu = false;
                    hooks.Call(events.Chat.EmojiMenuClicked);
                }
            },
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
                this.ShowingEmojiMenu = !this.ShowingEmojiMenu;
                this.ShowingCannedResponses = false;
                this.ShowingFiles = false;
                hooks.Call(events.Chat.EmojiMenuClicked);
            },
            cannedResponsesClicked() {
                this.ShowingCannedResponses = !this.ShowingCannedResponses;
                this.ShowingEmojiMenu = false;
                this.ShowingFiles = false;
                hooks.Call(events.Chat.CannedResponsesClicked);
            },
            sendFileClicked() {
                this.ShowingFiles = !this.ShowingFiles;
                this.ShowingEmojiMenu = false;
                this.ShowingCannedResponses = false;
                hooks.Call(events.Chat.SendFileClicked);
            },
            requestFileClicked() {
                connection.RequestFile(state.currentChat.Number);
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
                    this.ShowingEmojiMenu = false;


                    var text = this.InputArea().innerHTML.trim();
                    if (text.length > 0)
                    {
                        if(this.HasSuggestion) {
                            if(this.AttachedFile != null) {
                                var idx = text.indexOf("<span spellcheck=\"false\" contenteditable=\"false\" class=\"tag attachedFileToMessage noselect\">");
                                text = text.substring(0, idx);

                                var url =  `${state.webChartsURL}document.aspx?f=${this.AttachedFile.HashedFileName}`;
                                connection.SendFile(state.currentChat.Number, this.AttachedFile.FileName, url);
                                var msg = {code:1, msg:`<link><name>${this.AttachedFile.FileName}</name><url>${url}</url></link>`, date: getDate(new Date()), isLink: true};
                                
                                if(state.chatMessages[state.currentChat.ChatUID] == null) {state.chatMessages[state.currentChat.ChatUID] = [];}
                                state.chatMessages[state.currentChat.ChatUID].push(msg);
                                state.currentChatMessages.push(msg);
                                this.AttachedFile = null;
                            }

                            hooks.Call(events.Chat.SuggestionSent);
                            this.HasSuggestion = false;
                        }

                        stopTypingStatus();
                        hooks.Call(chatEvents.SendMessage, { "ChatId": state.currentChat.ChatUID,
                            "Num": state.currentChat.Number,
                            "Text": this.InputArea().innerText.trim(),
                            "Whisper": state.currentChat.BeingMonitoredByYou,
                            "ToConnection": state.currentChat.TalkingToClientConnection});
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

                this.ShowingFiles = false;
                this.ShowingEmojiMenu = false;
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