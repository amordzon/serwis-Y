import axios from "axios";

export default {
  namespaced: true,
  state: {
    allTweets: [],
    tweetsType: "following",
  },
  getters: {
    allTweets: (state) => state.allTweets,
    tweetsType: (state) => state.tweetsType,
  },
  mutations: {
    SET_ALL_TWEETS(state, tweets) {
      state.allTweets = tweets;
    },
    SET_TWEETS_TYPE(state, type) {
      state.tweetsType = type;
    },
    ADD_TWEET(state, tweet) {
      state.allTweets.unshift(tweet);
    },
  },
  actions: {
    async fetchTweets({ commit, state, rootGetters }) {
      try {
        const jwt = rootGetters["user/jwt"];
        const response = await axios.get(
          `http://localhost:3000/posts?tweetsType=${state.tweetsType}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        commit("SET_ALL_TWEETS", response.data.posts);
      } catch (error) {
        console.log(error);
      }
    },
    changeTweetsType({ commit }, type) {
      commit("SET_TWEETS_TYPE", type);
    },
    addTweet({ commit }, tweet) {
      commit("ADD_TWEET", tweet);
    },
  },
};
