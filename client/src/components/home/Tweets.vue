<template>
  <div>
    <TweetsType
      :tweetsType="tweetsType"
      @change-tweets-type="changeTweetsType"
    ></TweetsType>
    <NewPost @add-post="addPost"></NewPost>

    <hr class="border-gray-700" />
    <div v-if="allTweets.length">
      <Tweet v-for="tweet in allTweets" :tweet="tweet" :key="tweet.id"></Tweet>
    </div>
    <div v-else class="p-4">There is no tweets!</div>
  </div>
</template>

<script>
import Tweet from "./Tweet";
import TweetsType from "./TweetsType";
import NewPost from "./NewPost";
import { mapGetters, mapActions } from "vuex";
import { InfiniteScrollDownMixin } from "../../mixins/InfiniteScrollDownMixin";
import PostService from "../../services/PostService";

export default {
  name: "TweetsComponent",
  components: {
    Tweet,
    TweetsType,
    NewPost,
  },
  data() {
    return {
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
    this.clearTweets();
  },
  watch: {
    tweetsType() {
      this.clearTweets();
      this.getAllTweets();
    },
  },
  methods: {
    ...mapActions("tweet", ["fetchTweets", "addTweet", "clearTweets"]),
    changeTweetsType(type) {
      this.tweetsType = type;
      this.resetContentOver();
    },
    async getAllTweets() {
      let url = `/posts?tweetsType=${this.tweetsType}`;
      if (this.allTweets.length) {
        url += `&createdAt=${
          this.allTweets[this.allTweets.length - 1].createdAt
        }`;
      }

      await PostService.getPosts(url, this.jwt).then(async (response) => {
        if (response.data.posts.length) {
          await this.fetchTweets(response.data.posts);
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
