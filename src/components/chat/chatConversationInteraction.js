(function(services){
    Vue.component('chatConversationInteraction', {
        template: `
        <section class="reply-container">
            <div class="column is-full visitor-typing">
                <span>{visitorname} is typing...</span>
            </div>
            <div class="column is-full">
                <textarea class="textarea" placeholder="Enter your reply"
                    style="resize: none;"></textarea>
            </div>
            <div class="column is-full" style="padding-top:0px;">
                <div class="is-pulled-right chat-icons">
                    <!--<i class="fas fa-smile"></i>
                    <a href="#" data-show="quickview" data-target="responsesView">
                        <i class="fas fa-comment-dots"></i>
                    </a>

                    <i class="fas fa-paperclip"></i>
                    <i class="fas fa-download"></i>-->

                </div>
            </div>
        </section>
        `
    });
})(woServices);