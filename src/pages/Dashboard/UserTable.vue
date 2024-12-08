<template>
  <base-table
    :data="tableData"
    :columns="table.columns"
    thead-classes="text-primary"
  >
  </base-table>
</template>
<script>
import { BaseTable } from "@/components";
import { fetchData } from "../../fetch";
import moment from "moment";
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
      this.tableData = response.data.map((c) => {
        return {
          ...c,
          startDate: moment(c.startDate).format("LL"),
          endDate: moment(c.endDate).format("LL"),
        };
      }).sort((a, b) => moment(b.startDate) - moment(a.startDate)).slice(0, 10);
    },
  },
  computed: {
    table() {
      return this.$t("dashboard.campaignsTable");
    },
  },
};
</script>
<style></style>
