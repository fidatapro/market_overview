<template>
  <BlockChart class="h-full">
    <template #title>
      <div class="text-center w-full">
        <h2 class="text-white font-bold text-[20px] pt-[30px] pb-[10px]">
          Top Trending Coins
        </h2>
      </div>
    </template>
    <table class="w-full text-left border-collapse">
      <tbody class="align-baseline text-white text-[15px]">
        <tr v-for="(item, index) in top_trendings" :key="`tt-${index}`">
          <td
            :class="[index != top_trendings.length - 1 ? `border-b` : '']"
            class="py-3 w-[20px] align-middle border-[#535355ba] dark:border-slate-400/10"
          >
            {{ index + 1 }}
          </td>
          <td
            :class="[index != top_trendings.length - 1 ? `border-b` : '']"
            class="align-middle border-[#535355ba] dark:border-slate-400/10 text-center"
            style="text-align: -webkit-center"
          >
            <img
              class="rounded-full max-w-[10rem]"
              :src="item.item.thumb"
              alt="Rounded avatar"
            />
          </td>
          <td
            :class="[index != top_trendings.length - 1 ? `border-b` : '']"
            class="pl-2 pr-4 font-bold align-middle border-[#535355ba] dark:border-slate-400/10"
          >
            {{ item.item.symbol }}
          </td>
          <td
            :class="[index != top_trendings.length - 1 ? `border-b` : '']"
            class="align-middle border-[#535355ba] dark:border-slate-400/10"
          >
            {{ item.item.name }}
          </td>
          <!-- class="font-bold align-middle border-[#535355ba] dark:border-slate-400/10 w-[50px]"
            :style="getStyle(0)" -->
          <td
            :class="[index != top_trendings.length - 1 ? `border-b` : '']"
            class="font-bold align-middle border-[#535355ba] dark:border-slate-400/1 text-white text-right"
          >
            $ {{ handlerPrice(item.item.price_btc) }}
          </td>
        </tr>
      </tbody>
    </table>
  </BlockChart>
</template>
<script>
import { TOPTRENDING_API, HEATMAP_V2_API } from "@/services/api";
import BlockChart from "@/components/BlockChart.vue";
import { handlerPrice } from "@/ultis/number";
export default {
  components: {
    BlockChart,
  },
  name: "top-trending",
  data: () => ({
    top_trendings: [],
    btc_price: 0,
    loading: false,
    params: {
      currency: "USD",
      sort: "rank",
      order: "ascending",
      offset: 0,
      limit: 500,
      meta: true,
    },
  }),
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        let heatmap = await HEATMAP_V2_API(this.params);
        this.btc_price = heatmap?.data?.find((x) => x.code == "BTC")?.rate ?? 0;
        const res = await TOPTRENDING_API();
        this.top_trendings = res?.data?.coins || [];
      } catch (error) {
        this.top_trendings = [];
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    handlerPrice(price) {
      return handlerPrice(price * this.btc_price);
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
