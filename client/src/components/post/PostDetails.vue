<template>
  <div class="flex">
    <SideBar></SideBar>
    <div class="w-6/12 border-r border-r-gray-700">
      <div class="flex justify-start mt-2">
        <div class="px-5 py-2">
          <a
            href=""
            class="text-2xl font-medium rounded-full text-gray-200 hover:bg-gray-800 float-right"
            target="_blank"
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
          v-for="tweet in post.ancestors"
          :tweet="tweet"
          :key="tweet.id"
          mode="ancestor"
        ></Tweet>
        <Tweet :tweet="post" mode="view"></Tweet>
        <hr class="border-gray-700" />
        <NewPost :refPost="post._id" @add-post="addCommentPost"></NewPost>
        <hr class="border-gray-700" />
        <Tweet
          v-for="tweet in post.comments"
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

export default {
  name: "PostDetails",
  components: {
    SideBar,
    Search,
    Tweet,
    NewPost,
  },
  data() {
    return {
      post: {},
    };
  },
  computed: {
    ...mapGetters("user", ["jwt"]),
  },
  mounted() {
    const postID = this.$route.params.id;
    if (this.jwt) {
      this.getPost(postID);
    }
  },
  methods: {
    async getPost(postID) {
      await axios
        .get("http://localhost:3000/posts/post/" + postID, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          this.post = response.data.post;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCommentPost(comment) {
      this.post.comments.unshift(comment);
      this.post.refPostCount += 1;
    },
  },
};
</script>
