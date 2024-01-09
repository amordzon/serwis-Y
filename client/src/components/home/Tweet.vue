<template>
  <div v-if="tweet">
    <div class="flex flex-shrink-0 p-4 pb-0">
      <a class="flex-shrink-0 group block" target="_blank">
        <div class="flex items-center">
          <div>
            <img
              class="inline-block h-10 w-10 rounded-full"
              :src="tweet.user.avatar"
              alt=""
            />
          </div>
          <div class="ml-3 flex flex-col">
            <p class="text-base font-medium text-white">
              {{ tweet.user.name }}
              <span class="text-sm font-medium text-gray-400">
                @{{ tweet.user.username }} ·
                {{ createdDateWithArg(tweet.createdAt) }}
              </span>
            </p>

            <div
              v-if="tweet.refPost.user"
              class="text-sm font-medium text-gray-400 mb-4"
            >
              Replying to @{{ tweet.refPost.user.username }}
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="pl-16 pr-4">
      <div class="text-base width-auto font-light text-white">
        {{ tweet.body }}

        <QuotedTweet
          v-if="tweet.isQuote"
          :quotedPost="tweet.quotedPost"
          :createdDateWithArg="createdDateWithArg"
        ></QuotedTweet>
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
                {{ tweet.refPostCount }}
              </a>
            </div>

            <div class="flex-1 text-center py-2 m-2">
              <a
                class="group flex items-center text-gray-500 px-3 py-2 text-base font-light rounded-full"
                target="_blank"
              >
                <font-awesome-icon
                  icon="fa-solid fa-retweet"
                  class="text-center h-5 w-5 mr-2"
                />
                {{ tweet.quotedPostsCount }}
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
    </div>
    <hr class="border-gray-700" />
  </div>
</template>

<script>
import moment from "moment";
import QuotedTweet from "./QuotedTweet";

export default {
  name: "TweetComponent",
  components: {
    QuotedTweet,
  },
  props: ["tweet"],
  computed: {
    createdDateWithArg() {
      return (arg) => {
        return moment(arg).fromNow();
      };
    },
  },
};
</script>
