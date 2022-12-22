<template>
  <BlockChart>
    <HighChart
      is-stock-chart
      id="dominance-ratio"
      :options="options"
      height="600px"
    />
  </BlockChart>
</template>
<script>
// import { BTC_API, ETH_API, STABLECOIN_API } from "@/services/api";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
import { DOM_API } from "@/services/api";
export default {
  name: "dominance-ratio",
  components: {
    BlockChart,
    HighChart,
  },
  data: () => ({
    seriesOptions: [],
    legendX: 0,
    legendY: -29,
    verticalAlign: "top",
  }),
  computed: {
    options() {
      return {
        rangeSelector: {
          selected: 4,
        },
        chart: {
          backgroundColor: "#2e2e33",
        },
        title: {
          text: "Dominance Ratio",
          style: {
            color: "#fff",
            fontSize: "20px",
            fontWeight: "bold",
          },
          align: "left",
        },
        legend: {
          enabled: true,
          align: "center",
          verticalAlign: this.verticalAlign,
          floating: true,
          x: this.legendX,
          y: this.legendY,
          symbolWidth: 30,
          symbolHeight: 30,
          itemStyle: {
            color: "#fff",
            fontWeight: "normal",
          },
          itemHoverStyle: {
            color: "#fff",
            fontWeight: "bold",
          },
        },
        xAxis: {
          labels: {
            style: {
              color: "#FFFFFF",
            },
          },
        },
        yAxis: {
          gridLineColor: "#ffffff1f",
          opposite: true,
          labels: {
            formatter: function () {
              return this.value + "%";
            },
            style: {
              color: "#FFFFFF",
            },
            align: "left",
          },
          plotLines: [
            {
              value: 0,
              width: 2,
              color: "silver",
            },
          ],
        },

        plotOptions: {
          // series: {
          //   compare: "percent",
          //   showInNavigator: true,
          // },
        },

        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
          valueDecimals: 2,
          split: true,
          backgroundColor: "#2e2e33",
          style: {
            color: "#fff",
          },
        },

        series: this.seriesOptions,
      };
    },
  },
  created() {
    this.fetchData();
    // window.addEventListener("resize", this.checkSizeChange);
  },
  beforeDestroy() {
    // window.removeEventListener("resize", this.checkSizeChange);
  },
  methods: {
    // checkSizeChange() {
    //   if (window.innerHeight < 1280) {
    //     this.legendX = 0;
    //     this.legendY = -58;
    //     this.verticalAlign = "bottom";
    //   } else {
    //     this.legendX = 0;
    //     this.legendY = -39;
    //     this.verticalAlign = "top";
    //   }
    // },
    async fetchData() {
      let btc = {
        name: "BTC.Dom",
        data: [],
        color: "#6164ff",
        lineWidth: 3,
      };
      let eth = {
        name: "ETH.Dom",
        data: [],
        color: "#a72998",
        lineWidth: 3,
      };
      let stablecoin = {
        name: "Stablecoin.Dom",
        data: [],
        color: "#d5a142",
        lineWidth: 3,
      };
      try {
        let res = await DOM_API();
        btc.data = res.data.map((x) => [
          new Date(x.created_at).getTime(),
          x.btcDominance,
        ]);
        eth.data = res.data.map((x) => [
          new Date(x.created_at).getTime(),
          x.ethDominance,
        ]);
        stablecoin.data = res.data.map((x) => [
          new Date(x.created_at).getTime(),
          x.stablecoinDominance,
        ]);
      } catch (error) {
        btc.data = [];
        eth.data = [];
        stablecoin = [];
      }
      this.seriesOptions = [btc, eth, stablecoin];
    },
  },
};
</script>
