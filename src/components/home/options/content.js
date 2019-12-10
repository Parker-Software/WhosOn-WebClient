(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('homeOptionsContent', {
        template: `
        <div id="homeOptionsContent" class="options-content">
            <homeOptionsContentGeneral id="optionsGeneralContent"></homeOptionsContentGeneral>
            <homeOptionsContentCannedResponses id="optionsCannedResponsesContent"></homeOptionsContentCannedResponses>
            <homeOptionsContentAbout id="optionsAboutContent"></homeOptionsContentAbout>
            <homeOptionsContentChangePassword id="optionsChangePasswordContent"></homeOptionsContentChangePassword>
            <homeOptionsContentChat id="optionsChatContent"></homeOptionsContentChat>
            <homeOptionsContentOffice id="optionsOfficeContent"></homeOptionsContentOffice>
        </div>
        `,
        mounted() {
            this.HideAll();
            this.GeneralContentElem().style.display = "block";
        },
        beforeCreate() {
            hooks.Register(events.Options.TabClicked, (tab) => {
                this.HideAll();
                switch(tab) {
                    case "general":
                        this.GeneralContentElem().style.display = "block";
                        break;
                    case "cannedResponses":
                        this.CannedResponsesContentElem().style.display = "block";
                        break;
                    case "chat":
                        this.ChatElem().style.display = "block";
                        break;
                    case "office":
                        this.OfficeElem().style.display = "block";
                        break;
                    case "changePassword":
                        this.ChangePasswordElem().style.display = "block";
                        break;
                    case "about":
                        this.AboutContentElem().style.display = "block";
                        break;
                }
            });
        },
        methods: {
            HideAll() {
                this.GeneralContentElem().style.display = "none";
                this.CannedResponsesContentElem().style.display = "none";
                this.AboutContentElem().style.display = "none";
                this.ChangePasswordElem().style.display = "none";
                this.ChatElem().style.display = "none";
                this.OfficeElem().style.display = "none";
            },
            GeneralContentElem() {
                return document.getElementById("optionsGeneralContent");
            },
            CannedResponsesContentElem() {
                return document.getElementById("optionsCannedResponsesContent");
            },
            AboutContentElem() {
                return document.getElementById("optionsAboutContent");
            },
            ChangePasswordElem() {
                return document.getElementById("optionsChangePasswordContent");
            },
            ChatElem() {
                return document.getElementById("optionsChatContent");
            },
            OfficeElem() {
                return document.getElementById("optionsOfficeContent");
            }
        }
    });
})(woServices);