<template>
  <div
    class="w-3/12 px-6 py-1 text-white tracking-wide flex flex-col h-screen justify-between sticky top-0 border-r border-r-gray-700"
    v-if="user && user.user"
  >
    <nav class="mt-5 px-2">
      <router-link
        to="/"
        class="px-2 py-2 text-4xl font-bold leading-6 rounded-full hover:bg-gray-900 text-white cursor-pointer"
        >Y
      </router-link>
      <a
        class="group flex items-center px-2 py-3 mt-2 text-xl leading-6 rounded-full hover:bg-gray-900 text-white cursor-pointer"
        target="_blank"
      >
        <font-awesome-icon icon="fa-solid fa-house" class="mr-4 h-6 w-6" /> Home
      </a>
      <a
        class="mt-1 group flex items-center px-2 py-3 text-xl leading-6 rounded-full hover:bg-gray-900 cursor-pointer"
        target="_blank"
      >
        <font-awesome-icon
          icon="fa-solid fa-magnifying-glass"
          class="mr-4 h-6 w-6"
        />

        Explore
      </a>
      <a
        class="mt-1 group flex items-center px-2 py-3 text-xl leading-6 rounded-full hover:bg-gray-900 cursor-pointer"
        target="_blank"
      >
        <font-awesome-icon icon="fa-regular fa-user" class="mr-4 h-6 w-6" />
        Profile
      </a>

      <button
        class="bg-sky-500 hover:bg-sky-600 w-full mt-8 text-white font-bold py-3 px-4 rounded-full"
      >
        Post
      </button>
    </nav>

    <div
      class="flex-shrink-0 flex hover:bg-blue-00 rounded-full p-4 mt-12 mr-2"
    >
      <a class="flex-shrink-0 group block" target="_blank">
        <div class="flex items-center">
          <div>
            <img
              class="inline-block h-10 w-10 rounded-full"
              :src="user.user.avatar"
              alt=""
            />
          </div>
          <div class="ml-3">
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
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "SideBar",
  mounted() {
    if (!this.isLogged) {
      this.$router.push("/");
    }
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters("user", ["isLogged"]),
  },
};
</script>
