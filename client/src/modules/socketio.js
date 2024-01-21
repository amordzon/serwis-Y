import { io } from "socket.io-client";
export default {
  namespaced: true,
  state: {
    socket: null,
  },
  getters: {
    getSocket: (state) => state.socket,
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    DISCONNECT_SOCKET(state) {
      state.socket.disconnect();
    },
    JOIN_ROOM(state, postID) {
      state.socket.emit("join", postID);
    },
    LEAVE_ROOM(state, postID) {
      state.socket.emit("leave", postID);
    },
    NEW_POST(state, postID) {
      state.socket.emit("newpost", postID);
    },
  },

  actions: {
    setupSocketConnection({ commit, rootState }) {
      console.log("polacz");
      const socket = io("http://localhost:3000/", {
        auth: {
          token: JSON.stringify(rootState.user.jwt),
        },
      });
      commit("SET_SOCKET", socket);
    },
    joinRoom({ state, commit, dispatch }, postID) {
      if (!state.socket) {
        dispatch("setupSocketConnection");
      }
      commit("JOIN_ROOM", postID);
    },
    leaveRoom({ state, commit, dispatch }, postID) {
      if (!state.socket) {
        dispatch("setupSocketConnection");
      }
      commit("LEAVE_ROOM", postID);
    },
    newPost({ state, commit }, postID) {
      if (state.socket) {
        commit("NEW_POST", postID);
      }
    },
    disconnect({ state, commit }) {
      if (state.socket) {
        commit("DISCONNECT_SOCKET");
      }
    },
    subscribeToNewPost({ state }, cb) {
      if (state.socket) {
        state.socket.on("newpost", () => {
          cb();
        });
      }
    },
  },
};
