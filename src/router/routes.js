import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";
import AuthLayout from "@/layout/auth/AuthLayout.vue";
import Login from "@/pages/Login.vue";

// Admin pages
const FormBuilder = () =>
  import(/* webpackChunkName: "form-builder" */ "@/pages/FormBuilder.vue");
const Forms = () => import(/* webpackChunkName: "forms" */ "@/pages/Forms.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/pages/Dashboard.vue");
const Profile = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Profile.vue");
const Users = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Users.vue");
const UserForm = () =>
  import(/* webpackChunkName: "common" */ "@/pages/UserForm.vue");
const Groups = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Groups.vue");
const GroupForm = () =>
  import(/* webpackChunkName: "common" */ "@/pages/GroupForm.vue");
const Campaigns = () =>
  import(/* webpackChunkName: "campaigns" */ "@/pages/Campaigns.vue");

import Objectives from "@/pages/Objectives.vue";
import ObjectiveForm from "@/pages/ObjectiveForm.vue";
const EditCampaign = () => import("@/pages/EditCampaign.vue");
const Calendar = () =>
  import(/* webpackChunkName: "calendar" */ "@/pages/Calendar.vue");
const Reports = () =>
  import(/* webpackChunkName: "reports" */ "@/pages/Reports.vue");
const AddNewReport = () =>
  import(/* webpackChunkName: "add-new-report" */ "@/pages/addNewReport.vue");
// const Events = () =>
//   import(/* webpackChunkName: "events" */ "@/pages/Calendar.vue");

const FormsList = () =>
  import(/* webpackChunkName: "forms-list" */ "@/pages/FormsList.vue");
const ViewForm = () =>
  import(/* webpackChunkName: "view-form" */ "@/pages/ViewForm.vue");

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
        path: "forms",
        name: "Forms",
        component: Forms,
      },
      {
        path: "forms/create",
        name: "Form Builder",
        component: FormBuilder,
      },
      {
        path: "reports",
        name: "Reports",
        component: Reports,
      },
      {
        path: "reports/create",
        name: "Add New Report",
        component: AddNewReport,
      },
      {
        path: "reports/edit/:id",
        name: "Edit Report",
        component: AddNewReport,
      },
      {
        path: "/campaigns",
        name: "Campaigns",
        component: Campaigns,
      },
      {
        path: "users",
        name: "users",
        component: Users,
      },
      {
        path: "users/create",
        name: "user-create",
        component: UserForm,
      },
      {
        path: "users/edit/:id",
        name: "user-edit",
        component: UserForm,
      },
      {
        path: "groups",
        name: "groups",
        component: Groups,
      },
      {
        path: "groups/create",
        name: "group-create",
        component: GroupForm,
      },
      {
        path: "groups/edit/:id",
        name: "group-edit",
        component: GroupForm,
      },
      {
        path: "/objectives",
        name: "objectives",
        component: Objectives,
      },
      {
        path: "/objectives/create",
        name: "create-objective",
        component: ObjectiveForm,
      },
      {
        path: "/objectives/edit/:id",
        name: "edit-objective",
        component: ObjectiveForm,
      },
      {
        path: "campaigns/edit/:id",
        name: "campaign-edit",
        component: EditCampaign,
      },
      {
        path: "events",
        name: "events",
        component: Calendar,
      },
      // {
      //   path: "one-to-one",
      //   name: "one-to-one",
      //   component: OneToOne,
      // },
      {
        path: "forms-list",
        name: "forms-list",
        component: ViewForm,
      },
      {
        path: "forms-list/:id",
        name: "FormsList",
        component: FormsList,
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
