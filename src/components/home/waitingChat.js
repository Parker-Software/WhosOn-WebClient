(function(){
    var hooks = woServices.Hooks;
    var events = woServices.HookEvents;
    var connEvents = events.Connection;

    Vue.component('homeWaitingChat', {
        props: [
            'name',
            'geoip',
            'site',
            'chatstatus'
        ],
        template: `
            <li>
                <div class="box status-border chat-info is-selected">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>{{name}}</strong>
                                    <br>
                                    <small>{{geoip}}</small>
                                    <br>
                                    <small><strong>{{site}}</strong></small>
                                    <br>
                                    <!-- takling to, waiting etc -->
                                    <small><strong>{{chatstatus}}</strong></small>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `
    });
})();