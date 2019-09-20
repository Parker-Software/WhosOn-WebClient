//TODO Needs breaking down into smaller components
(function(services){
    Vue.component('homeChatArea', {
        template: `
            <div class="column is-9 chat-area" id="homeChatArea" style="display:none">
                <div class="">
                    <div class="columns">
                        <div class="column is-narrow">
                            <figure class="image is-64x64">
                                <img src="https://bulma.io/images/placeholders/64x64.png" alt="Image"
                                    class="is-rounded">
                                <div class="status online"><i class="fas fa-circle"></i></div>
                            </figure>
                        </div>
                        <div class="column is-6">
                            <div class="chat-header" style="margin-top: 4px;">
                                <div class="content">
                                    <p>
                                        <strong>{visitorname}</strong> (Waiting) <br>
                                        <small>{sitename}</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="column is-5 .no-pad-right ">
                            <div class="chat-header-icons is-pulled-right">
                                <a href="#" class="tooltip" data-tooltip="Close this chat">
                                    <span class="fa-stack fa-2x">
                                        <i class="fas fa-circle fa-stack-2x"></i>
                                        <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                                    </span>
                                </a>

                                <a href="#" data-show="quickview" data-target="quickviewDefault" class="tooltip" data-tooltip="Show transfer list">
                                    <span class="fa-stack fa-2x">
                                        <i class="fas fa-circle fa-stack-2x"></i>
                                        <i class="fas fa-users fa-stack-1x fa-inverse white"></i>
                                    </span>
                                </a>
                                <a href="#" class="tooltip" data-tooltip="Request monitor">
                                    <span class="fa-stack fa-2x">
                                        <i class="fas fa-circle fa-stack-2x"></i>
                                        <i class="fas fa-graduation-cap fa-stack-1x fa-inverse white"></i>
                                    </span>
                                </a>
                                <a href="#" class="tooltip" data-tooltip="Email transcript">
                                    <span class="fa-stack fa-2x">
                                        <i class="fas fa-circle fa-stack-2x"></i>
                                        <i class="fas fa-envelope fa-stack-1x fa-inverse white"></i>
                                    </span>
                                </a>
                                <a href="#" class="tooltip" data-tooltip="Show block options">
                                    <span class="fa-stack fa-2x">
                                        <i class="fas fa-circle fa-stack-2x"></i>
                                        <i class="fas fa-ban fa-stack-1x fa-inverse white"></i>
                                    </span>
                                </a>



                            </div>
                        </div>
                    </div>
                    <div class="tabs">
                        <ul>
                            <li class="is-active"><a>Conversation</a></li>
                            <li><a>Previous Chats</a></li>
                            <li><a>Visitor</a></li>
                            <li><a>Contact</a></li>
                            <li><a>CRM</a></li>
                        </ul>
                    </div>

                </div>
                <div class="survey-block">
                    <div class="container is-fluid">
                        <h3 class="subtitle is-4">Survey Results</h3>
                        <div class="columns is-gapless">
                            <div class="column is-6">
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                            </div>
                            <div class="column is-6">
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                                <span class="is-flex"><strong>{surveyfield}</strong>: {surveyresult}</span>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="active-chat" id="Conversation">
                    <div class="columns is-desktop ">
                        <div class="column is-12 is-scrollable message-list">
                            <!-- Operator block -->
                            <div class="columns is-gapless">
                                <div class="column is-5"></div>
                                <div class="column is-6">
                                    <div class="notification operator">
                                        My oath is between Captain Kargan and myself. Your only concern is with
                                        how you obey my orders. Or do you prefer the rank of prisoner to that of
                                        lieutenant?
                                        I will obey your orders. I will serve this ship as First Officer. And in
                                        an attack against the Enterprise,
                                        I will die with this crew. But I will not break my oath of loyalty to
                                        Starfleet.
                                    </div>
                                </div>

                                <div class="column is-1 time-col"
                                    style="margin: auto;flex-direction: column;text-align: center;">
                                    11:03:46
                                </div>
                            </div>
                            <!-- Operator block End -->
                            <!-- Visitor block -->
                            <div class="columns is-gapless">
                                <div class="column is-6">
                                    <div class="notification visitor">
                                        But I will not break my oath of loyalty to Starfleet. This should be
                                        interesting.
                                        When has justice ever been as simple as a rule book? How long can two
                                        people talk about nothing?
                                    </div>
                                </div>
                                <div class="column is-5"></div>
                                <div class="column is-1 is-flex time-col"
                                    style="margin: auto;flex-direction: column;text-align: center;">
                                    <time>11:07:36</time>
                                </div>
                            </div>
                            <!-- Visitor block End -->
                            <!-- Operator block -->
                            <div class="columns is-gapless">
                                <div class="column is-5"></div>
                                <div class="column is-6">
                                    <div class="notification operator">
                                        Computer, belay that order. We could cause a diplomatic crisis. Take the
                                        ship into the Neutral Zone Is it my imagination, or have tempers become
                                        a little frayed on the ship lately?
                                    </div>
                                </div>

                                <div class="column is-1 time-col"
                                    style="margin: auto;flex-direction: column;text-align: center;">
                                    11:13:13
                                </div>
                            </div>
                            <!-- Operator block End -->
                            <!-- Operator block -->
                            <div class="columns is-gapless">
                                <div class="column is-5"></div>
                                <div class="column is-6">
                                    <div class="notification operator">
                                        Now we know what they mean by 'advanced' tactical training.
                                    </div>
                                </div>

                                <div class="column is-1 time-col"
                                    style="margin: auto;flex-direction: column;text-align: center;">
                                    11:16:36
                                </div>
                            </div>
                            <!-- Operator block End -->
                            <!-- Visitor block -->
                            <div class="columns is-gapless">
                                <div class="column is-6">
                                    <div class="notification visitor">
                                        I recommend you don't fire until you're within 40,000 kilometers.
                                        Captain, why are we out here chasing comets? Mr. Crusher, ready a
                                        collision course with the Borg ship.
                                    </div>
                                </div>
                                <div class="column is-5"></div>
                                <div class="column is-1 is-flex time-col"
                                    style="margin: auto;flex-direction: column;text-align: center;">
                                    <time>11:20:21</time>
                                </div>
                            </div>
                            <!-- Visitor block End -->
                            <!-- Operator block -->
                            <div class="columns is-gapless">
                                <div class="column is-5"></div>
                                <div class="column is-6">
                                    <div class="notification operator">
                                        The Federation's gone; the Borg is everywhere!
                                        Some days you get the bear, and some days the bear gets you. Sorry,
                                        Data.
                                        What? We're not at all alike!
                                    </div>
                                </div>

                                <div class="column is-1 time-col"
                                    style="margin: auto;flex-direction: column;text-align: center;">
                                    11:16:36
                                </div>
                            </div>
                            <!-- Operator block End -->
                            <!-- Operator block -->
                            <div class="columns is-gapless">
                                <div class="column is-5"></div>
                                <div class="column is-6">
                                    <div class="notification operator">
                                        Your head is not an artifact! When has justice ever been as simple as a
                                        rule book?
                                        Why don't we just give everybody a promotion and call it a night -
                                        'Commander'? A surprise party? Mr. Worf, I hate surprise parties. I
                                        would *never* do that to you.
                                    </div>
                                </div>

                                <div class="column is-1 time-col"
                                    style="margin: auto;flex-direction: column;text-align: center;">
                                    11:22:36
                                </div>
                            </div>
                            <!-- Operator block End -->
                        </div>

                    </div>

                </div>
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
                            <i class="fas fa-smile"></i>
                            <a href="#" data-show="quickview" data-target="responsesView">
                                <i class="fas fa-comment-dots"></i>
                            </a>

                            <i class="fas fa-paperclip"></i>
                            <i class="fas fa-download"></i>

                        </div>
                    </div>
                </section>
            </div>
            `
    });
})(woServices);