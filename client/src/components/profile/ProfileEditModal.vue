<template>
  <div>
    <BaseModal :show="showProfileEditModal">
      <div class="p-4 flex items-center justify-center flex-col relative">
        <div
          class="absolute text-xl top-0 right-0 p-4 cursor-pointer"
          @click="close()"
        >
          x
        </div>
        <div class="text-2xl font-bold tracking-wide mt-4 mb-8">
          Edit profile
        </div>
        <form
          class="w-full mx-auto text-center"
          @submit.prevent="handleSubmission"
        >
          <div class="mb-6">
            <img
              v-show="previewImage"
              :src="previewImage"
              class="inline-block h-16 w-16 rounded-full mb-4"
            />
            <label
              for="email"
              class="block text-lg mb-4 font-medium text-gray-900 dark:text-white"
              >Upload Profile Picture</label
            >
            <input
              type="file"
              @change="uploadImage"
              accept="image/png, image/jpg, image/jpeg"
              class="cursor-pointer text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-white"
            />
          </div>
          <div class="mb-5">
            <label
              for="email"
              class="block text-lg font-medium text-gray-900 dark:text-white"
              >About you</label
            >
            <textarea
              id="aboutYou"
              class="form-input"
              rows="2"
              cols="50"
              placeholder="About you"
              v-model="description"
            ></textarea>
          </div>
          <button
            class="mt-8 mb-6 text-black bg-gray-100 hover:bg-gray-200 font-semibold py-3 w-3/4 rounded-full"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import BaseModal from "../BaseModal";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "PostModal",
  components: {
    BaseModal,
  },
  props: ["showProfileEditModal"],
  data() {
    return {
      previewImage:
        "https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg",
      description: "",
      img: "",
    };
  },

  computed: {
    ...mapGetters("user", ["jwt", "user"]),
  },
  mounted() {
    if (this.jwt) {
      this.fetchData();
    }
  },
  methods: {
    ...mapActions("user", ["editProfile"]),
    fetchData() {
      console.log("fetching", this.user.description);
      this.previewImage = this.user.avatar?.imageUrl
        ? this.user.avatar?.imageUrl
        : "https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg";
      this.description = this.user.description ? this.user.description : "";
    },
    async handleSubmission() {
      await axios
        .put(
          "http://localhost:3000/users/",
          {
            img: this.img,
            description: this.description,
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
              "content-type": "multipart/form-data",
            },
          }
        )
        .then(async (response) => {
          console.log(response);
          this.editProfile({
            avatar: response.data.User.avatar?.imageUrl
              ? response.data.User.avatar.imageUrl
              : "",
            description: response.data.User.description
              ? response.data.User.description
              : "",
          });
          Swal.fire({
            toast: true,
            title: "Profile updated!",
            animation: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            background: "#1d9bf0",
            color: "white",
            timerProgressBar: false,
            padding: "0.5em 0 0.5em",
          });
          this.close();
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
    close() {
      this.$emit("close-modal");
      this.clearData();
    },
    clearData() {
      this.img = "";
      this.previewImage = this.user.avatar?.imageUrl
        ? this.user.avatar.imageUrl
        : "https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg";
      this.description = this.user.description ? this.user.description : "";
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
