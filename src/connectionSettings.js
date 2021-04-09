(function(services) {
    var state = services.Store.state;

    state.connectionAddress = state.connectionAddress || `ws://${window.location.hostname}:8013`;
    state.settingsPortalAddress = state.settingsPortalAddress || `https://${window.location.hostname}/settings/ForgottenPassword.aspx`;
    state.azureCrmEndpoint = state.azureCrmEndpoint || 'https://azurecrm.whoson.com';
})(woServices);