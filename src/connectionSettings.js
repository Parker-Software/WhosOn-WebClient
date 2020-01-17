(function(services) {
    var state = services.Store.state;
    
    state.connectionAddress = `ws://192.168.10.150:8013`;
    state.settingsPortalAddress = `http://192.168.10.150/settings`;

    state.connectionAddress = state.connectionAddress || `ws://${window.location.hostname}:8013`;
    state.settingsPortalAddress = state.settingsPortalAddress || `https://${window.location.hostname}/settings/ForgottenPassword.aspx`;
})(woServices);