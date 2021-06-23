(function(services){
    var hooks       = services.Hooks;
    var events      = services.HookEvents;
    var state       = services.Store.state;
    var connection  = services.WhosOnConn;

    Vue.component("team-conversation-interaction", {
        props: {
            user: {
                default: null
            },
            disabled: {
                default: true
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
                ShowingEmojiMenu: false,
                ShowingCannedResponses: false,
                ShowingFiles: false,
            }
        },
        template: `
            <section id="team-conversation-interfaction" class="reply-container">
                <emoji-menu v-if="ShowingEmojiMenu" v-on:Clicked="EmojiClicked"></emoji-menu>
                <file-menu :show="ShowingFiles" :id="FileId" :files="$store.state.uploadedFiles" domain="" v-on:Send="SendFile"></file-menu>
                <div class="column is-full visitor-typing" v-if="showTyping">
                    <span>{{typingName}} is typing</span>
                </div>
                <div class="column is-full" style="padding-top:0.5rem;">
                    <div id="inputArea" class="textarea" contenteditable="true" placeholder="Enter your reply"
                        style="resize: none;" v-on:keydown="OnKeyDown" @focus="ShowingEmojiMenu = false"
                        v-bind:contenteditable="!disabled" v-bind:disabled="disabled">
                    </div>
                </div>
                <div class="column is-full" style="padding-top:0px;">
                    <div class="is-pulled-right chat-icons" style="position:relative">
                        <button v-if="$store.state.settings.ShowEmoji" class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Emoji's" v-bind:class="{'is-info':ShowingEmojiMenu}" v-on:click="EmojiBtnClicked" data-show="quickview" data-target="responsesView" v-bind:disabled="disabled">
                            <i class="far fa-smile"></i>
                        </button>
                        <button class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Canned Responses" v-bind:class="{'is-info':ShowingCannedResponses}" v-on:click="$emit('CannedReponsesClicked')" data-show="quickview" data-target="responsesView" v-bind:disabled="disabled">
                            <i class="far fa-comment-dots"></i>
                        </button>
                        <button class="emojiBtn emoji-icon has-tooltip-left" data-tooltip="Send File" v-bind:class="{'is-info':ShowingFiles}" v-on:click="SendFileClicked" data-show="quickview" data-target="responsesView" v-bind:disabled="disabled">
                            <i class="fas fa-paperclip"></i>
                        </button>
                    </div>
                </div>
            </section>
        `,
        beforeCreate() {
            hooks.register(events.Team.CannedResponses.Clicked, (e) => {
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

            hooks.register(events.Connection.UserDisconnecting, (e) => {
                var userConn = e.Data;
                if(userConn == this.user.Connection) {
                    this.ShowingCannedResponses = false;
                    this.ShowingEmojiMenu = false;
                    this.ShowingFiles = false;
                }
            });
        },
        methods: {
            InputArea() {
                return document.querySelector("#team-conversation-interfaction #inputArea");
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
            },

            SendFile(fileName, url) {
                this.ShowingFiles = false;
                this.$emit("SendFile", fileName, url);
            },

            OnKeyDown(event) {
                this.ShowingFiles = false;
                this.ShowingEmojiMenu = false;
                var content = this.InputArea().innerHTML.trim();
                var text = this.InputArea().innerText.trim();

                if (event.shiftKey == false &&
                    event.keyCode == 13 &&
                    content.length > 0)
                {
                    event.preventDefault();

                    var sendEvntArgs = {
                        Text: content
                    };

                    if (this.AttachedFile != null) {
                        sendEvntArgs["AttachedFile"] = this.AttachedFile;
                        this.AttachedFile = null;
                    }

                    this.$emit("Send", sendEvntArgs);
                    this.InputArea().innerText = "";
                } else if(event.ctrlKey == false) {
                    this.$emit("Typing", event, text);
                }
            }
        }
    });
})(woServices);