<template>
  <BlockChart id="fear-green-index" class="h-full">
    <div>
      <HighChart
        ref="highchart"
        id="fear-green-index"
        :options="options"
        height="330px"
      />
      <div class="statistical">
        <div class="statistical-content">
          <div class="statistical-content-item yesterday">
            <h3 class="label yesterday-label">Yesterday</h3>
            <div class="container">
              <div
                :class="`value yesterday-value`"
                :style="handleStyle(dataYesterday)"
              >
                {{ dataYesterday }}
              </div>
            </div>
          </div>
          <div class="statistical-content-item last-week">
            <h3 class="label last-week-label">Last Week</h3>
            <div class="container">
              <div
                :class="`value last-week-value`"
                :style="handleStyle(dataLastWeek)"
              >
                {{ dataLastWeek }}
              </div>
            </div>
          </div>
          <div class="statistical-content-item last-month">
            <h3 class="label last-month-label">Last Month</h3>
            <div class="container">
              <div
                :class="`value last-month-value`"
                :style="handleStyle(dataLastMonth)"
              >
                {{ dataLastMonth }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BlockChart>
</template>
<script>
import { FEARGREEN_API, HEATMAP_V2_API } from "@/services/api";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
export default {
  name: "fear-green-index",
  components: {
    BlockChart,
    HighChart,
  },
  data: () => ({
    dataYesterday: null,
    dataLastWeek: null,
    dataLastMonth: null,
    seriesData: [80],
    seriesFormat: "{y}",
    sizeChart: "90%",

  }),
  created() {
    this.fetchData();
    this.checkSizeChange();
    window.addEventListener("resize", this.checkSizeChange);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkSizeChange);
  },
  computed: {
    options() {
      return {
        chart: {
          type: "gauge",
          plotBackgroundColor: "#2E2E33",
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: this.sizeChart,
          maxHeight: "300px",
          backgroundColor: "#2e2e33",
        },

        title: {
          text: "Fear & Greed Index",
          style: {
            color: "#FFFFFF",
            fontSize: "30px",
            fontWeight: "bold",
          },
        },

        pane: {
          startAngle: -110,
          endAngle: 110,
          background: null,
          center: ["50%", "67%"],
          size: "110%",
        },

        // the value axis
        yAxis: {
          min: 0,
          max: 100,
          tickPixelInterval: 130,
          tickPosition: "inside",
          tickColor:
            highcharts.defaultOptions.chart.backgroundColor || "#FFFFFF",
          tickLength: 40,
          tickWidth: 2,
          minorTickInterval: null,
          labels: {
            distance: 20,
            style: {
              fontSize: "14px",
              color: "#FFFFFF",
            },
          },
          plotBands: [
            {
              from: 0,
              to: 45.1,
              color: {
                linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
                stops: [
                  [0, "#E34C02"],
                  [1, "#E8E70B"],
                ],
              },
              thickness: 40,
            },
            {
              from: 45,
              to: 60.1,
              color: {
                linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
                stops: [
                  [0, "#E8E70B"],
                  [1, "#B6E600"],
                ],
              },
              thickness: 40,
            },
            {
              from: 60,
              to: 100,
              color: {
                linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
                stops: [
                  [0, "#B6E600"],
                  [1, "#32B605"],
                ],
              },
              thickness: 40,
            },
          ],
        },
        exporting: {
          enabled: false,
        },
        series: [
          {
            name: "Chart",
            data: this.seriesData,
            dataLabels: {
              format: this.seriesFormat,
              borderWidth: 0,
              color:
                (highcharts.defaultOptions.title &&
                  highcharts.defaultOptions.title.style &&
                  highcharts.defaultOptions.title.style.color) ||
                "#FFFFFF",
              style: {
                fontSize: "16px",
              },
            },
            dial: {
              radius: "80%",
              backgroundColor: "gray",
              baseWidth: 12,
              baseLength: "0%",
              rearLength: "0%",
            },
            pivot: {
              backgroundColor: "gray",
              radius: 6,
            },
          },
        ],
      };
    },
  },
  methods: {
    checkSizeChange() {
      if (window.innerWidth < 1024) {
        this.sizeChart = "360px";
      } else if(window.innerWidth < 1250){
        this.sizeChart = "100%"
      }else if(window.innerWidth < 1441){
        this.sizeChart = "110%"
      }else if(window.innerWidth < 1580){
        this.sizeChart = "105%"
      }else {
        this.sizeChart = "85%";
      }
    },
    async fetchData() {
      let res = await FEARGREEN_API();
      res = res.data;
      if (res?.data) {
        this.dataYesterday = this.getYesterdayValue(res?.data);
        this.dataLastWeek = this.getLastWeekValue(res?.data);
        this.dataLastMonth = this.getLastMonthValue(res?.data);
        let data = {
          value: res?.data[0]?.value,
          time_until_update: res?.data[0]?.time_until_update,
          timestamp: res?.data[0]?.timestamp,
          value_classification: res?.data[0]?.value_classification,
        };
        this.seriesData = [parseInt(data.value)] || [0];

        this.seriesFormat = `<span style="font-size: 16px; color: ${this.handleColorProgress(
          data.value
        )}">${data.value_classification} ${data.value}</span>`;
      }
    },
    getYesterdayValue(data) {
      return data[1]?.value || 0;
    },
    getLastWeekValue(data) {
      return data[7]?.value || 0;
    },
    getLastMonthValue(data) {
      return data[30]?.value || 0;
    },
    handleWidth(value) {
      return `${(value / 100) * 100}%`;
    },
    handleStyle(value) {
      if (value) {
        return {
          backgroundColor: this.handleColorProgress(value),
          width: this.handleWidth(value),
        };
      }
      return {};
    },
    handleColorProgress(value) {
      if (value < 20) {
        return "#E34C02";
      } else if (value >= 20 && value < 45) {
        return "#F39C12";
      } else if (value >= 45 && value < 60) {
        return "#E8E70B";
      } else if (value >= 60 && value < 80) {
        return "#F39C12";
      } else {
        return "#B6E600";
      }
    },
  },
};
</script>
<style scoped>
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

.highcharts-figure,
.highcharts-data-table table {
  min-width: 310px;
  max-width: 500px;
  margin: 1em auto;
  padding: 15px 20px;
  box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.1);
  background-color: #2e2e33;
  border-radius: 20px;
}

.highcharts-background {
  fill: #2e2e33;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}

.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}

.highcharts-data-table tr:hover {
  background: #f1f7ff;
}

.highcharts-gauge-series .highcharts-pivot {
  stroke-width: 1px;
}

.highcharts-a11y-proxy-button {
  display: none !important;
}

.statistical {
  background-color: #2e2e33;
}

.statistical-content-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  color: #fff;
}

.statistical-content-item h3 {
  font-weight: 400;
  font-size: 16px;
  padding: 0px 10px 0 8px;
}

.statistical-content-item .label::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 10px;
}

.statistical-content-item .yesterday-label::before {
  background-color: #d6be03;
}
.statistical-content-item .last-week-label::before {
  background-color: #15b53b;
}
.statistical-content-item .last-month-label::before {
  background-color: #c0480e;
}

.statistical-content-item .label {
  font-size: 14px;
  font-weight: 400;
  /* margin-left: 30px; */
}

.statistical-content-item .container {
  width: 60%;
  height: 14px;
  background-color: #fff;
  border-radius: 10px;
  margin-right: 1rem;
}

.statistical-content-item .container .value {
  text-align: center;
  color: #000;
  font-size: 10px;
  height: 14px;
  line-height: 14px;
  border-radius: 5px;
  transition: width 1s;
}

.statistical-content-item .container .yesterday-value {
  width: 70%;
  background-color: #32b605;
}

.statistical-content-item .container .last-week-value {
  width: 70%;
  background-color: #32b605;
}

.statistical-content-item .container .last-month-value {
  width: 70%;
  background-color: #32b605;
}

.value-classification {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-top: 10px;
  z-index: 1000;
}
</style>