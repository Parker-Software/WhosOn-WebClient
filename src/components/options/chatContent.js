(function(services){
    Vue.component("homeOptionsContentChat", {
        props: [
            "id"
        ],
        template: `
            <div v-bind:id="id">
                <div class="field">
                    <label><small>The default message settings override the defaults set by your system administrator.</small></label>
                </div>
                <div class="field">
                    <label for="openingChatMessage"><small>Default opening chat message:</small></label> <br />
                    <textarea spellcheck="false" rows="3" class="textarea has-fixed-size" v-model="$store.state.settings.Greeting"></textarea>
                </div>
                <div class="field">
                    <label for="transferMessage"><small>Default transfer message:</small></label> <br />
                    <textarea spellcheck="false" rows="3" class="textarea has-fixed-size" v-model="$store.state.settings.TransferMessage"></textarea>
                </div>
                <!--<div class="field" style="margin-bottom: 20px">
                    <label><small>User interface language:</small></label> <br />
                    <div class="select">
                        <select v-model="$store.state.settings.UILang">
                            <option value='en'>English</option>
                            <option value='fr'>French</option>
                            <option value='es'>Spanish</option>
                            <option value='ge'>German</option>
                            <option value='it'>Italian</option>
                            <option value='zh'>Chinese</option>
                        </select>
                    </div> 
                </div>-->
            </div>
        `
    });
})(woServices);