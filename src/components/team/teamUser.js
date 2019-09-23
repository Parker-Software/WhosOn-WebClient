(function(services){
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;


    Vue.component('homeTeamUser', {
        props: [
            "name",
            "status",
            "photo"
        ],
        template: `
            <li>
                <div class="box chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <figure class="image is-64x64" style="margin:0; float:left;">
                                    <img src="https://bulma.io/images/placeholders/64x64.png" alt="Image" class="is-rounded">
                                    <div v-if="status == 0" class="status online"><i class="fas fa-circle"></i></div>
                                    <div v-if="status == 1" class="status busy"><i class="fas fa-circle"></i></div>
                                    <div v-if="status == 2" class="status brb"><i class="fas fa-circle"></i></div>
                                    <div v-if="status == 3" class="status away"><i class="fas fa-circle"></i></div>
                                </figure>
                                <strong style="float:left; margin-left: 10px; margin-top: 10px;">{{name}}</strong>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `
    });
})(woServices);