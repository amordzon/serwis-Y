<template>
  <div>
    <TweetsType
      :tweetsType="tweetsType"
      @change-tweets-type="changeTweetsType"
    ></TweetsType>
    <NewPost @add-post="addPost"></NewPost>
    <Tweet v-for="tweet in allTweets" :tweet="tweet" :key="tweet.id"></Tweet>
  </div>
</template>

<script>
import axios from "axios";
import Tweet from "./Tweet";
import TweetsType from "./TweetsType";
import NewPost from "./NewPost";
import { mapGetters } from "vuex";

export default {
  name: "TweetsComponent",
  components: {
    Tweet,
    TweetsType,
    NewPost,
  },
  data() {
    return {
      allTweets: [],
      tweetsType: "following",
    };
  },
  mounted() {
    if (this.jwt) {
      this.getAllTweets();
    }
  },
  computed: {
    ...mapGetters("user", ["jwt"]),
  },
  watch: {
    tweetsType() {
      this.getAllTweets();
    },
  },
  methods: {
    async getAllTweets() {
      await axios
        .get("http://localhost:3000/posts?tweetsType=" + this.tweetsType, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          this.allTweets = response.data.posts;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeTweetsType(type) {
      this.tweetsType = type;
    },
    addPost(post) {
      this.allTweets.unshift(post);
    },
  },
};
</script>
