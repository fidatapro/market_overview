<template>
  <BlockChart id="total-market-cap" title="Total market cap" class="h-full">
    <template #subtitle>
      <div class="flex text-white items-center">
        <div class="text-[15px] font-bold mr-1">
          {{ formatBSD(totalCap) }}
        </div>
        <div class="text-[15px] mr-2">USD</div>
        <div :style="style" class="font-bold text-[15px]">
          {{ roundValue(persion, 2) }} %
        </div>
      </div>
    </template>
    <HighChart
      is-stock-chart
      id="total-market-cap"
      :options="options"
      height="550px"
    />
  </BlockChart>
</template>
<script>
import { TOTALMARKETCAP_API, TOTALMARKETCAP_V2_API } from "@/services/api";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
import { handlerChange, formatBillionUSD } from "@/ultis/number";

export default {
  name: "total-market-cap",
  components: {
    BlockChart,
    HighChart,
  },
  data: () => ({
    totalMarketCap: null,
    persion: 0,
    totalCap: 0,
    data: [],
    intervalTime: 15 * 60 * 1000,
    interval: null,
  }),
  beforeDestroy() {
    clearInterval(this.interval);
  },
  created() {
    this.fetchDataV2();
    this.interval = setInterval(() => {
      this.fetchDataV2();
    }, this.intervalTime);
  },
  computed: {
    style() {
      //#e85b5a
      let color = "#8dc950";
      if (this.persion && parseFloat(this.persion) < 0) {
        color = "#e85b5a";
      }

      return { color };
    },
    options() {
      return {
        chart: {
          backgroundColor: "#2e2e33",
        },
        rangeSelector: {
          selected: 1,
        },

        title: {
          text: null,
        },
        xAxis: {
          labels: {
            style: {
              color: "#FFFFFF",
            },
          },
        },
        tooltip: {
          backgroundColor: "#2e2e33",
          style: {
            color: "#fff",
          },
        },
        yAxis: {
          gridLineColor: "#ffffff1f",
          opposite: false,
          title: {
            text: null,
          },
          labels: {
            formatter: function () {
              return this.value > 1000000000
                ? this.value / 1000000000 + " B"
                : this.value;
            },
            style: {
              color: "#FFFFFF",
            },
          },
        },
        series: [
          {
            name: "Total market cap",
            data: this.data,
            type: "areaspline",
            threshold: null,
            tooltip: {
              valueDecimals: 2,
            },
            animation: false,
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "#6164ff"],
                [1, highcharts.color("#6164ff").setOpacity(0).get("rgba")],
              ],
            },
          },
        ],
      };
    },
  },
  methods: {
    formatBSD(value) {
      return formatBillionUSD(value);
    },
    getParamDate() {
      let now = new Date();
      let end = now.getTime();
      return {
        currency: "USD",
        start: end - 75 * 24 * 60 * 60 * 1000,
        end: end,
      };
    },
    roundValue(value, precision = 1) {
      if (!value) {
        return 0;
      }
      value = parseFloat(value);
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    },
    async fetchDataV2() {
      try {
        const res = await TOTALMARKETCAP_V2_API(this.getParamDate());
        this.totalCap = 0;
        this.data = res.data.map((x) => {
          return [x.date, x.cap];
        });
        if (this.data.length > 1) {
          this.persion = handlerChange(
            this.data[this.data.length - 1][1],
            this.data[this.data.length - 2][1]
          );
        }
        this.totalCap = this.data[this.data.length - 1][1];
      } catch (error) {
        this.data = [];
        this.totalCap = 0;
      }
    },
    async fetchData() {
      const res = await TOTALMARKETCAP_API();
      if (res?.data?.data) {
        this.totalMarketCap = res.data.data;
        this.options.series[0].data = Object.keys(
          res.data.data.total_market_cap
        ).map((key) => res.data.data.total_market_cap[key]);
      }
    },

    handlerPersion() {
      if (!this.persion) {
        return "0 %";
      }
      let value = parseFloat(this.persion);
      value = this.roundValue(value);
      return `${value} %`;
    },
    formatUSD(value) {
      return new Intl.NumberFormat("en-DE").format(value ? value : 0);
    },
  },
};
</script>
