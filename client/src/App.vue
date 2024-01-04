<template>
  <div class="m-4 p-4">
    <router-view class="mx-auto my-4 mx-6"></router-view>
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
