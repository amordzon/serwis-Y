import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import user from "../modules/user.js";
import tweet from "../modules/tweet.js";
import postModal from "../modules/postModal.js";
import socketio from "../modules/socketio.js";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({ user: state.user }),
  filter: (mutation) => mutation.type.startsWith("user/"),
});

export default createStore({
  modules: {
    user,
    tweet,
    postModal,
    socketio,
  },
  plugins: [vuexLocal.plugin],
});
