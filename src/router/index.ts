import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "About",
    component: () => import("../views/about.vue"),
  },
  {
    path: "/publications",
    name: "Selected Publications",
    component: () => import("../views/pubs.vue"),
  },
  {
    path: "/resume",
    name: "Resume",
    component: () => import("../views/resume.vue"),
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/contact.vue"),
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: () => import("../views/recipes/index.vue"),
  },
  // Add more routes here
];

const router = createRouter({
  // history: createWebHistory('/portfolio/'), //For directly serving from github pages
  history: createWebHistory(),
  routes,
});

export default router;
