export default {
  namespaced: true,
  state: {
    user: null,
    jwt: "",
    isLogged: false,
  },
  getters: {
    user: (state) => state.user,
    jwt: (state) => state.jwt,
    isLogged: (state) => state.isLogged,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_JWT(state, jwt) {
      state.jwt = jwt;
    },
    SET_IS_LOGGED(state, isLogged) {
      state.isLogged = isLogged;
    },
    SET_FOLLOW_USER(state, userToFollow) {
      state.user.following.unshift(userToFollow);
    },
    SET_UNFOLLOW_USER(state, userToUnfollow) {
      state.user.following = state.user.following.filter(
        (user) => user !== userToUnfollow
      );
    },
    SET_BLOCK_USER(state, userToBlock) {
      state.user.blocked.unshift(userToBlock);
    },
    SET_UNBLOCK_USER(state, userToUnblock) {
      state.user.blocked = state.user.blocked.filter(
        (user) => user !== userToUnblock
      );
    },
    SET_AVATAR(state, avatar) {
      state.user.avatar.imageUrl = avatar;
    },
    SET_DESCRIPTION(state, description) {
      state.user.description = description;
    },
  },
  actions: {
    logIn({ commit, dispatch }, { user, jwt }) {
      commit("SET_USER", user);
      commit("SET_JWT", jwt);
      commit("SET_IS_LOGGED", true);
      dispatch("socketio/setupSocketConnection", jwt, { root: true });
    },
    logOut({ commit }) {
      commit("SET_USER", null);
      commit("SET_JWT", "");
      commit("SET_IS_LOGGED", false);
    },
    followUser({ commit }, userToFollow) {
      commit("SET_FOLLOW_USER", userToFollow);
    },
    unfollowUser({ commit }, userToUnfollow) {
      commit("SET_UNFOLLOW_USER", userToUnfollow);
    },
    blockUser({ commit }, userToBlock) {
      commit("SET_BLOCK_USER", userToBlock);
    },
    unblockUser({ commit }, userToUnblock) {
      commit("SET_UNBLOCK_USER", userToUnblock);
    },
    editProfile({ commit }, { avatar, description }) {
      if (avatar) {
        commit("SET_AVATAR", avatar);
      }
      commit("SET_DESCRIPTION", description);
    },
  },
};
