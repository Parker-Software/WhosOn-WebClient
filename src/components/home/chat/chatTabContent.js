(function(services){
    Vue.component('chatTabContent', {
        template: `
        <div style="width:100%; height:100%">
            <chatConversation></chatConversation>
            <crmWindow></crmWindow>
        </div>
        `
    });
})(woServices);