<template>
  <div class="bg-[#16151a] w-screen py-6 px-8">
    <div class="grid grid-cols-1 gap-4 mb-4">
      <Heatmap @BTC="(data) => (btc = data)" @ETH="(data) => (eth = data)" />
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="xl:col-span-9 lg:col-span-8 md:col-span-12">
        <TotalMarketCap />
      </div>
      <div class="xl:col-span-3 lg:col-span-4 md:col-span-12">
        <FearGreenIndex />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="xl:col-span-9 lg:col-span-8 md:col-span-12">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <Dom
            class="md:col-span-1 sm:col-span-3 sm:mb-4 md:mb-0"
            :price="btc.price"
            :change24h="btc.change24h"
            :api="DOM_API"
            key-field="btcDominance"
            title="BTC.Dom"
          />
          <Dom
            class="md:col-span-1 sm:col-span-3 sm:mb-4 md:mb-0"
            :price="eth.price"
            :change24h="eth.change24h"
            :api="DOM_API"
            key-field="ethDominance"
            title="ETH.Dom"
          />
          <Dom
            class="md:col-span-1 sm:col-span-3 sm:mb-4 md:mb-0"
            :api="DOM_API"
            key-field="stablecoinDominance"
            title="Stablecoin.Dom"
          />
        </div>
        <div>
          <DominanceRatio />
        </div>
      </div>
      <div class="xl:col-span-3 lg:col-span-4 md:col-span-12">
        <TopTrending />
      </div>
    </div>
  </div>
</template>
<script>
import TotalMarketCap from "./TotalMarketCap.vue";
import FearGreenIndex from "./FearGreenIndex.vue";
import TopTrending from "./TopTrending.vue";
import DominanceRatio from "./DominanceRatio.vue";
import Heatmap from "./Heatmap.vue";
import Dom from "./Dom.vue";
import { BTC_API, ETH_API, STABLECOIN_API, DOM_API } from "@/services/api";
export default {
  components: {
    TotalMarketCap,
    FearGreenIndex,
    TopTrending,
    Dom,
    DominanceRatio,
    Heatmap,
  },
  name: "dash-board",
  data: () => ({
    eth: {
      price: 0,
      change24h: 0,
    },
    btc: {
      price: 0,
      change24h: 0,
    },
    BTC_API,
    ETH_API,
    STABLECOIN_API,
    DOM_API,
  }),
};
</script>
