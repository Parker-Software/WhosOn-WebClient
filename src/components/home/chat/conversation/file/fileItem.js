(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("fileItem", {
        props: [
            "hashedFileName",
            "name",
            "date",
            "size",
            "who",
            "isPinned"
        ],
        template: `
            <tr v-bind:id="hashedFileName" v-on:click="Clicked">
                <td v-html="IsPinned">
                </td>
                <td style="width: 70%;">
                    {{name}}
                </td>
                <td>
                    {{DateFormatted}}
                </td>
                <td style="min-width: 90px;">
                    {{SizeFormatted}}
                </td>
                <td>
                    {{who}}
                </td>
            </tr>
            `,
        beforeCreate() { 
            hooks.Register(events.FileUploader.FileItemClicked, (e) => {
                if(this.Item() != null) {this.Item().classList.remove("is-active");}
            });
        },
        methods: {
            Item() {
                return document.getElementById(this.hashedFileName);
            },
            Clicked() {
                this.$emit("Clicked", this.hashedFileName);
                hooks.Call(events.FileUploader.FileItemClicked, this.hashedFileName);
                this.Item().classList.add("is-active");
            }
        },
        computed: {
            IsPinned() {
                if(this.isPinned) {return "<i class=\"fas fa-thumbtack\"></i>";}
                else {return "";}
            },
            DateFormatted() {
                var date = new Date(this.date);
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();

                if(day < 10) {day = `0${day}`;}
                if(month < 10) {month = `0${month}`;}

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