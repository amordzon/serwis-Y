import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faMagnifyingGlass,
  faRetweet,
  faChartSimple,
  faArrowLeft,
  faCalendarDays,
  faRightFromBracket,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faImage,
  faComment,
} from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";

library.add(
  faHouse,
  faMagnifyingGlass,
  faUser,
  faImage,
  faComment,
  faRetweet,
  faChartSimple,
  faArrowLeft,
  faCalendarDays,
  faRightFromBracket,
  faUserLock
);

axios.defaults.baseURL = process.env.VUE_APP_BACKEND_ENDPOINT + "/api";

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount("#app");
