<template>
  <div class="bg-[#2e2e33] px-3 py-2 rounded flex flex-col relative">
    <div class="grow-0 flex">
      <slot name="title">
        <div>
          <h2
            v-if="title"
            class="text-white font-bold text-[20px]"
            :class="[classTitle]"
          >
            {{ title }}
          </h2>
          <slot name="subtitle" />
        </div>
      </slot>
    </div>
    <div class="grow">
      <slot></slot>
    </div>
    <div
      v-if="loading"
      class="z-50 absolute w-full h-full flex justify-center items-center"
    >
      <Loading />
    </div>
  </div>
</template>
<script>
import Loading from "./Loading.vue";
export default {
  components: {
    Loading,
  },
  name: "block-chart",
  props: {
    title: {
      type: String,
    },
    classTitle: { type: String },
    loading: Boolean,
  },
};
</script>
