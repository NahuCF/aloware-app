import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import publicRoutes from "./routes/public";
import privateRoutes from "./routes/private";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [...publicRoutes, ...privateRoutes],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"];

  if (to.path === "/") {
    if (!isAuthenticated) {
      next({ name: "login" });
      return;
    }
  }

  if (to.meta.public === true && isAuthenticated) {
    next({ name: "lines" });
    return;
  }

  if (to.meta.public === false && !isAuthenticated) {
    next({ name: "login" });
    return;
  }

  next();
});

export default router;
