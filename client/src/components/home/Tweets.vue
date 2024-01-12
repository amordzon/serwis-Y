<template>
  <div>
    <TweetsType
      :tweetsType="tweetsType"
      @change-tweets-type="changeTweetsType"
    ></TweetsType>
    <NewPost @add-post="addPost"></NewPost>

    <hr class="border-gray-700" />
    <Tweet v-for="tweet in allTweets" :tweet="tweet" :key="tweet.id"></Tweet>
  </div>
</template>

<script>
import Tweet from "./Tweet";
import TweetsType from "./TweetsType";
import NewPost from "./NewPost";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TweetsComponent",
  components: {
    Tweet,
    TweetsType,
    NewPost,
  },
  computed: {
    ...mapGetters("tweet", ["allTweets", "tweetsType"]),
    ...mapGetters("user", ["jwt"]),
  },
  mounted() {
    if (this.jwt) {
      this.getAllTweets();
    }
  },
  watch: {
    tweetsType() {
      this.getAllTweets();
    },
  },
  methods: {
    ...mapActions("tweet", ["fetchTweets", "changeTweetsType", "addTweet"]),
    async getAllTweets() {
      await this.fetchTweets();
    },
    addPost(post) {
      this.addTweet(post);
    },
  },
};
</script>
