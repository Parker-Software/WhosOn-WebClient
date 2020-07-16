(function(services){
    Vue.component("changePassword", {
        template: `
            <div 
                class="change-password modal" 
                :class="{'is-active':$store.state.userInfo != null && $store.state.userInfo.RequirePasswordReset}"
            >
                
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">
                            Change Password
                        </p>
                    </header>
                    <section class="modal-card-body">
                        <label>
                            <b>Please change your password.</b>
                        </label>
                        <br />
                        <br />
                        <change-password-form />
                    </section>
                </div>
            </div>
        `,
    });
})(woServices);