(function(services){
    Vue.component('chatTabs', {
        template: `
        <div class="tabs">
            <ul>
                <li class="is-active"><a>Conversation</a></li>
                <!--<li><a>Previous Chats</a></li>
                <li><a>Visitor</a></li>
                <li><a>Contact</a></li>-->
                <li><a>CRM</a></li>
            </ul>
        </div>
        `
    });
})(woServices);