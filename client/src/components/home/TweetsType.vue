<template>
  <div class="sticky top-0 bg-black z-20">
    <div class="flex justify-around text-center">
      <h2
        class="px-4 py-3 text-base font-semibold text-gray-500 hover:bg-gray-800 w-full cursor-pointer"
        :class="{
          'border-b-4 border-sky-500 text-white': tweetsType === 'all',
        }"
        @click="changeTweetsType('all')"
      >
        For you
      </h2>
      <h2
        class="px-4 py-3 text-base font-semibold text-gray-500 hover:bg-gray-800 w-full cursor-pointer"
        :class="{
          'border-b-4 border-sky-500 text-white': tweetsType === 'following',
        }"
        @click="changeTweetsType('following')"
      >
        Following
      </h2>
    </div>

    <hr class="border-gray-600" />
  </div>
</template>

<script>
export default {
  name: "TweetsType",
  props: ["tweetsType"],
  methods: {
    changeTweetsType(type) {
      this.$emit("change-tweets-type", type);
    },
  },
};
</script>
