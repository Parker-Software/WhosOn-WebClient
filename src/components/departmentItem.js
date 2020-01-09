(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var state = services.Store.state;

    Vue.component("departmentItem", {
        props: [
            "collectionGroup",
            "department"
        ],
        template: `
            <li v-bind:class="ItemClass" v-on:click="Clicked" class="selectableItem departmentItem">
                <div class="box chat-info">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <figure class="image is-64x64" style="margin:0; float:left;">
                                    <i class="fas fa-users fa-3x" style="margin-top: 10px"></i>
                                    <div v-if="department.Status == 0" class="status online"><i class="fas fa-circle"></i></div>
                                    <div v-if="department.Status == 1" class="status busy"><i class="fas fa-circle"></i></div>
                                    <div v-if="department.Status == 2" class="status brb"><i class="fas fa-circle"></i></div>
                                    <div v-if="department.Status == 3" class="status away"><i class="fas fa-circle"></i></div>
                                </figure>
                                <div style="float:left; margin-left: 10px; margin-top: 10px;">  
                                    <strong>{{department.Name}}</strong> <br />
                                    <small v-if="department.Status == 0" style="margin-left: 5px">Are online</small>
                                    <small v-if="department.Status == 1" style="margin-left: 5px">Are busy</small>
                                    <small v-if="department.Status == 2" style="margin-left: 5px">Are be right back</small>
                                    <small v-if="department.Status == 3" style="margin-left: 5px">Are away</small>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </li>
        `,
        computed: {
            ItemClass() {
                var classes = {};
                classes[this.collectionGroup || "departmentItem"] = true;
                classes[(this.collectionGroup || "departmentItem") + "-" +  this.department.Name] = true;
                return classes;
            }
        },
        methods: {
            Elem() {
                return document.getElementsByClassName(`${this.collectionGroup || "departmentItem"}-${this.department.Name}`)[0];
            },
            Clicked() {
                this.$emit("Clicked", this.department);
                if (this.Elem().classList.contains("is-active")) {
                    this.Elem().classList.remove("is-active");
                } else {this.Elem().classList.add("is-active");}
            }
        }
    });
})(woServices);