<template>
  <div v-if="user">
    <ProfileNavbar :user="user"></ProfileNavbar>
    <div>
      <div class="w-full bg-gray-800 h-48">
        <div class="opacity-0 w-full h-full"></div>
      </div>
      <div class="p-4">
        <div class="flex w-full">
          <div class="flex flex-1">
            <div style="margin-top: -6rem">
              <div class="rounded-full relative">
                <img
                  class="rounded-full border-4 border-gray-900 h-40 w-40"
                  :src="user.avatar"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div>
            <button
              class="border bg-black border-gray-500 text-gray-200 hover:bg-gray-900 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-3xl mr-0 ml-auto"
            >
              Set up profile
            </button>
          </div>
        </div>

        <div class="space-y-1 justify-center w-full mt-3 ml-3">
          <div>
            <h2 class="text-xl leading-6 font-bold text-white">
              {{ user.name }}
            </h2>
            <p class="text-sm leading-5 font-medium text-gray-600">
              @{{ user.username }}
            </p>
          </div>
          <div class="mt-3">
            <div class="text-gray-600 mt-3">
              <span class="flex mr-2">
                <font-awesome-icon icon="fa-solid fa-calendar-days" />
                <span class="leading-5 ml-1"
                  >Joined {{ createdDateUser(user.createdAt) }}</span
                ></span
              >
            </div>
          </div>
          <div class="pt-3 flex justify-start items-start w-full text-sm">
            <div class="text-center pr-2">
              <span class="font-bold text-white">1</span
              ><span class="text-gray-600"> Following</span>
            </div>
            <div class="text-center px-2">
              <span class="font-bold text-white">0 </span
              ><span class="text-gray-600"> Followers</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-gray-700" />
    </div>
    <div>
      <Tweet v-for="tweet in tweets" :tweet="tweet" :key="tweet.id"></Tweet>
    </div>
  </div>
</template>

<script>
import ProfileNavbar from "./ProfileNavbar";
import axios from "axios";
import moment from "moment";
import { mapGetters } from "vuex";
import Tweet from "../home/Tweet";

export default {
  name: "UserDetails",
  components: {
    ProfileNavbar,
    Tweet,
  },
  data() {
    return {
      user: {},
      tweets: {},
    };
  },
  computed: {
    ...mapGetters("user", ["jwt"]),
    createdDateUser() {
      return (arg) => {
        return moment(arg).format("MMMM YYYY");
      };
    },
  },
  mounted() {
    const username = this.$route.params.username;
    if (this.jwt) {
      this.getUserDetails(username);
    }
  },
  methods: {
    async getUserDetails(username) {
      await axios
        .get("http://localhost:3000/users/user/" + username, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          this.user = response.data.user;
          this.getUserPosts(this.user._id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserPosts(userID) {
      await axios
        .get("http://localhost:3000/posts/user/" + userID, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          this.tweets = response.data.posts;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
