import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../components/authentication/Authentication.vue";
import Home from "../components/home/Home.vue";

const routes = [
  { path: "/", component: Authentication },
  { path: "/home", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
