<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link v-if="item.display" v-for="item in sidebarItems" :key="item.name" :to="item.to"
          :name="$t(`sidebar.${item.name}`)" :icon="item.icon" :display="item.display" />

      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import { getUser } from "../../fetch";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
  },
  data() {
    return {
      sidebar: false,
      user: getUser(),
      sidebarItems: [],
    };
  },
  mounted() {
    this.sidebarItems = [
      {
        name: "dashboard",
        icon: "tim-icons icon-chart-pie-36",
        to: "/dashboard",
        display: ['admin', 'HR', 'Manager'].includes(this.user?.role),
      },
      {
        name: "campaigns",
        icon: "tim-icons icon-paper",
        to: "/campaigns",
        display: ['admin', 'HR', 'Manager'].includes(this.user?.role),
      },
      {
        name: "forms",
        icon: "tim-icons icon-pencil",
        to: "/forms",
        display: ['admin', 'HR', 'Manager'].includes(this.user?.role),
      },
      {
        name: "reports",
        icon: "tim-icons icon-paper",
        to: "/reports",
        display: ['admin', 'HR', 'Manager'].includes(this.user?.role),
      },
      {
        name: "events",
        icon: "tim-icons icon-calendar-60",
        to: "/events",
        display: ['admin', 'HR', 'Manager', 'Employee'].includes(this.user?.role),
      },
      {
        name: "users",
        icon: "tim-icons icon-single-02",
        to: "/users",
        display: true
        // display: ['admin', 'HR', 'Manager', 'Employee'].includes(this.user.role),
      },
      {
        name: "groups",
        icon: "tim-icons icon-settings-gear-63",
        to: "/groups",
        display: ['admin', 'HR', 'Manager'].includes(this.user?.role),
      },
      {
        name: "objectives",
        icon: "tim-icons icon-bullet-list-67",
        to: "/objectives",
        display: ['admin', 'HR', 'Manager', 'Employee'].includes(this.user?.role),
      },
    ];
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
