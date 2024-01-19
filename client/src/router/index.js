import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../components/authentication/Authentication.vue";
import Home from "../components/home/Home.vue";
import Profile from "../components/profile/Profile.vue";
import UserDetails from "../components/profile/UserDetails.vue";
import BlockedUsers from "../components/profile/BlockedUsers.vue";
import PostDetails from "../components/post/PostDetails.vue";

const routes = [
  { path: "/", component: Authentication },
  { path: "/home", component: Home },
  { path: "/post/:id", component: PostDetails },
  {
    path: "/profile",
    component: Profile,
    name: "profile",
    children: [
      { path: ":username", component: UserDetails },
      { path: "blocked", component: BlockedUsers },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
