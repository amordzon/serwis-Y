import { createStore } from "vuex";
import user from "../modules/user.js";
import tweet from "../modules/tweet.js";
import postModal from "../modules/postModal.js";

export default createStore({
  modules: {
    user,
    tweet,
    postModal,
  },
});
