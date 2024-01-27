<template>
  <div class="w-5/6 sm:w-4/5 lg:w-6/12 border-r border-r-gray-700">
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
      <div v-if="newPosts">
        <div class="p-4 text-center">
          <div
            class="hover:underline hover:cursor-pointer"
            @click="resetComments"
          >
            Click here to load new comments
          </div>
        </div>

        <hr class="border-gray-700" />
      </div>
      <Tweet
        v-for="tweet in comments"
        :tweet="tweet"
        :key="tweet.id"
        mode="view"
      ></Tweet>
    </div>
  </div>
</template>

<script>
import Tweet from "../home/Tweet";
import NewPost from "../home/NewPost";
import { mapGetters, mapActions } from "vuex";
import { InfiniteScrollDownMixin } from "../../mixins/InfiniteScrollDownMixin";
import { InfiniteScrollUpMixin } from "../../mixins/InfiniteScrollUpMixin";
import Swal from "sweetalert2";
import PostService from "../../services/PostService";

export default {
  name: "PostDetails",
  components: {
    Tweet,
    NewPost,
  },
  mixins: [InfiniteScrollDownMixin, InfiniteScrollUpMixin],
  data() {
    return {
      post: {},
      comments: [],
      ancestors: [],
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
  async beforeRouteUpdate(to) {
    await this.resetNotification();
    this.post = {};
    this.comments = [];
    this.ancestors = [];
    this.ref = null;
    this.newPosts = false;
    this.fetchData(to.params.id);
  },
  methods: {
    ...mapActions("socketio", [
      "joinRoom",
      "newPost",
      "leaveRoom",
      "subscribeToNewPost",
    ]),

    async resetComments() {
      await this.resetNotification();
      this.comments = [];
      this.getPostComments();
    },
    async resetNotification() {
      this.newPosts = false;
      Swal.update({
        hideClass: {
          popup: "",
          backdrop: "",
        },
      });
      Swal.close();
      this.leaveRoom(this.post._id);
    },
    async fetchData(postID) {
      try {
        await this.getPost(postID);
        this.resetContentOver();
        this.resetContentUpOver();
        window.onscroll = () => {
          this.attachInfiniteScroll(this.getPostComments);
          this.attachInfiniteScrollUp(this.getPostAncestors);
        };
        this.scrollToElement();
        this.joinRoom(this.post._id);
        this.subscribeToNewPost(() => {
          this.newPosts = true;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getPost(postID) {
      await PostService.getPost(postID, this.jwt)
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
      let url = `/posts/post/${this.post._id}/comments`;

      if (this.comments.length) {
        url += `?createdAt=${
          this.comments[this.comments.length - 1].createdAt
        }`;
      }

      await PostService.getPostComm(url, this.jwt)
        .then((response) => {
          if (response.data.comments.length) {
            this.comments = [...this.comments, ...response.data.comments];
          } else {
            this.setContentOver();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getPostAncestors() {
      let url = `/posts/post/${this.post._id}/ancestors`;

      if (this.ancestors.length) {
        url += `?createdAt=${this.ancestors[0].createdAt}`;
      }

      await PostService.getPostAncestors(url, this.jwt)
        .then((response) => {
          if (response.data.ancestors.length) {
            this.ancestors = [...response.data.ancestors, ...this.ancestors];
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
      this.newPost(this.post._id);
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
