(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("conversationWrapUp", {
        props: [
            "options"
        ],
        template: `
            <div id="wraup" class="survey-block columns" style="background-color:transparent;">
                <div class="column is-9"></div>
                <div class="column is-3">
                    <a class="button is-info is-pulled-right"
                    v-on:click="Clicked" 
                    v-bind:disabled="$store.state.currentChat.WrapUpCompleted">
                        {{options.Message}}
                        <span v-if="$store.state.currentChat.WrapUpCompleted">
                            &nbsp;(Completed)
                        </span>
                    </a>
                </div>
                <wrapupModal id="wrapUpModal" :options="options"></wrapupModal>
            </div>
        `,
        methods: {
            Clicked() {
                hooks.Call(events.Chat.WrapUpClicked);
            }
        }
    });
})(woServices);