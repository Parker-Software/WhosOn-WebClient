(function(services){
    Vue.component('homeChatArea', {
        template: `
            <div class="column is-9 chat-area" id="homeChatArea">
                <div class="">
                    <chatHeader></chatHeader>
                    <chatTabs></chatTabs>
                </div>

                <chatTabContent></chatTabContent> 
            </div>
            `
    });
})(woServices);