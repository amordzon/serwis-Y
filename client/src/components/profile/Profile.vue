<template>
  <div class="flex">
    <SideBar></SideBar>
    <div class="w-6/12 border-r border-r-gray-700">
      <UserDetails></UserDetails>
    </div>
    <div class="w-3/12">
      <Search></Search>
    </div>
  </div>
</template>

<script>
import SideBar from "../SideBar";
import Search from "../Search";
import UserDetails from "./UserDetails.vue";

export default {
  name: "HomePage",
  components: {
    SideBar,
    Search,
    UserDetails,
  },
};
</script>
