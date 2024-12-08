<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link
          to="/dashboard"
          :name="$t('sidebar.dashboard')"
          icon="tim-icons icon-chart-pie-36"
        />
        <sidebar-link
          to="/campaigns"
          :name="$t('sidebar.campaigns')"
          icon="tim-icons icon-paper"
        />
        <sidebar-link
          to="/form-builder"
          :name="$t('sidebar.formBuilder')"
          icon="tim-icons icon-pencil"
        />
        <sidebar-link
          to="/users"
          :name="$t('sidebar.users')"
          icon="tim-icons icon-single-02"
        />
        <sidebar-link
          to="/groups"
          :name="$t('sidebar.groups')"
          icon="tim-icons icon-settings-gear-63"
        />
        <sidebar-link
          to="/objectives"
          :name="$t('sidebar.objectives')"
          icon="tim-icons icon-bullet-list-67"
        />
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
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
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
