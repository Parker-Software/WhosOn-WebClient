(function(services){
    Vue.component('chatTabContent', {
        template: `
        <div style="width:100%; height:100%">
            <homeCloseChat></homeCloseChat>
            <chatConversation></chatConversation>
        </div>
        `
    });
})(woServices);