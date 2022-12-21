<template>
  <div :id="idChart" :class="['w-full']" :style="{ height }"></div>
</template>
<script>
var HighchartStock = require("highcharts/highstock");
require("highcharts/modules/map")(HighchartStock);
var Highcharts = require("highcharts");
require("highcharts/modules/heatmap")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
Highcharts.setOptions({
  time: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});
HighchartStock.setOptions({
  time: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

export default {
  props: {
    id: {
      type: String,
      require: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    height: {
      type: String,
      default: "300px",
    },
    isStockChart: Boolean,
    loading: Boolean
  },
  data: () => ({
    prefix: "highchart",
    defaulOptions: {
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      time: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    },
    rangeSelectorOptions: {
      rangeSelector: {
        buttonTheme: {
          // styles for the buttons
          fill: "none",
          stroke: "none",
          "stroke-width": 0,
          r: 8,
          style: {
            color: "#fff",
            fontWeight: "bold",
          },
          states: {
            hover: {
              fill: "#404044",
            },
            select: {
              fill: "#404044",
              style: {
                color: "white",
              },
            },
            disabled: { fontWeight: "normal" },
          },
        },
        inputStyle: {
          color: "#fff",
        },
        labelStyle: {
          color: "#fff",
          fontWeight: "bold",
        },
      },
    },
    highChart: null,
  }),
  mounted() {
    this.generalChart();
  },
  watch: {
    options: {
      handler() {
        this.generalChart();
      },
      deep: true,
    },
    loading: {
      handler(val){
        if(this.highChart){
          if(val){
            this.highChart.showLoading();
          }else{
            this.highChart.hideLoading();
          }
        }
      }
    }
  },
  computed: {
    idChart() {
      return `${this.id}-${this.prefix}`;
    },
  },
  methods: {
    generalChart() {
      let options = {
        ...this.defaulOptions,
        ...this.options,
      };
      if (this.isStockChart) {
        options = {
          ...options,
          ...this.rangeSelectorOptions,
        };
        this.highChart = new HighchartStock.stockChart(this.idChart, options);
      } else {
        this.highChart = new Highcharts.chart(this.idChart, options);
      }
    },
  },
};
</script>
<style>
.highcharts-loading {
  opacity: 1 !important;
}
.highcharts-loading-inner {
  display: block;
}

.highcharts-loading-inner,
.highcharts-loading-inner:before,
.highcharts-loading-inner:after {
  background: #6164ff;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.highcharts-loading-inner {
  color: #6164ff;
  text-indent: -9999em;
  margin: 0 auto;
  top: 50% !important;
  position: relative;
  font-size: 11px;
  -webkit-transform: translate3d(-50%, -50%, 0);
  -ms-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.highcharts-loading-inner:before,
.highcharts-loading-inner:after {
  position: absolute;
  top: 0;
  content: "";
}
.highcharts-loading-inner:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.highcharts-loading-inner:after {
  left: 1.5em;
}
@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
