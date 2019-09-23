(function(services){
    var state = services.Store.state;
    var hooks = services.Hooks;
    var events = services.HookEvents;


    Vue.component('homeTeamUser', {
        props: [
            "userName"
        ],
        template: `
            <li>
                <div class="box chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <figure class="image is-64x64" style="margin:0; float:left;">
                                    <img src="https://bulma.io/images/placeholders/64x64.png" alt="Image" class="is-rounded">
                                    <div class="status online"><i class="fas fa-circle"></i></div>
                                </figure>
                                <strong style="float:left;">{{userName}}</strong>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
            `
    });
})(woServices);