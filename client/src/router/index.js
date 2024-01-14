import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../components/authentication/Authentication.vue";
import Home from "../components/home/Home.vue";
import Profile from "../components/profile/Profile.vue";
import PostDetails from "../components/post/PostDetails.vue";

const routes = [
  { path: "/", component: Authentication },
  { path: "/home", component: Home },
  { path: "/profile/:username", component: Profile },
  { path: "/post/:id", component: PostDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
