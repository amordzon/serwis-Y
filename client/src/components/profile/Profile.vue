<template>
  <div class="flex">
    <SideBar></SideBar>
    <div class="w-6/12 border-r border-r-gray-700">
      <router-view></router-view>
    </div>
    <div class="w-3/12">
      <Search></Search>
    </div>
  </div>
</template>

<script>
import SideBar from "../SideBar";
import Search from "../Search";

export default {
  name: "ProfileComponent",
  components: {
    SideBar,
    Search,
  },
};
</script>
