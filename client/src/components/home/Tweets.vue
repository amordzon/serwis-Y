<template>
  <div>
    <TweetsType
      :tweetsType="tweetsType"
      @change-tweets-type="changeTweetsType"
    ></TweetsType>
    <NewPost @add-post="addPost"></NewPost>

    <hr class="border-gray-700" />
    <div v-if="allTweets.length">
      <div v-if="newFollowingPosts && tweetsType == 'following'">
        <div class="p-4 text-center">
          <div
            class="hover:underline hover:cursor-pointer"
            @click="resetTweets"
          >
            Click here to load new posts
          </div>
        </div>

        <hr class="border-gray-700" />
      </div>
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
import Swal from "sweetalert2";

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
      newFollowingPosts: false,
    };
  },
  mixins: [InfiniteScrollDownMixin],
  computed: {
    ...mapGetters("tweet", ["allTweets"]),
    ...mapGetters("user", ["jwt", "user"]),
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
    tweetsType(value) {
      if (value == "all") {
        this.leaveFollowingRoom(this.user._id);
      }
      this.resetTweets();
    },
    newFollowingPosts(value) {
      if (value == true) {
        Swal.fire({
          toast: true,
          title: "There are new posts!",
          animation: true,
          position: "bottom",
          showConfirmButton: false,
          background: "#1d9bf0",
          color: "white",
          padding: "0.5em 0 0.5em",
        });
      }
    },
  },
  methods: {
    ...mapActions("tweet", ["fetchTweets", "addTweet", "clearTweets"]),
    ...mapActions("socketio", [
      "joinFollowingRoom",
      "subscribeToNewFollowingPost",
      "leaveFollowingRoom",
    ]),

    resetTweets() {
      this.clearTweets();
      this.getAllTweets();
      this.resetNotification();
    },
    resetNotification() {
      this.newFollowingPosts = false;
      Swal.update({
        hideClass: {
          popup: "",
          backdrop: "",
        },
      });
      Swal.close();
    },
    changeTweetsType(type) {
      this.tweetsType = type;
      this.resetContentOver();
    },
    async getAllTweets() {
      if (this.tweetsType == "following") {
        this.joinFollowingRoom(this.user._id);
        this.subscribeToNewFollowingPost(() => {
          this.newFollowingPosts = true;
        });
      }
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
