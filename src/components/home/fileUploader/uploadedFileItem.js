(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('uploadedFileItem', {
        props: [
            "hashedName",
            "name",
            "date",
            "size",
            "byWho"
        ],
        template: `
            <a v-bind:id="hashedName" class="fileItem list-item" v-on:click="Clicked">
                <div class="columns">
                    <div class="column is-1" v-html="Type">
                    </div>
                    <div class="column">
                        {{name}}
                    </div>
                    <div class="column">
                        {{DateFormatted}}
                    </div>
                    <div class="column is-2">
                        {{SizeFormatted}}
                    </div>
                    <div class="column">
                        {{byWho}}
                    </div>
                </div>
            </a>
            `,
        beforeCreate() { 
            hooks.Register(events.FileUploader.FileItemClicked, (e) => {
                if(this.Item() != null) this.Item().classList.remove("is-active");
            });
        },
        methods: {
            Item() {
                return document.getElementById(this.hashedName);
            },
            Clicked() {
                hooks.Call(events.FileUploader.FileItemClicked, this.hashedName);
                this.Item().classList.add("is-active");
            }
        },
        computed: {
            Type() {
                return `<i class="fas fa-file-image"></i>`;
            },
            DateFormatted() {
                var date = new Date(this.date);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();

                if(day < 10) day = `0${day}`;
                if(month < 10) month = `0${month}`;

                return `${day}/${month}/${year}`;
            },
            SizeFormatted() {
                var kb = this.size / 1024;
                var mb = kb / 1024;

                if(mb >= 1) {
                    return `${mb.toFixed(2)} MB`;
                } else {
                    return  `${kb.toFixed(2)} KB`;
                }
            }
        }
    });
})(woServices);