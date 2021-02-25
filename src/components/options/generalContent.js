(function(services){
    Vue.component("homeOptionsContentGeneral", {
        props: [
            "id"
        ],
        template: `
        <div v-bind:id="id">
            <div class="field" style="margin-bottom: 20px">
                <label><small>Visual Theme:</small></label> <br />
                <div class="select">
                    <select v-model="$store.state.settings.Theme">
                        <option value="0"> Light </option>
                        <option value="1" disabled> Dark</option>
                        <option value="2" disabled> Blue </option>
                        <option value="3" disabled> Parker Software </option>
                        <option value="4" disabled> Purple </option>
                        <option value="5" disabled> Green </option>
                    </select>
                </div> 
            </div>
            <div class="field">
                <input id="enablePopups" type="checkbox" v-model="$store.state.settings.ShowNotifications" name="enablePopups" class="switch is-rounded">
                <label for="enablePopups"><small>Show popup noficiations</small></label>
            </div>
            <!--<div class="field">
                <input id="enableVisitorPopups" type="checkbox" v-model="$store.state.settings.ShowNotificationsVisitors" name="enableVisitorPopups" class="switch is-rounded">
                <label for="enableVisitorPopups"><small>Show popup noficiations for new visitors</small></label>
            </div>-->
            <div class="field">
                <input id="enableAwayOnStartup" type="checkbox" v-model="$store.state.settings.StartAway" name="enableAwayOnStartup" class="switch is-rounded">
                <label for="enableAwayOnStartup"><small>Set my status to away on start up</small></label>
            </div>
            <div class="field">
                <input id="enableAutoAway" type="checkbox" v-model="$store.state.settings.AutoAwayEnabled" name="enableAutoAway" class="switch is-rounded">
                <label for="enableAutoAway"><small>Auto away after <input type="text" v-model="$store.state.settings.AutoAwayMins" class="inlineTextBox" /> minutes of inactivity</small></label>
            </div>
            <div class="field">
                <input id="enableAutoLogout" type="checkbox" v-model="$store.state.settings.AutoLogoutEnabled" name="enableAutoLogout" class="switch is-rounded">
                <label for="enableAutoLogout"><small>Auto logout after <input type="text"  v-model="$store.state.settings.AutoLogoutMins" class="inlineTextBox" /> minutes of inactivity</small></label>
            </div>  
            <!--<div class="field">
                <input id="enableShowSuggestions" type="checkbox" v-model="$store.state.settings.ShowSuggestions" name="enableShowSuggestions" class="switch is-rounded">
                <label for="enableShowSuggestions"><small>Show suggestions when typing</small></label>
            </div>-->
            <!--<div class="field">
                <input id="enableAutoResponses" type="checkbox" v-model="$store.state.settings.ShowAutoResponse" name="enableAutoResponses" class="switch is-rounded">
                <label for="enableAutoResponses"><small>Show canned response auto-responses</small></label>
            </div>-->
            <div v-if="$store.state.rights.MonitorChats" class="field">
                <input id="enableAutoMonitor" type="checkbox" v-model="$store.state.settings.ListenModeActive" name="enableAutoMonitor" class="switch is-rounded">
                <label for="enableAutoMonitor"><small>Auto monitor all chats (supervisor mode)</small></label>
            </div>
            <div class="field">
                <input id="enableShowEmojis" type="checkbox" v-model="$store.state.settings.ShowEmoji" name="enableShowEmojis" class="switch is-rounded">
                <label for="enableShowEmojis"><small>Show Emoji popup when chatting</small></label>
            </div>
            <div class="field">
                <input id="enableOthersChats" type="checkbox" v-model="$store.state.settings.ShowOtherUsersChats" name="enableOthersChats" class="switch is-rounded">
                <label for="enableOthersChats"><small>Show other users active chats in the active chats view</small></label>
            </div>
        </div>
        `,
    });
})(woServices);