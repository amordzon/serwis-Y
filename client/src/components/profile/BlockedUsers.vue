<template>
  <div v-if="profileUser._id">
    <ProfileNavbar :user="profileUser" title="Blocked users"></ProfileNavbar>
    <div v-if="profileUser.blocked.length">
      <div v-for="user in profileUser.blocked" :key="user._id">
        <div class="flex w-full items-center justify-between">
          <div class="flex p-4">
            <div>
              <img
                class="inline-block h-10 w-10 rounded-full"
                :src="
                  user.avatar?.imageUrl
                    ? user.avatar.imageUrl
                    : 'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg'
                "
                alt=""
              />
            </div>
            <div class="ml-3">
              <p class="text-base leading-6 font-medium text-white">
                {{ user.name }}
              </p>
              <p
                class="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150"
              >
                @{{ user.username }}
              </p>
            </div>
          </div>
          <div class="pr-5">
            <button
              class="border bg-red-600 border-red-600 text-gray-100 hover:bg-red-700 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-3xl mr-0 ml-auto"
              @click="unblock(user._id)"
            >
              Unblock
            </button>
          </div>
        </div>
        <hr class="border-gray-600" />
      </div>
    </div>
    <div v-else class="p-2">You didn't block any users</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import ProfileNavbar from "./ProfileNavbar";

export default {
  name: "BlockedUsers",
  components: {
    ProfileNavbar,
  },
  data() {
    return {
      profileUser: {},
    };
  },
  computed: {
    ...mapGetters("user", ["jwt", "user"]),
  },
  mounted() {
    const username = this.$route.params.username;
    if (this.jwt) {
      this.getBlockedUsers(username);
    }
  },
  methods: {
    ...mapActions("user", ["unblockUser"]),
    async getBlockedUsers() {
      await axios
        .get("http://localhost:3000/users/blocked/", {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        })
        .then((response) => {
          this.profileUser = response.data.user;
          console.log(this.profileUser._id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async unblock(userID) {
      await axios
        .patch(
          "http://localhost:3000/users/block",
          {
            userToBlock: userID,
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
            },
          }
        )
        .then((response) => {
          if (response.data.message == "Unblocked user") {
            this.unblockUser(userID);
            this.profileUser.blocked = this.profileUser.blocked.filter(
              (u) => u._id !== userID
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
