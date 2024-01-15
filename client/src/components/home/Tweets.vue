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
import { InfiniteScrollDownMixin } from "../../mixins/InfiniteScrollDownMixin";
import axios from "axios";

export default {
  name: "TweetsComponent",
  components: {
    Tweet,
    TweetsType,
    NewPost,
  },
  data() {
    return {
      page: 1,
      tweetsType: "following",
    };
  },
  mixins: [InfiniteScrollDownMixin],
  computed: {
    ...mapGetters("tweet", ["allTweets"]),
    ...mapGetters("user", ["jwt"]),
  },
  mounted() {
    if (this.jwt) {
      this.getAllTweets();
      window.onscroll = () => {
        this.attachInfiniteScroll(this.getAllTweets);
      };
    }
  },
  beforeUnmount() {
    window.onscroll = null;
  },
  watch: {
    tweetsType() {
      this.clearTweets();
      this.page = 1;
      this.getAllTweets();
    },
  },
  methods: {
    ...mapActions("tweet", ["fetchTweets", "addTweet", "clearTweets"]),
    changeTweetsType(type) {
      this.tweetsType = type;
    },
    async getAllTweets() {
      await axios
        .get(
          `http://localhost:3000/posts?tweetsType=${this.tweetsType}&page=${this.page}`,
          {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
            },
          }
        )
        .then(async (response) => {
          if (response.data.posts.length) {
            await this.fetchTweets(response.data.posts);
            this.page++;
          } else {
            this.setContentOver();
          }
        });
    },
    addPost(post) {
      this.addTweet(post);
    },
  },
};
</script>
