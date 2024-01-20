<template>
  <div class="w-5/6 sm:w-4/5 lg:w-6/12 border-r border-r-gray-700">
    <Tweets></Tweets>
  </div>
</template>

<script>
import Tweets from "./Tweets";

export default {
  name: "HomePage",
  components: {
    Tweets,
  },
};
</script>
