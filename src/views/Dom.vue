<template>
  <BlockChart>
    <div class="flex h-[75px] justify-center items-center">
      <!-- <div class="flex"> -->
      <div>
        <h2 class="text-white font-bold text-[20px]">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>
        <div class="text-white text-[15px]" v-if="price">
          {{ price && handlerFormatUSD(roundValue(price, 1)) }}
          <span class="ml-2" :style="style"> {{ change24h }} % </span>
        </div>
      </div>
      <div
        class="text-center text-[30px] font-bold align-top leading-[50px] ml-4 h-full"
        :style="style"
      >
        <div>
          {{ handlerPersion() }}
        </div>
      </div>
    </div>
  </BlockChart>
</template>
<script>
import BlockChart from "@/components/BlockChart.vue";
import { formatUSD } from "@/ultis/number";
export default {
  components: {
    BlockChart,
  },
  name: "dom-component",
  props: {
    api: { type: Function },
    title: { type: String },
    keyField: { type: String },
    idKey: { type: String },
    isStableCoin: Boolean,
    price: { type: Number, default: 0 },
    change24h: { type: Number, default: 0 },
  },
  data: () => ({
    data: null,
  }),
  created() {
    this.fetchData();
  },
  computed: {
    style() {
      //#e85b5a
      let color = "#8dc950";
      if (this.change24h && parseFloat(this.change24h) < 0) {
        color = "#e85b5a";
      }

      return { color };
    },
  },
  methods: {
    handlerFormatUSD(value) {
      return formatUSD(value) + " USD";
    },
    async fetchData() {
      const res = await this.api();
      if (this.keyField || this.isStableCoin) {
        let d = res?.data;

        if (this.isStableCoin) {
          this.data = {
            changePercent24Hr:
              d && d.length
                ? d[d.length - 1]["totalVolume24h"] /
                  d[d.length - 1]["totalMarketCap"]
                : 0,
            priceUsd: 0,
          };
        } else {
          this.data = {
            changePercent24Hr:
              d && d.length ? d[d.length - 1][this.keyField] : 0,
            priceUsd: 0,
          };
        }
      } else {
        this.data = res?.data?.data;
      }
    },
    roundValue(value, precision = 1) {
      if (!value) {
        return 0;
      }
      value = parseFloat(value);
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    },
    handlerPersion() {
      if (!this.data || !this.data.changePercent24Hr) {
        return "0 %";
      }
      let value = parseFloat(this.data.changePercent24Hr);
      value = value < 0 ? value * -1 : value;
      if (!this.keyField && !this.isStablecoin) {
        value = value * 100;
      }
      value = this.roundValue(value);
      return `${value} %`;
    },
  },
};
</script>
