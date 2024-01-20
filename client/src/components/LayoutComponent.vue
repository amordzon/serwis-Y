<template>
  <div class="flex">
    <SideBar></SideBar>
    <router-view></router-view>
    <div class="hidden lg:block lg:w-3/12">
      <Search></Search>
    </div>
  </div>
</template>

<script>
import SideBar from "./SideBar";
import Search from "./Search";

export default {
  name: "LayoutComponent",
  components: {
    SideBar,
    Search,
  },
};
</script>
