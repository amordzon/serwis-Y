<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  background-color: #000000;
  color: #e7e9ea;
}

iframe#webpack-dev-server-client-overlay {
  display: none !important;
}
</style>
