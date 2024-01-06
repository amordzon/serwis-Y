<template>
  <div class="flex">
    <SideBar></SideBar>
    <div class="w-6/12 border-r border-r-gray-700">
      <TweetsType></TweetsType>
      <NewPost></NewPost>
      <Tweets></Tweets>
    </div>
    <div class="w-3/12">
      <Search></Search>
    </div>
  </div>
</template>

<script>
import SideBar from "../SideBar";
import TweetsType from "./TweetsType";
import NewPost from "./NewPost";
import Tweets from "./Tweets";
import Search from "./Search";

export default {
  name: "HomePage",
  components: {
    SideBar,
    TweetsType,
    NewPost,
    Tweets,
    Search,
  },
};
</script>
