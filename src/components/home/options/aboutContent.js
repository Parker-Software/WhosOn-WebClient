(function(services){
    Vue.component('homeOptionsContentAbout', {
        props: [
            "id"
        ],
        template: `
            <div v-bind:id="id">
                <img src="assets/images/whoson-logo-sm.png" style="width: 200px;" />
                <div class="field" style="max-width: 400px;">
                    <label>WhosOn Web Client Version: <b class="is-pulled-right">{{$store.state.version}}</b></label> <br />
                </div>
                <div class="field" style="max-width: 400px;">
                    <label><small>Connected To Server Version: <b class="is-pulled-right">{{$store.state.serverBuild}}</b></small></label> <br />
                    <label><small>Registered To: <b class="is-pulled-right">{{$store.state.registeredUser}}</b></small></label> <br />
                </div>
                <div class="field">
                    <label><small>Copyright &copy; Parker Software {{Year}}, All rights reserved. For terms & privacy policy, visit <a target="_blank" href="https://www.whoson.com">www.whoson.com</a></small></label>
                </div>
            </div>
        `,
        computed: {
            Year() {
                return new Date().getFullYear();
            }
        }
    });
})(woServices);