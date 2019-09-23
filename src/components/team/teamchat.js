(function(services){
    Vue.component('homeTeamChat', {
        template: `
        <div class="column is-9 col-pad chat-area" id="hometeamChat">
            <div class="logo">
                <i class="far fa-comment"></i>
                <br>
                <p>No Active Chats</p>
            </div>
        </div>
        `
    });
})(woServices);