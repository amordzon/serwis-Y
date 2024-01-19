<template>
  <div class="flex">
    <SideBar></SideBar>
    <div class="w-6/12 border-r border-r-gray-700">
      <div class="flex justify-start mt-2">
        <div class="px-5 py-2">
          <a
            @click="$router.go(-1)"
            class="cursor-pointer text-2xl font-medium rounded-full text-gray-200 hover:bg-gray-800 float-right"
          >
            <font-awesome-icon
              icon="fa-solid fa-arrow-left"
              class="m-2 h-5 w-5"
            />
          </a>
        </div>
        <div class="py-2">
          <h2 class="text-2xl font-bold text-white">Post</h2>
        </div>
      </div>
      <div v-if="post.user">
        <Tweet
          v-for="tweet in ancestors"
          :tweet="tweet"
          :key="tweet.id"
          mode="ancestor"
        ></Tweet>
        <Tweet :tweet="post" mode="view" ref="currTweetRef"></Tweet>
        <hr class="border-gray-700" />
        <NewPost :refPost="post._id" @add-post="addCommentPost"></NewPost>
        <hr class="border-gray-700" />
        <Tweet
          v-for="tweet in comments"
          :tweet="tweet"
          :key="tweet.id"
          mode="view"
        ></Tweet>
      </div>
    </div>
    <div class="w-3/12">
      <Search></Search>
    </div>
  </div>
</template>

<script>
import SideBar from "../SideBar";
import Search from "../Search";
import Tweet from "../home/Tweet";
import NewPost from "../home/NewPost";
import axios from "axios";
import { mapGetters } from "vuex";
import { InfiniteScrollDownMixin } from "../../mixins/InfiniteScrollDownMixin";
import { InfiniteScrollUpMixin } from "../../mixins/InfiniteScrollUpMixin";
import Swal from "sweetalert2";
import {
  setupSocketConnection,
  joinRoom,
  leaveRoom,
  newPost,
  disconnectSocket,
  subscribeToNewPost,
} from "../../services/socketio";

export default {
  name: "PostDetails",
  components: {
    SideBar,
    Search,
    Tweet,
    NewPost,
  },
  mixins: [InfiniteScrollDownMixin, InfiniteScrollUpMixin],
  data() {
    return {
      post: {},
      comments: [],
      ancestors: [],
      pageComments: 1,
      pageAncestors: 1,
      ref: null,
      newPosts: false,
    };
  },
  computed: {
    ...mapGetters("user", ["jwt"]),
  },
  mounted() {
    const postID = this.$route.params.id;
    if (this.jwt) {
      this.fetchData(postID);
    }
  },
  beforeUnmount() {
    this.resetNotification();
  },
  watch: {
    newPosts(value) {
      if (value == true) {
        Swal.fire({
          toast: true,
          title: "Refresh to see new posts",
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
  async beforeRouteUpdate(to) {
    await this.resetNotification();
    this.post = {};
    this.comments = [];
    this.ancestors = [];
    this.pageComments = 1;
    this.pageAncestors = 1;
    this.ref = null;
    this.newPosts = false;
    this.fetchData(to.params.id);
  },
  methods: {
    async resetNotification() {
      this.newPosts = false;
      Swal.update({
        hideClass: {
          popup: "",
          backdrop: "",
        },
      });
      Swal.close();
      leaveRoom(this.post._id);
      disconnectSocket();
    },
    async fetchData(postID) {
      try {
        setupSocketConnection(this.jwt);
        await this.getPost(postID);
        window.onscroll = () => {
          this.attachInfiniteScroll(this.getPostComments);
          this.attachInfiniteScrollUp(this.getPostAncestors);
        };
        this.scrollToElement();
        joinRoom(this.post._id);
        subscribeToNewPost(() => {
          this.newPosts = true;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getPost(postID) {
      await axios
        .get("http://localhost:3000/posts/post/" + postID, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then(async (response) => {
          if (response.data.post) {
            this.post = response.data.post;

            await this.getPostComments();
            await this.getPostAncestors();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getPostComments() {
      await axios
        .get(
          "http://localhost:3000/posts/post/" +
            this.post._id +
            "/comments?page=" +
            this.pageComments,
          {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
            },
          }
        )
        .then((response) => {
          if (response.data.comments.length) {
            this.comments = [...this.comments, ...response.data.comments];
            this.pageComments++;
          } else {
            this.setContentOver();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getPostAncestors() {
      await axios
        .get(
          "http://localhost:3000/posts/post/" +
            this.post._id +
            "/ancestors?page=" +
            this.pageAncestors,
          {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
            },
          }
        )
        .then((response) => {
          if (response.data.ancestors.length) {
            this.ancestors = [...response.data.ancestors, ...this.ancestors];
            this.pageAncestors++;
          } else {
            this.setContentUpOver();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCommentPost(comment) {
      this.comments.unshift(comment);
      this.post.refPostCount += 1;
      newPost(this.post._id);
    },
    scrollToElement() {
      if (
        this.$refs.currTweetRef &&
        this.$refs.currTweetRef.$el &&
        this.ancestors.length > 0
      ) {
        this.$refs.currTweetRef.$el.scrollIntoView();
      }
    },
  },
};
</script>
