<template>
  <div v-if="profileUser._id">
    <ProfileNavbar :user="profileUser" title="User details"></ProfileNavbar>
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
                  :src="
                    profileUser.avatar?.imageUrl
                      ? profileUser.avatar.imageUrl
                      : 'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg'
                  "
                  alt=""
                />
              </div>
            </div>
          </div>
          <div>
            <button
              v-if="user._id == profileUser._id"
              class="border bg-black border-gray-500 text-gray-200 hover:bg-gray-900 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-3xl mr-0 ml-auto"
              @click="showProfileEditModal = true"
            >
              Edit profile
            </button>
            <div v-else class="flex flex-inline gap-3">
              <button
                class="border bg-red-600 border-red-600 text-gray-100 hover:bg-red-700 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-3xl mr-0 ml-auto"
                @click="block"
              >
                {{
                  user.blocked?.includes(profileUser._id) ? "Unblock" : "Block"
                }}
              </button>
              <button
                class="border bg-gray-100 border-gray-500 text-gray-900 hover:bg-gray-200 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-3xl mr-0 ml-auto"
                @click="follow"
                v-if="
                  !user.blocked?.includes(profileUser._id) &&
                  !profileUser.blocked.includes(user._id)
                "
              >
                {{
                  user.following.includes(profileUser._id)
                    ? "Unfollow"
                    : "Follow"
                }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-1 justify-center w-full mt-3 ml-3">
          <div>
            <h2 class="text-xl leading-6 font-bold text-white">
              {{ profileUser.name }}
            </h2>
            <p class="text-sm leading-5 font-medium text-gray-600">
              @{{ profileUser.username }}
            </p>
          </div>
          <div class="mt-3">
            <div class="text-gray-200 mt-3">
              {{ profileUser.description }}
            </div>
            <div class="text-gray-600 mt-3">
              <span class="flex mr-2">
                <font-awesome-icon icon="fa-solid fa-calendar-days" />
                <span class="leading-5 ml-1"
                  >Joined {{ createdDateUser(profileUser.createdAt) }}</span
                ></span
              >
            </div>
          </div>
          <div class="pt-3 flex justify-start items-start w-full text-sm">
            <div class="text-center pr-2">
              <span class="font-bold text-white">{{
                profileUser.following.length
              }}</span
              ><span class="text-gray-600"> Following</span>
            </div>
            <div class="text-center px-2">
              <span class="font-bold text-white"
                >{{ profileUser.followers.length }} </span
              ><span class="text-gray-600"> Followers</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-gray-700" />
    </div>
    <div>
      <div v-if="user.blocked?.includes(profileUser._id)" class="m-4">
        You blocked this user!
      </div>
      <div v-else-if="profileUser.blocked.includes(user._id)" class="m-4">
        This user blocked you!
      </div>
      <div>
        <Tweet v-for="tweet in tweets" :tweet="tweet" :key="tweet.id"></Tweet>
      </div>
    </div>
    <ProfileEditModal
      :showProfileEditModal="showProfileEditModal"
      @close-modal="closeEditUserModal"
      v-if="user._id == profileUser._id"
    ></ProfileEditModal>
  </div>
</template>

<script>
import ProfileNavbar from "./ProfileNavbar";
import axios from "axios";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import Tweet from "../home/Tweet";
import { InfiniteScrollDownMixin } from "../../mixins/InfiniteScrollDownMixin";
import ProfileEditModal from "./ProfileEditModal";

export default {
  name: "UserDetails",
  components: {
    ProfileNavbar,
    Tweet,
    ProfileEditModal,
  },
  mixins: [InfiniteScrollDownMixin],
  data() {
    return {
      profileUser: {},
      tweets: [],
      showProfileEditModal: false,
    };
  },
  computed: {
    ...mapGetters("user", ["jwt", "user"]),
    createdDateUser() {
      return (arg) => {
        return moment(arg).format("MMMM YYYY");
      };
    },
  },
  mounted() {
    const username = this.$route.params.username;
    if (this.jwt) {
      this.fetchData(username);
    }
  },
  beforeUnmount() {
    window.onscroll = null;
  },
  async beforeRouteUpdate(to) {
    this.resetUserDetails();
    this.fetchData(to.params.username);
  },
  methods: {
    ...mapActions("user", [
      "followUser",
      "unfollowUser",
      "blockUser",
      "unblockUser",
    ]),

    resetUserDetails() {
      this.profileUser = {};
      this.tweets = [];
      this.showProfileEditModal = false;
    },
    closeEditUserModal() {
      this.showProfileEditModal = false;
      this.resetUserDetails();
      this.getUserDetails(this.$route.params.username);
    },
    async fetchData(username) {
      await this.getUserDetails(username);

      window.onscroll = () => {
        this.attachInfiniteScroll(this.getUserPosts);
      };
    },
    async getUserDetails(username) {
      await axios
        .get("http://localhost:3000/users/user/" + username, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          this.profileUser = response.data.user;
          this.getUserPosts(this.profileUser._id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserPosts() {
      let url = `http://localhost:3000/posts/user/${this.profileUser._id}`;

      if (this.tweets.length) {
        url += `?createdAt=${this.tweets[this.tweets.length - 1].createdAt}`;
      }
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          if (response.data.posts.length) {
            this.tweets = [...this.tweets, ...response.data.posts];
          } else {
            this.setContentOver();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async follow() {
      await axios
        .patch(
          "http://localhost:3000/users/follow",
          {
            userToFollow: this.profileUser._id,
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
            },
          }
        )
        .then((response) => {
          if (response.data.message == "Followed user") {
            this.followUser(this.profileUser._id);
            this.profileUser.followers.unshift(this.user._id);
          } else {
            this.unfollowUser(this.profileUser._id);
            this.profileUser.followers = this.profileUser.followers.filter(
              (u) => u !== this.user._id
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async block() {
      await axios
        .patch(
          "http://localhost:3000/users/block",
          {
            userToBlock: this.profileUser._id,
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
            },
          }
        )
        .then((response) => {
          if (response.data.message == "Blocked user") {
            this.blockUser(this.profileUser._id);
            if (this.user.following.includes(this.profileUser._id)) {
              this.unfollowUser(this.profileUser._id);
              this.profileUser.followers = this.profileUser.followers.filter(
                (u) => u !== this.user._id
              );
            }
            if (this.profileUser.following.includes(this.user._id)) {
              this.profileUser.following = this.profileUser.following.filter(
                (u) => u !== this.user._id
              );
            }
            this.tweets = [];
          } else {
            this.unblockUser(this.profileUser._id);
            this.getUserPosts();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
