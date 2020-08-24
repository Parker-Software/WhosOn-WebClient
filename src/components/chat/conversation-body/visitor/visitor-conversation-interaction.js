(function(services){
    var hooks       = services.Hooks;
    var events      = services.HookEvents;
    var state       = services.Store.state;
    var connection  = services.WhosOnConn;

    Vue.component("visitor-conversation-interaction", {
        props: {
            id: {
                default: elementId(),
            },
            site: {
                default: null,
            },
            chat: {
                default: null,
            },
            monitoring: {
                default: false,
            },
            disabled: {
                default: false
            },
            hasSuggestion: {
                default: false
            },
            showTyping: {
                default: false
            },
            typingName: {
                default: ""
            }
        },
        data: function() {
            return {
                FileId: elementId(),
                AttachedFile: null,
                CurrentlyTypingNameMonitored: "",
                ShowingEmojiMenu: false,
                ShowingCannedResponses: false,
                ShowingFiles: false,
            }
        },
        template: `
            <section v-bind:id="id" class="reply-container">
                <emoji-menu v-if="ShowingEmojiMenu" v-on:Clicked="EmojiClicked"></emoji-menu>
                <file-menu :show="ShowingFiles" :id="FileId" :files="$store.state.uploadedFiles" :domain="$store.state.currentChat.Domain" v-on:Send="SendFile"></file-menu>
                <div class="column is-full visitor-typing" v-if="showTyping">
                    <span>{{typingName}} is typing</span>
                </div>
                <div class="column is-full" style="padding-top:0.5rem;">
                    <div id="inputArea" v-bind:class="{'beingMonitored':monitoring}" class="textarea" contenteditable="true" placeholder="Enter your reply"
                        style="resize: none;" v-on:keydown="OnKeyDown" v-on:keyup="OnKeyUp" @focus="ShowingEmojiMenu = false"
                        v-bind:contenteditable="!disabled" v-bind:disabled="disabled">
                    </div>
                </div>
                <div class="column is-full" style="padding-top:0px;">
                    <div class="is-pulled-right chat-icons" style="position:relative">
                        <button v-if="site != null && site.AllowEmoji && $store.state.settings.ShowEmoji" id="emojiBtn" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Emoji's" v-bind:class="{'is-info':ShowingEmojiMenu}" v-on:click="EmojiBtnClicked" data-show="quickview" data-target="responsesView" v-bind:disabled="disabled">
                            <i class="far fa-smile"></i>
                        </button>
                        <button class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Canned Responses" v-bind:class="{'is-info':ShowingCannedResponses}" v-on:click="$emit('CannedReponsesClicked')" data-show="quickview" data-target="responsesView" v-bind:disabled="disabled">
                            <i class="far fa-comment-dots"></i>
                        </button>
                        <button v-if="monitoring == false" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Send File" v-bind:class="{'is-info':ShowingFiles}" v-on:click="SendFileClicked" data-show="quickview" data-target="responsesView" v-bind:disabled="disabled">
                            <i class="fas fa-paperclip"></i>
                        </button>
                        <button v-if="monitoring == false" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Request File From Visitor" v-on:click="RequestFileClicked" data-show="quickview" data-target="responsesView" v-bind:disabled="disabled">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </section>
        `,
        beforeCreate() {
            hooks.Register(events.Connection.CurrentChatClosed, (e) => {
                this.ShowingEmojiMenu = false;
                this.ShowingCannedResponses = false;
                this.ShowingFiles = false
            });

            hooks.Register(events.Chat.CannedResponsesClosed, () => {
                this.ShowingCannedResponses = false;
            });

            hooks.Register(events.Chat.PickAFileClosed, () => {
                this.ShowingFiles = false
            });

            hooks.Register(events.ChatItem.AcceptClicked, (e) => {
                this.AttachedFile = null;
            });

           hooks.Register(events.Connection.MonitoredChat, (e) => {
                this.AttachedFile = null;
            });

            hooks.Register(events.ChatItem.MonitorClicked, (e) => {
                this.AttachedFile = null;
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
                this.InputArea().focus();
            });
            
            hooks.Register(events.Chat.CannedResponses.Clicked, (e) => {
                var {item, event} = e;
                var content = item.Content;
                if(item.Attachments != "") {
                    this.AttachedFile = state.uploadedFiles.find(x => x.HashedFileName == item.Attachments);
                    if(this.AttachedFile) {content += ` <span spellcheck="false" contenteditable="false" class="tag attachedFileToMessage noselect">${this.AttachedFile.FileName}</span>`;}
                } else {
                    this.AttachedFile = null;
                }

                this.InputArea().innerHTML = event.ctrlKey ? `${this.InputArea().innerHTML}  ${content}` : content;
                this.InputArea().focus();
            });

            hooks.Register(events.Connection.ChatChanged, (e) => {
                if(this.chat.ChatUID == e.Data.ChatUID && this.InputArea()) {

                    let hasPreviousChatInput = this.chat.SavedInputText;

                    if(hasPreviousChatInput) {
                        this.InputArea().innerText = hasPreviousChatInput;

                    } else {
                        let greetings = this.$store.state.settings.Greeting;
                        var currentTime = new Date();
                        greetings = greetings.replace(/%TimeOfDay%/g, `${currentTime.getHours() < 12 ? "Morning" : "Afternoon"}`);
                        greetings = greetings.replace(/%Name%/g, this.$store.state.currentChat.Name);
                        greetings = greetings.replace(/%MyName%/g, this.$store.state.userInfo !== null ? this.$store.state.userInfo.Name : this.$store.state.userName);
                        
                        let opMessage = this.$store.state.currentChatMessages.find(x => x.code != 99 && x.code != 0);

                        if(
                            this.$store.state.currentChatMessages.length <= 0 || 
                            opMessage == null
                        ) {
                                if (this.InputArea().innerText == "") {
                                    this.InputArea().innerText = greetings;
                                }
                        }

                    }
                   

                    this.InputArea().focus();
                }
            });
        },
        methods: { 
            InputArea() {
                return document.querySelector(`#${this.id} #inputArea`);
            },

            EmojiClicked(emoji) {
                var oldContent = this.InputArea().innerHTML;
                this.InputArea().innerHTML = `${oldContent} ${emoji}`;
                this.InputArea().focus();
                document.execCommand("selectAll", false, null);
                document.getSelection().collapseToEnd();
            },

            EmojiBtnClicked() {
                this.ShowingEmojiMenu = !this.ShowingEmojiMenu;
                this.ShowingCannedResponses = false;
                this.ShowingFiles = false;
            },

            SendFileClicked() {
                this.ShowingFiles = !this.ShowingFiles;
                this.ShowingEmojiMenu = false;
                this.ShowingCannedResponses = false;
                hooks.Call(events.Chat.SendFileClicked);
            },

            RequestFileClicked() {
                connection.RequestFile(state.currentChat.Number);
                hooks.Call(events.Chat.RequestedFileUpload);
            },

            SendFile(fileName, url) {
                this.ShowingFiles = false;
                connection.SendFile(state.currentChat.Number,
                    fileName,
                    url
                );

                var msg = {code:1, msg:`<link><name>${fileName}</name><url>${url}</url></link>`, date: getDate(new Date()), isLink: true};

                if(state.chatMessages[state.currentChat.ChatUID] == null) {state.chatMessages[state.currentChat.ChatUID] = [];}
                state.chatMessages[state.currentChat.ChatUID].push(msg);
                state.currentChatMessages.push(msg);
            },

            OnKeyDown(event) {
                this.ShowingFiles = false;
                this.ShowingEmojiMenu = false;
                var content = this.InputArea().innerHTML.trim();
                var text = this.InputArea().innerText.trim();

                if (event.shiftKey == false &&
                    event.keyCode == 13 &&
                    text.length > 0)
                {
                    if(this.hasSuggestion == false) {
                        content = text;
                    } 


                    event.preventDefault();
                    var sendEvntArgs = {
                        ChatId: this.chat.ChatUID,
                        Suggestion: this.hasSuggestion,
                        ChatNumber: this.chat.Number,
                        Text: content,
                        Whisper: this.monitoring,
                        To: this.chat.TalkingToClientConnection,
                    };
                    
                    if (this.AttachedFile != null) {
                        sendEvntArgs["AttachedFile"] = this.AttachedFile;
                        this.AttachedFile = null;
                    }
                    this.$emit("Send", sendEvntArgs);
                    this.InputArea().innerText = "";
                } else if(event.ctrlKey == false) {
                    this.$emit("Typing", event, text);
                    if(this.hasSuggestion) {
                        this.InputArea().innerText = "";
                    }
                }
            },

            OnKeyUp(event) {
                var text = this.InputArea().innerText.trim();
                let chat = this.$store.state.chats.find(x => x.ChatUID == this.chat.ChatUID);
                chat.SavedInputText = text;
            }
        }
    });
})(woServices);