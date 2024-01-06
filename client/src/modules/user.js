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
  },
  actions: {
    logIn({ commit }, { user, jwt }) {
      commit("SET_USER", user);
      commit("SET_JWT", jwt);
      commit("SET_IS_LOGGED", true);
    },
    logOut({ commit }) {
      commit("SET_USER", null);
      commit("SET_JWT", "");
      commit("SET_IS_LOGGED", false);
    },
  },
};
