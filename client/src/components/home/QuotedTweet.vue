<template>
  <div class="border-gray-700 border-2 mt-4 rounded-2xl">
    <div class="p-3" v-if="quotedPost != 'blocked'">
      <div class="flex flex-shrink-0">
        <router-link
          :to="'/post/' + quotedPost._id"
          class="flex-shrink-0 group block"
          target="_blank"
        >
          <div class="flex items-center">
            <div>
              <img
                class="inline-block h-8 w-8 rounded-full"
                :src="
                  quotedPost.user.avatar?.imageUrl
                    ? quotedPost.user.avatar.imageUrl
                    : 'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg'
                "
                alt=""
              />
            </div>
            <div class="ml-3 flex flex-col">
              <p class="text-base font-medium text-white">
                {{ quotedPost.user.name }}
                <span class="text-sm font-medium text-gray-400">
                  @{{ quotedPost.user.username }} ·
                  {{ createdDateWithArg(quotedPost.createdAt) }}
                </span>
              </p>

              <div
                v-if="quotedPost.refPost && quotedPost.refPost.user"
                class="text-sm font-medium text-gray-400 mb-4"
              >
                Replying to @{{ quotedPost.refPost.user.username }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <div class="pr-4 mt-2 ml-2">
        <div class="text-base width-auto font-light text-white">
          {{ quotedPost.body }}
          <div v-show="quotedPost.image" class="w-4/5 mt-4">
            <img
              :src="quotedPost.image?.imageUrl"
              class="inline-block rounded-lg mb-4"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="p-3" v-else>
      <div class="flex flex-shrink-0">
        <a class="flex-shrink-0 group block" target="_blank">
          <div class="flex items-center">
            <div>
              <img
                class="inline-block h-8 w-8 rounded-full"
                src="https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg"
                alt=""
              />
            </div>
            <div class="ml-3 flex flex-col">
              <p class="text-base font-medium text-white">
                [Blocked user]
                <span class="text-sm font-medium text-gray-400">
                  @[BlockedUser]
                </span>
              </p>
            </div>
          </div>
        </a>
      </div>
      <div class="pr-4 mt-2 ml-2">
        <p class="text-base width-auto font-light text-white">
          [Blocked user content]
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuotedTweet",
  props: {
    quotedPost: {
      type: Object,
      required: true,
    },
    createdDateWithArg: {
      type: Function,
      required: true,
    },
  },
};
</script>
