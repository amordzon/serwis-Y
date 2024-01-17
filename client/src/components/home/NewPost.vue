<template>
  <div v-if="user">
    <form @submit.prevent="handleSubmission">
      <div class="flex ml-3 mt-2">
        <div class="m-2 w-12 py-1">
          <img
            class="h-10 w-10 rounded-full"
            :src="
              user.avatar?.imageUrl
                ? user.avatar.imageUrl
                : 'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg'
            "
            alt=""
          />
        </div>
        <div class="px-2 pt-2 mt-2">
          <textarea
            class="bg-transparent text-gray-400 font-normal text-xl w-full"
            rows="2"
            cols="50"
            :placeholder="getPlaceholderText"
            v-model="body"
          ></textarea>
        </div>
      </div>

      <div class="w-4/5 ml-16">
        <QuotedTweet
          v-if="quotedPost && quotedPost.user && !refPost"
          :quotedPost="quotedPost"
          :createdDateWithArg="createdDateWithArg"
        >
        </QuotedTweet>
      </div>

      <div class="flex">
        <div class="w-10"></div>

        <div class="px-2">
          <div class="flex-1 text-center px-1 py-1 m-2">
            <a
              class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full cursor-pointer"
              target="_blank"
              title="Media"
            >
              <font-awesome-icon
                icon="fa-regular fa-image"
                class="text-center h-7 w-6"
              />
            </a>
          </div>
        </div>

        <div class="flex-1">
          <button
            class="bg-sky-500 mt-5 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-full mr-8 float-right"
            type="submit"
          >
            Post
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import QuotedTweet from "../home/QuotedTweet";
import moment from "moment";

export default {
  name: "NewPost",
  components: {
    QuotedTweet,
  },
  props: ["quotedPost", "refPost"],
  data() {
    return {
      body: "",
    };
  },
  computed: {
    ...mapGetters("user", ["jwt", "user"]),
    createdDateWithArg() {
      return (arg) => {
        return moment(arg).fromNow();
      };
    },
    getPlaceholderText() {
      return this.refPost ? "Post your reply" : "What's happening?!";
    },
  },
  methods: {
    async handleSubmission() {
      const reqBody = {
        body: this.body,
      };
      if (this.quotedPost) {
        reqBody.quoted = this.quotedPost._id;
      }
      if (this.refPost) {
        reqBody.base = this.refPost;
      }
      axios
        .post("http://localhost:3000/posts", reqBody, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then(async (response) => {
          console.log(response);
          this.resetForm();
          Swal.fire({
            toast: true,
            title: "New post created!",
            animation: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            background: "#1d9bf0",
            color: "white",
            timerProgressBar: false,
            padding: "0.5em 0 0.5em",
          });
          this.$emit("add-post", response.data.Post);
        })
        .catch((error) => {
          console.log("error ", error);
          Swal.fire({
            toast: true,
            title: error.response.data.message,
            animation: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            background: "#1d9bf0",
            color: "white",
            timerProgressBar: false,
            padding: "0.5em 0 0.5em",
          });
        });
    },
    resetForm() {
      this.body = "";
    },
  },
};
</script>

<style scoped>
textarea {
  border: none;
  overflow: auto;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  resize: none;
}
</style>
