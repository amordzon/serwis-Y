import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../components/authentication/Authentication.vue";

const routes = [{ path: "/", component: Authentication }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
