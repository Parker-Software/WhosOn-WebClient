(function(services){
    Vue.component("doughnut", {
        props: [
            "title",
            "subtitle",
            "value",
            "max",
            "happiness"
        ],
        data: () => {
            return {
                id: uuidv4(),
                colours: ["#7779BF", "rgba(255,255,255,0.2)"],
                data: [],
                upperLimit: 100
            };
        },
        template:`
            <div class="doughnut">
                <b>{{title}}</b>
                <canvas v-bind:id="id" width="100" height="100"></canvas>
                <div class="value">
                    <b>{{value}}</b>
                </div>
                <div class="dougnut-subtitle">
                    <small v-html="subtitle"></small>
                </div>

                <div v-if="happiness == null || happiness == false" class="percent">
                    <div v-bind:class="{zero:Percentage == 0}" class="percentage">
                        <div class="percent-number">
                            {{Percentage}}
                        </div>
                        <div class="symbol">%</div>
                    </div>
                </div>

                <div v-if="happiness == true" class="face">
                    <i v-if="value >= (upperLimit * 0.75)" class="far fa-smile fa-2x"></i>
                    <i v-if="value < (upperLimit * 0.75) && value > (upperLimit * 0.25)" class="far fa-meh fa-2x"></i>
                    <i v-if="value <= (upperLimit * 0.25)" class="far fa-frown fa-2x"></i>
                </div>
            </div>
        `,
        mounted() {
            this.Bind();
        },
        updated() {
            this.Bind();
        },
        methods: {
            Bind() {
                if(this.max != null) this.upperLimit = this.max;
                if(this.value >= this.upperLimit) this.data = [this.value];
                else {
                    this.data = [this.value, this.upperLimit - this.value];
                }

                var chart = document.getElementById(this.id);
                if(chart) {
                    var ctx = chart.getContext('2d');
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: this.data,
                                backgroundColor: this.colours,
                                borderColor: this.colours,
                                hoverBackgroundColor: this.colours,
                                borderWidth: 0,
                            }]
                        },
                        options: {
                            responsive: false,
                            cutoutPercentage: 60,
                            circumference: 2 * Math.PI,
                            tooltips: {
                                enabled: false
                            }
                        }
                    });
                }
            }
        },
        computed: {
            Percentage() {
                if(this.upperLimit == 0) return 0;
                return Math.round(this.value / this.upperLimit * 100);
            },
        }
    });
})(woServices);
