(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("optionsHeaderTabs", {
        template: `
            <div class="tabs options-tabs">
                <ul>
                    <li id="optionsGeneralTab" v-on:click="TabClicked('general')" class="is-active"><a>General</a></li>
                    <!--<li id="optionsCannedResponsesTab" v-on:click="TabClicked('cannedResponses')" class=""><a>My Canned Responses</a></li>-->
                    <li id="optionsChatTab" v-on:click="TabClicked('chat')" class=""><a>Chat</a></li>
                    <!--<li id="optionsOfficeTab" v-on:click="TabClicked('office')" class=""><a>Office 365</a></li>-->
                    <li id="optionsChangePasswordTab" v-on:click="TabClicked('changePassword')" class=""><a>Change Password</a></li>
                    <li id="optionsAboutTab" v-on:click="TabClicked('about')" class=""><a>About</a></li>
                </ul>
            </div>
        `,
        methods: {
            UnSelectAll() {
                if(this.GeneralElem()) {this.GeneralElem().classList.remove("is-active");}
                if(this.CannedResponsesElem()) {this.CannedResponsesElem().classList.remove("is-active");}
                if(this.ChatElem()) {this.ChatElem().classList.remove("is-active");}
                if(this.OfficeElem()) {this.OfficeElem().classList.remove("is-active");}
                if(this.ChangePasswordElem()) {this.ChangePasswordElem().classList.remove("is-active");}
                if(this.AboutElem()) {this.AboutElem().classList.remove("is-active");}
            },
            TabClicked(tab) {
                this.UnSelectAll();

                switch(tab) {
                    case "general":
                        this.GeneralElem().classList.add("is-active");
                        break;
                    case "cannedResponses":
                        this.CannedResponsesElem().classList.add("is-active");
                        break;
                    case "chat":
                        this.ChatElem().classList.add("is-active");
                        break;
                    case "office":
                        this.OfficeElem().classList.add("is-active");
                        break;
                    case "changePassword":
                        this.ChangePasswordElem().classList.add("is-active");
                        break;
                    case "about":
                        this.AboutElem().classList.add("is-active");
                        break;
                }
                hooks.call(events.Options.TabClicked, tab);
            },
            GeneralElem() {
                return document.getElementById("optionsGeneralTab");
            },
            CannedResponsesElem() {
                return document.getElementById("optionsCannedResponsesTab");
            },
            ChatElem() {
                return document.getElementById("optionsChatTab");
            },
            OfficeElem() {
                return document.getElementById("optionsOfficeTab");
            },
            ChangePasswordElem() {
                return document.getElementById("optionsChangePasswordTab");
            },
            AboutElem() {
                return document.getElementById("optionsAboutTab");
            }
        }
    });
})(woServices);