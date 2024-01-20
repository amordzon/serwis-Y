export default {
  namespaced: true,
  state: {
    allTweets: [],
  },
  getters: {
    allTweets: (state) => state.allTweets,
  },
  mutations: {
    SET_ALL_TWEETS(state, tweets) {
      state.allTweets = tweets;
    },
    ADD_TWEET(state, tweet) {
      state.allTweets.unshift(tweet);
    },
    SET_MORE_TWEETS(state, tweets) {
      state.allTweets = [...state.allTweets, ...tweets];
    },
    CLEAR_TWEETS(state) {
      state.allTweets = [];
    },
    INCREMENT_QUOTED_COUNT(state, tweetID) {
      const tweet = Object.values(state.allTweets).find(
        (t) => t._id === tweetID
      );
      if (tweet) {
        tweet.quotedPostsCount++;
      }
    },
  },
  actions: {
    fetchTweets({ commit }, posts) {
      if (posts.length > 0) {
        commit("SET_MORE_TWEETS", posts);
      }
    },
    clearTweets({ commit }) {
      commit("CLEAR_TWEETS");
    },
    addTweet({ commit }, tweet) {
      commit("ADD_TWEET", tweet);
    },
    incrementQuotedCount({ commit }, tweetID) {
      commit("INCREMENT_QUOTED_COUNT", tweetID);
    },
  },
};
