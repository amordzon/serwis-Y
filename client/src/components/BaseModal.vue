<template>
  <Teleport to="#modals">
    <div v-if="show" class="">
      <div class="fixed inset-0 bg-gray-500 opacity-40"></div>

      <div class="fixed inset-0 flex items-center justify-center">
        <div
          class="bg-black text-gray-100 w-10/12 md:w-2/3 lg:w-1/2 rounded-xl"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    show: Boolean,
  },
};
</script>
