export default {
  namespaced: true,
  state: {
    showPostModal: false,
    quotedPost: {},
  },
  getters: {
    showPostModal: (state) => state.showPostModal,
    quotedPost: (state) => state.quotedPost,
  },
  mutations: {
    SET_SHOW_POST_MODAL(state, mode) {
      state.showPostModal = mode;
    },
    SET_QUOTED_POST(state, quotedPost) {
      state.quotedPost = quotedPost;
    },
  },
  actions: {
    showModal({ commit }) {
      commit("SET_SHOW_POST_MODAL", true);
    },
    hideModal({ commit }) {
      commit("SET_SHOW_POST_MODAL", false);
    },
    setQuotedPost({ commit }, quotedPost) {
      commit("SET_QUOTED_POST", quotedPost);
    },
  },
};
