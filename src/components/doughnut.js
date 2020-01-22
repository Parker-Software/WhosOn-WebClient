(function(services){
    Vue.component("doughnut", {
        props: [
            "title",
            "subtitle",
            "value",
            "max",
            "happiness",
            "showArrow"
        ],
        data: () => {
            return {
                id: uuidv4(),
                colours: ["#7779BF", "rgba(238, 241, 245)"],
                data: [],
                upperLimit: 100,
            };
        },
        template:`
            <div class="doughnut">
                <b>
                    {{title}} 
                    <i v-if="showArrow && value != 0 && value > max" class="far fa-arrow-alt-circle-up doingWell"></i>
                    <i v-if="showArrow && value != 0 && value < max" class="far fa-arrow-alt-circle-down doingBad"></i>
                </b>
                <canvas v-bind:id="id" width="100" height="100"></canvas>
                <div class="value">
                    <b>{{ActualValue}}</b>
                </div>
                <div class="dougnut-subtitle">
                    <small v-html="subtitle"></small>
                </div>

                <div v-if="happiness == null || happiness == false" class="percent">
                    <div v-bind:class="{zero:Percentage == 0}" class="percentage">
                        <span class="percent-number">
                            {{Percentage}}%
                        </span>
                    </div>
                </div>

                <div v-if="happiness == true" class="face">
                    <i v-if="ActualValue >= (upperLimit * 0.75)" class="far fa-smile fa-3x"></i>
                    <i v-if="ActualValue < (upperLimit * 0.75) && ActualValue > (upperLimit * 0.25)" class="far fa-meh fa-3x"></i>
                    <i v-if="ActualValue <= (upperLimit * 0.25)" class="far fa-frown fa-3x"></i>
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

                if(this.ActualValue >= this.upperLimit) {
                    this.data = [this.ActualValue];
                    this.colours = ["#848492"];
                }
                else {
                    this.data = [this.ActualValue , this.upperLimit - this.ActualValue];
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
                            tooltips: {
                                enabled: false
                            },
                            animation: {
                                onProgress: function() {
                                    var sizeWidth = ctx.canvas.clientWidth;
                                    var sizeHeight = ctx.canvas.clientHeight;

                                    this.chart.ctx.beginPath();
                                    this.chart.ctx.arc(sizeWidth * 0.5,  (sizeHeight * 0.5) + 5, 28, 0, 2*Math.PI);
                                    this.chart.ctx.fillStyle = '#fff';
                                    this.chart.ctx.fill();
                                }
                            }
                        }
                    });
                }
            }
        },
        computed: {
            Percentage() {
                if(this.upperLimit == 0) return 0;
                var value = Math.round(this.value / this.upperLimit * 100);
                if(isNaN(value)) value = 0;
                return value;
            },
            ActualValue() {
                var value = this.value;
                if(isNaN(value)) value = 0;
                return value;
            }
        }
    });
})(woServices);
