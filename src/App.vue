<template>
  <div id="app">
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from "@/views/Dashboard.vue";

export default {
  name: "App",
  components: {
    Dashboard,
  },
  created(){
    console.log(process.env)
  }
};
</script>

<style>

</style>
