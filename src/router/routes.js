import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";
import AuthLayout from "@/layout/auth/AuthLayout.vue";
import Login from "@/pages/Login.vue";

// Admin pages
const FormBuilder = () =>
  import(/* webpackChunkName: "form-builder" */ "@/pages/FormBuilder.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/pages/Dashboard.vue");
const Profile = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Profile.vue");
const Campaigns = () =>
  import(/* webpackChunkName: "campaigns" */ "@/pages/Campaigns.vue");

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/profile",
        name: "profile",
        component: Profile,
      },

      {
        path: "form-builder",
        name: "Form Builder",
        component: FormBuilder,
      },
      {
        path: "/campaigns",
        name: "Campaigns",
        component: Campaigns,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
      },
    ],
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
