<template>
  <BlockChart title="HeatMap" :loading="loading">
    <HighChart
      :key="keyChange"
      id="heat-map"
      :options="options"
      height="calc(100vh - 100px)"
      ref="highchart"
      :function-fire-chart="functionFireChart"
    />
  </BlockChart>
</template>
<script>
import { HEATMAP_API, HEATMAP_V2_API, HEATMAP_ASSET_API } from "@/services/api";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
import {
  formatter,
  formatUSD,
  handlerPersion,
  styleColor,
  roundValue,
  colorByPercent,
} from "@/ultis/number";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
let groups = [
  {
    indexS: 0,
    key: "smart_contract_platforms",
    name: "Smart Contract Platforms",
    data: [],
  },
  { indexS: 1, key: "gaming", name: "Gaming", data: [] },
  { indexS: 2, key: "ntfs", name: "Non-fungible Tokens", data: [] },
  { indexS: 3, key: "meme", name: "Meme", data: [] },
  { indexS: 4, key: "misc", name: "Misc", data: [] },
  { indexS: 5, key: "dex", name: "DEX Tokens", data: [] },
  { indexS: 6, key: "cex", name: "CEX Tokens", data: [] },
  { indexS: 7, key: "stablecoins", name: "Stablecoin", data: [] },
  { indexS: 8, key: "others", name: "Currency", data: [] },
];
export default {
  name: "heat-map",
  components: {
    BlockChart,
    HighChart,
  },
  data: () => ({
    data: [],
    symbol: {},
    params: {
      currency: "USD",
      sort: "rank",
      order: "ascending",
      offset: 0,
      limit: 500,
      meta: true,
    },
    keyChange: 1,
    intervalTime: 20 * 1000,
    interval: null,
    loading: false,
    functionFireChart: null,
  }),
  computed: {
    options() {
      return {
        title: {
          text: null,
        },
        legend: { enabled: false },
        chart: {
          backgroundColor: "#2e2e33",
        },
        tooltip: {
          useHTML: true,
          backgroundColor: "#1f2937",
          followPointer: true,
          animation: false,
          borderRadius: 5,
          borderWidth: 0,
          shadow: false,
          padding: 0,
          hideDelay: 0,
          formatter: function () {
            let key = this.point.parent ? this.point.parent : this.point.id;
            let group = groups.find((x) => {
              return x.key == key;
            });
            let data = group ? group.data.slice(0, 5) : [];
            let child = "";
            if (this.point.parent) {
              child = ` <tr class="text-white text-base" style="background-color: ${
                this.point.color
              }">
                <td class="px-2 align-top py-2">
                    <div class="flex flex-col ">
                        <div class="font-bold">${this.point.name}</div>
                        <div class="text-xs">${this.point.fullname}</div>
                    </div>

                </td>
                <td class="px-2 whitespace-nowrap align-top pt-2">
                    <div class="font-bold">${formatter(
                      roundValue(this.point.rate)
                    )}</div>

                </td>
                <td class="px-2 whitespace-nowrap align-top pt-2">
                    <div class="font-bold">${this.point.change24h}</div>
                </td>
            </tr>`;
            }
            data = data.reduce((a, b) => {
              return (
                a +
                `
                  <tr class="text-white">

                <td class="px-2 py-2 whitespace-nowrap border-t border-gray-600">
                    <span class="font-medium">${b.name}</span>
                </td>
                <td class="px-2 py-2 whitespace-nowrap border-t border-gray-600">
                    $ ${formatUSD(roundValue(b.rate, 1))}
                </td>
                <td class="px-2 py-2 whitespace-nowrap border-t border-gray-600" style="color:${styleColor(
                  b.change24h,
                  true
                )}">
                    ${b.change24h}
                </td>
            </tr>
              `
              );
            }, "");
            return `
            <div class="p-2 bg-gray-800 rounded-lg">
              <div class="overflow-hidden sm:rounded-lg" style="width:280px">
                <table class="min-w-full text-sm text-gray-400 text-white border-collapse">
                    <thead class="bg-gray-800 text-xs font-medium">
                        <tr>
                            <th scope="col" colspan="3" class="px-2 py-1 text-left tracking-wider uppercase text-white text-base">
                                ${group.name}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-gray-800 align-baseline">
                        ${child}
                      ${data}
                    </tbody>
                </table>
            </div>
            </div>
            `;
          },
        },
        navigation: {
          breadcrumbs: {
            events: {
              click: function (button, breadcrumbs) {
                if (button.target.innerHTML == "Heatmap") {
                  sessionStorage.setItem("drill", null);
                }
              },
            },
          },
        },
        drilldown: {
          breadcrumbs: {
            buttonTheme: {
              style: {
                color: "#fff",
              },
            },
            style: {
              color: "#fff",
            },
          },
        },
        series: [
          {
            id: "heatmap",
            name: "Heatmap",
            point: {
              events: {
                mouseOver: function (e) {
                  let key = this.parent ? this.parent : this.id;
                  let group = groups.find((x) => {
                    return x.key == key;
                  });
                  if (group) {
                    this?.series?.data[group.indexS]?.graphic?.toFront();
                    this?.series?.data[
                      group.indexS
                    ]?.graphic?.element?.setAttribute("stroke", "#FFFF00");

                    group.data.forEach((d) => {
                      this.series.data[d.indexData]?.graphic?.toFront();
                      this.series.data[
                        d.indexData
                      ]?.graphic?.element?.setAttribute("stroke", "#FFFF00");
                    });
                  }
                },
                mouseOut: function (e) {
                  let key = this.parent ? this.parent : this.id;
                  let group = groups.find((x) => {
                    return x.key == key;
                  });

                  if (group) {
                    this.series.data[
                      group.indexS
                    ].graphic?.element?.setAttribute("stroke", "#2e2e33");
                    group.data.forEach((d) => {
                      this.series.data[
                        d.indexData
                      ].graphic?.element?.setAttribute("stroke", "#2e2e33");
                    });
                  }
                },
                click: function () {
                  let key = this.parent ? this.parent : this.id;
                  let group = groups.find((x) => {
                    return x.key == key;
                  });
                  if (group) {
                    sessionStorage.setItem("drill", key);
                    this.series.onClickDrillToNode({
                      point: this.series.data[group.indexS],
                    });
                  }
                },
              },
            },
            states: {
              hover: {
                enabled: false,
              },
            },
            type: "treemap",
            layoutAlgorithm: "squarified",
            allowDrillToNode: true,
            data: this.data,
            alternateStartingDirection: true,
            animation: false,
            dataLabels: {
              enabled: false,
            },
            accessibility: {
              exposeAsGroupOnly: true,
            },
            breadcrumbs: {
              buttonTheme: {
                style: {
                  color: "#fff",
                },
              },
            },
            levels: [
              {
                level: 1,
                borderWidth: 3,
                borderColor: "#2e2e33",
                levelIsConstant: false,
                dataLabels: {
                  enabled: true,
                  align: "left",
                  verticalAlign: "top",
                  style: {
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "#fff",
                  },
                },
              },
              {
                level: 2,
                borderColor: "#2e2e33",
                borderWidth: 2,
                dataLabels: {
                  enabled: true,
                  useHTML: true,
                  formatter: function () {
                    let isDrill = this.series.chart.breadcrumbs.list.length;
                    let di = isDrill ? 100 : 49;
                    let fontSize = this.point.shapeArgs
                      ? (this.point.shapeArgs.width +
                          this.point.shapeArgs.height) /
                        di
                      : 0;
                    let isShow =
                      fontSize != 0 &&
                      this.point.shapeArgs.height > (fontSize + 5) * 3 &&
                      this.point.shapeArgs.width > (fontSize + 5) * 3;
                    let styleName = isShow
                      ? `font-size:${fontSize * 3}px;`
                      : "";
                    let style = isShow ? `font-size:${fontSize}px;` : "";
                    if (this.point.shapeArgs) {
                      let w = this.point.shapeArgs.width;
                      let h = this.point.shapeArgs.height;
                      style += `width:${w}px;height:${h}px;position:absolute;`;
                      if (!isDrill) {
                        style += `top:-${h / 2}px;left: -${w / 2}px;`;
                      }
                    }
                    return `
                <div class="flex items-center justify-center w-full overflow-hidden" style="${style}">
                  <div class="flex flex-col items-center ${
                    isShow ? "text-white" : "text-transparent"
                  } ">
                    <div class="text-ellipsis overflow-hidden" style="${styleName}">
                        ${this.point.name}
                    </div>
                    <div >${formatUSD(roundValue(this.point.rate, 1))} USD</div>
                    <div>${this.point.change24h}</div>
                  </div>
                </div>
                `;
                  },
                },
              },
            ],
          },
        ],
      };
    },
  },
  async created() {
    try {
      this.loading = true;
      sessionStorage.setItem("drill", null);
      await this.fetchDataV2();
    } finally {
      this.loading = false;
    }
    this.interval = setInterval(() => {
      this.fetchDataV2();
    }, this.intervalTime);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchSymbol() {
      let res = await HEATMAP_ASSET_API();
      res?.data?.data?.forEach((e) => {
        this.symbol[e.symbol] = {
          value: handlerPersion(e.changePercent24Hr, true),
          color: colorByPercent(e.changePercent24Hr),
        };
      });
    },
    async fetchData() {
      const res = await HEATMAP_API();
    },
    async fetchDataV2() {
      await this.fetchSymbol();
      let res = await HEATMAP_V2_API(this.params);
      let dataresult = [];

      dataresult = groups.map((x, i) => {
        groups[i].data = [];
        return {
          id: x.key,
          name: x.name,
        };
      });
      try {
        res.data.forEach((e) => {
          let parent = "";
          let find = null;
          if (!e.categories) {
            return;
          }
          let indexFind = -1;

          if (!e.categories.length) {
            parent = "others";
            indexFind = groups.length - 1;
          } else {
            let find = "";
            if (
              groups.some((x, i) => {
                find = x.key;
                indexFind = i;
                return e.categories.includes(x.key);
              })
            ) {
              parent = find;
            }
          }
          if (parent) {
            let change24h = this.symbol[e.code]
              ? this.symbol[e.code].value
              : roundValue(e.delta.day * 100) + " %";

            let d = {
              name: `${e.code}`.trim(),
              fullname: e.name,
              value: e.cap,
              rate: e.rate,
              volume: e.volume,
              parent: parent,
              change24h: change24h,
              color: this.symbol[e.code]
                ? this.symbol[e.code].color
                : colorByPercent(e.delta.day * 100),
              indexData: dataresult.length,
            };
            if (d.name == "BTC") {
              this.$emit("BTC", {
                price: e.rate,
                change24h: Number(change24h.replace(/[ %]/g, "")),
              });
            }
            if (d.name == "ETH") {
              this.$emit("ETH", {
                price: e.rate,
                change24h: Number(change24h.replace(/[ %]/g, "")),
              });
            }
            groups[indexFind].data.push(d);
            dataresult.push(d);
          }
        });
        this.functionFireChart = function (chart) {
          if (sessionStorage.getItem("drill")) {
            this.fireEvent(chart.series[0], "click", {
              point: chart.get(sessionStorage.getItem("drill")),
            });
          }
        };
        this.data = dataresult;
        groups.forEach((g, i) => {
          groups[i].data = groups[i].data.sort((a, b) => b.value - a.value);
        });
      } catch (e) {
        this.data = [];
      }
    },
    getStyle(value) {
      //#e85b5a
      let color = "#8dc950";
      if (value && parseFloat(value) < 0) {
        color = "#e85b5a";
      }

      return { color };
    },
  },
};
</script>
<style scoped>
/deep/
  g.highcharts-no-tooltip.highcharts-button.highcharts-breadcrumbs-button.highcharts-button-pressed
  text {
  fill: #fff !important;
}
/deep/rect.highcharts-button-box {
  fill: transparent !important;
}
/deep/.highcharts-button-box {
  stroke: #fff !important;
}
/deep/.highcharts-button-hover text {
  fill: #fff !important;
  color: #fff !important;
}
</style>
