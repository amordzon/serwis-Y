<template>
  <div
    class="mx-auto w-1/6 sm:w-1/5 md:w-3/12 px-4 sm:px-8 md:px-6 py-1 text-white tracking-wide flex flex-col h-screen justify-between sticky top-0 border-r border-r-gray-700"
    v-if="user && user.user"
  >
    <nav class="mt-5 md:px-2">
      <router-link
        to="/"
        class="px-2 py-2 text-4xl font-bold leading-6 rounded-full hover:bg-gray-900 text-white cursor-pointer"
        >Y
      </router-link>
      <router-link
        to="/"
        class="group flex items-center px-2 py-3 mt-2 text-xl leading-6 rounded-full hover:bg-gray-900 text-white cursor-pointer"
      >
        <font-awesome-icon icon="fa-solid fa-house" class="mr-4 h-6 w-6" />
        <p class="hidden md:block">Home</p>
      </router-link>
      <a
        class="mt-1 group flex items-center px-2 py-3 text-xl leading-6 rounded-full hover:bg-gray-900 cursor-pointer"
        target="_blank"
      >
        <font-awesome-icon
          icon="fa-solid fa-magnifying-glass"
          class="mr-4 h-6 w-6"
        />
        <p class="hidden md:block">Explore</p>
      </a>
      <router-link
        :to="'/profile/' + user.user.username"
        class="mt-1 group flex items-center px-2 py-3 text-xl leading-6 rounded-full hover:bg-gray-900 cursor-pointer"
      >
        <font-awesome-icon icon="fa-regular fa-user" class="mr-4 h-6 w-6" />
        <p class="hidden md:block">Profile</p>
      </router-link>
      <router-link
        to="/profile/blocked"
        class="mt-1 group flex items-center px-2 py-3 text-xl leading-6 rounded-full hover:bg-gray-900 cursor-pointer"
      >
        <font-awesome-icon icon="fa-solid fa-user-lock" class="mr-4 h-6 w-6" />
        <p class="hidden md:block">Blocked Users</p>
      </router-link>

      <button
        class="hidden md:block bg-sky-500 cursor-pointer hover:bg-sky-600 w-full mt-8 text-white font-bold py-2 md:py-3 md:px-4 rounded-full"
        @click="showModal"
      >
        Post
      </button>
      <button
        class="md:hidden block bg-sky-500 cursor-pointer hover:bg-sky-600 w-3/4 sm:w-2/3 mt-8 text-white font-bold py-2 rounded-full"
        @click="showModal"
      >
        +
      </button>
      <PostModal></PostModal>
    </nav>

    <div
      class="flex-shrink-0 flex hover:bg-blue-00 rounded-full py-4 lg:p-4 mt-12 md:mr-2"
    >
      <div class="md:flex w-full items-center justify-between">
        <router-link
          :to="'/profile/' + user.user.username"
          class="flex-shrink-0 group block w-full"
        >
          <div class="flex">
            <div>
              <img
                class="inline-block h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full"
                :src="
                  user.user.avatar?.imageUrl
                    ? user.user.avatar.imageUrl
                    : 'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg'
                "
                alt=""
              />
            </div>
            <div class="ml-3 hidden md:block">
              <p class="text-base leading-6 font-medium text-white">
                {{ user.user.name }}
              </p>
              <p
                class="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150"
              >
                @{{ user.user.username }}
              </p>
            </div>
          </div>
        </router-link>
        <div>
          <p
            class="cursor-pointer text-gray-300 hover:text-gray-100 text-xl mt-4 md:mx-0 md:text-base"
            @click="signOut"
          >
            <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import PostModal from "./post/PostModal";

export default {
  name: "SideBar",
  components: {
    PostModal,
  },
  mounted() {
    if (!this.isLogged) {
      this.$router.push("/auth");
    }
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters("user", ["isLogged"]),
  },
  methods: {
    ...mapActions("postModal", ["showModal"]),
    ...mapActions("user", ["logOut"]),
    ...mapActions("socketio", ["disconnect"]),

    signOut() {
      this.logOut();
      this.disconnect();
      this.$router.push("/auth");
    },
  },
};
</script>
