<template>
  <div class="sticky top-0 bg-black z-20">
    <div class="flex justify-start mt-2">
      <div class="px-5 py-2">
        <router-link
          to="/"
          class="text-2xl font-medium rounded-full text-gray-200 hover:bg-gray-800 float-right"
        >
          <font-awesome-icon
            icon="fa-solid fa-arrow-left"
            class="m-2 h-5 w-5"
          />
        </router-link>
      </div>
      <div class="mx-2">
        <h2 class="mb-0 text-xl font-bold text-white">{{ user.name }}</h2>
        <p class="mb-0 w-48 text-xs text-gray-400">5 posts</p>
      </div>
    </div>

    <hr class="border-gray-700" />
  </div>
</template>

<script>
export default {
  name: "ProfileNavbar",
  props: ["user"],
};
</script>
