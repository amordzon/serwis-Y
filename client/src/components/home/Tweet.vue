<template>
  <div v-if="tweet" class="relative">
    <div
      v-if="mode == `ancestor`"
      class="h-full bg-gray-600 w-[1px] absolute left-8 top-4"
    ></div>
    <router-link :to="'/post/' + tweet._id">
      <div class="flex flex-shrink-0 p-4 pb-0">
        <div class="flex-shrink-0 group block">
          <div class="flex items-center">
            <div class="relative">
              <img
                class="inline-block h-10 w-10 rounded-full"
                :src="
                  tweet.user.avatar?.imageUrl
                    ? tweet.user.avatar.imageUrl
                    : 'https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg'
                "
                alt=""
              />
            </div>
            <div class="ml-3 flex flex-col">
              <p class="text-base font-medium text-white">
                <router-link :to="'/profile/' + tweet.user.username">{{
                  tweet.user.name
                }}</router-link>
                <span class="text-sm font-medium text-gray-400">
                  @{{ tweet.user.username }} ·
                  {{ createdDateWithArg(tweet.createdAt) }}
                </span>
              </p>

              <div
                v-if="tweet.refPost && tweet.refPost.user && mode == null"
                class="text-sm font-medium text-gray-400 mb-4"
              >
                Replying to @{{ tweet.refPost.user.username }}
              </div>
              <div
                v-else-if="
                  tweet.refPost && tweet.refPost == 'blocked' && mode == null
                "
                class="text-sm font-medium text-gray-400 mb-4"
              >
                Replying to @[BlockedUser]
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-16 pr-4">
        <div class="text-base width-auto font-light text-white">
          {{ tweet.body }}

          <div v-show="tweet.image" class="w-4/5 mt-4">
            <img
              :src="tweet.image?.imageUrl"
              class="inline-block rounded-lg mb-4"
            />
          </div>
          <div v-if="tweet.isQuote">
            <router-link :to="'/post/' + tweet.quotedPost._id">
              <QuotedTweet
                :quotedPost="tweet.quotedPost"
                :createdDateWithArg="createdDateWithArg"
              ></QuotedTweet>
            </router-link>
          </div>
        </div>

        <div class="flex">
          <div class="w-full">
            <div class="flex items-center">
              <div class="flex-1 text-center">
                <a
                  class="group flex items-center text-gray-500 px-3 py-2 text-base font-light rounded-full"
                  target="_blank"
                >
                  <font-awesome-icon
                    icon="fa-regular fa-comment"
                    class="text-center h-5 w-5 mr-2"
                  />
                  {{ tweet.refPostCount ? tweet.refPostCount : 0 }}
                </a>
              </div>

              <div class="flex-1 text-center py-2 m-2">
                <a
                  class="group flex items-center text-gray-500 px-3 py-2 text-base font-light rounded-full cursor-pointer"
                  target="_blank"
                  @click="quotePost"
                >
                  <font-awesome-icon
                    icon="fa-solid fa-retweet"
                    class="text-center h-5 w-5 mr-2"
                  />
                  {{ tweet.quotedPostsCount ? tweet.quotedPostsCount : 0 }}
                </a>
              </div>

              <div class="flex-1 text-center py-2 m-2">
                <a
                  class="group flex items-center text-gray-500 px-3 py-2 text-base font-light rounded-full"
                  target="_blank"
                >
                  <font-awesome-icon
                    icon="fa-solid fa-chart-simple"
                    class="text-center h-5 w-5 mr-2"
                  />
                  {{ tweet.viewsCount }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div></router-link
    >
    <hr v-if="mode != `ancestor`" class="border-gray-700" />
  </div>
</template>

<script>
import moment from "moment";
import QuotedTweet from "./QuotedTweet";
import { mapActions } from "vuex";

export default {
  name: "TweetComponent",
  components: {
    QuotedTweet,
  },
  data() {
    return {
      showPostModal: false,
      quotedPost: {},
    };
  },
  props: ["tweet", "mode"],
  computed: {
    createdDateWithArg() {
      return (arg) => {
        return moment(arg).fromNow();
      };
    },
  },
  methods: {
    ...mapActions("postModal", ["showModal", "setQuotedPost"]),
    closePostModal() {
      this.showPostModal = false;
    },
    quotePost(e) {
      e.stopPropagation();
      e.preventDefault();
      this.showModal();
      this.setQuotedPost({ ...this.tweet });
    },
  },
};
</script>
