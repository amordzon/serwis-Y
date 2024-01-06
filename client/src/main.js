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
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faImage,
  faComment,
} from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faHouse,
  faMagnifyingGlass,
  faUser,
  faImage,
  faComment,
  faRetweet,
  faChartSimple
);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount("#app");
