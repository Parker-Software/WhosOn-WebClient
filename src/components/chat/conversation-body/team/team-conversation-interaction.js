(function(services){
    var hooks       = services.Hooks;
    var events      = services.HookEvents;
    var state       = services.Store.state;
    var connection  = services.WhosOnConn;

    Vue.component("team-conversation-interaction", {
        props: {
            user: {
                default: null,
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
                Id: elementId(),
                FileId: elementId(),
                AttachedFile: null,
                ShowingEmojiMenu: false,
                ShowingCannedResponses: false,
                ShowingFiles: false,
            }
        },
        template: `
            <section v-bind:id="Id" class="reply-container">
                <emoji-menu v-if="ShowingEmojiMenu" v-on:Clicked="EmojiClicked"></emoji-menu>
                <fileMenu :id="FileId" v-bind:class="{'is-hidden': !ShowingFiles}"></fileMenu>
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

        },
        methods: {
            InputArea() {
                return document.querySelector(`#${this.Id} #inputArea`);
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
            OnKeyDown() {

            }
        }
    });
})(woServices);