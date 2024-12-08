<template>
  <base-table
    :data="table.data"
    :columns="table.columns"
    thead-classes="text-primary"
  >
  </base-table>
</template>
<script>
import { BaseTable } from "@/components";
import { fetchData } from "../../fetch";
export default {
  components: {
    BaseTable,
  },
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const response = await fetchData("Campaigns/getall", "get");
      this.tableData = response.data;
    },
  },
  computed: {
    table() {
      return this.$t("dashboard.usersTable");
    },
    },
};
</script>
<style></style>
