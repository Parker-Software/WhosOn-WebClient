(function(services){
    Vue.component("chatTabContent", {
        template: `
        <div style="width:100%; height:100%">
            <chatModal></chatModal>
            <chatConversation></chatConversation>
        </div>
        `
    });
})(woServices);