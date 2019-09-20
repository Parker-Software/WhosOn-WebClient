(function(services){
    Vue.component('chatConversationVisitor', {
        template: `
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
        `
    });
})(woServices);