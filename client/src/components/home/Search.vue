<template>
  <div class="text-gray-300 w-full py-2 px-4 pb-0">
    <button type="submit" class="absolute ml-4 mt-2 mr-4">
      <font-awesome-icon
        icon="fa-solid fa-magnifying-glass"
        class="h-4 w-4 fill-current"
      />
    </button>

    <input
      type="search"
      name="search"
      placeholder="Search"
      class="bg-gray-800 h-10 px-10 pr-5 w-full rounded-3xl text-sm focus:outline-none shadow rounded border-0"
    />
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
};
</script>
