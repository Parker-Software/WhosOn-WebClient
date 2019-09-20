(function(services){
    Vue.component('chatConversationOperator', {
        template: `
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
        `
    });
})(woServices);