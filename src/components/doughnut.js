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
                <div>
                    <canvas v-bind:id="id" width="100" height="100"></canvas>
                </div>
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

                var chart = document.getElementById(this.id);
                if(chart) {

                    var takeOff = 0.5 * Math.PI;
                    var ctx = chart.getContext('2d');
                    ctx.clearRect(0, 0, chart.width, chart.height);
                    ctx.beginPath();
                    ctx.arc(50,  54, 27, 0, 2*Math.PI);
                    ctx.fillStyle = '#fff';
                    ctx.fill();


                    var arcAmount = (this.value / (this.upperLimit * 50) * 100) * Math.PI - takeOff;
                    ctx.beginPath();
                    ctx.arc(50, 54, 35, -takeOff, arcAmount);
                    ctx.lineWidth = 15;

                    if(this.ActualValue > this.upperLimit) {
                        ctx.strokeStyle = '#848492';
                    } else {
                        ctx.strokeStyle = '#7779BF';
                    }
                    ctx.stroke();
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
