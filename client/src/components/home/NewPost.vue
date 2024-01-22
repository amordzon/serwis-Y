<template>
  <div v-if="user">
    <form @submit.prevent="handleSubmission">
      <div class="flex ml-3 mt-2">
        <div class="m-2 w-12 py-1">
          <img
            class="h-8 w-8 md:h-10 md:w-10 rounded-full"
            :src="
              user.avatar?.imageUrl
                ? user.avatar.imageUrl
                : 'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg'
            "
            alt=""
          />
        </div>
        <div class="px-2 pt-2 mt-2 w-3/4 md:w-full">
          <textarea
            class="bg-transparent text-gray-400 font-normal text-xl w-full"
            rows="2"
            cols="50"
            :placeholder="getPlaceholderText"
            v-model="body"
          ></textarea>
        </div>
      </div>
      <div v-show="previewImage" class="w-4/5 ml-16 mt-4">
        <img :src="previewImage" class="inline-block rounded-lg mb-4" />
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
            <label
              class="mt-1 group cursor-pointer flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full cursor-pointer"
              title="Media"
              for="fileIMG"
            >
              <font-awesome-icon
                icon="fa-regular fa-image"
                class="text-center h-7 w-6"
              />
              <input
                type="file"
                id="fileIMG"
                @change="uploadImage"
                accept="image/png, image/jpg, image/jpeg"
                class="hidden"
              />
            </label>
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
import { mapGetters } from "vuex";
import { showNotification } from "../../utils/Notifications";
import QuotedTweet from "../home/QuotedTweet";
import moment from "moment";
import PostService from "../../services/PostService";

export default {
  name: "NewPost",
  components: {
    QuotedTweet,
  },
  props: ["quotedPost", "refPost"],
  data() {
    return {
      body: "",
      previewImage: "",
      img: "",
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
        img: this.img,
      };
      if (this.quotedPost) {
        reqBody.quoted = this.quotedPost._id;
      }
      if (this.refPost) {
        reqBody.base = this.refPost;
      }

      await PostService.postSubmission(reqBody, this.jwt)
        .then(async (response) => {
          this.resetForm();
          showNotification({ title: "New post created!" });
          this.$emit("add-post", response.data.Post);
        })
        .catch((error) => {
          console.log("error ", error);

          showNotification({ title: error.response?.data.message });
        });
    },
    resetForm() {
      this.body = "";
      this.previewImage = "";
      this.img = "";
    },
    uploadImage(e) {
      const image = e.target.files[0];
      this.img = image;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
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
