import Vue from "vue";
import Router from "vue-router";
import DashboardLayout from "../layout/starter/SampleLayout.vue";
import Starter from "../layout/starter/SamplePage.vue";
import Login from "../pages/Login.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/auth",
      name: "auth",
      redirect: "/login",
      component: Login,
      children: [
        {
          path: "login",
          name: "login",
          components: { default: Login },
        },
      ],
    },
  ],
});
