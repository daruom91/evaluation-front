<template>
  <div class="reports-page">
    <card>
      <h4 slot="header">Reports</h4>
      <base-button @click="toggleCreateReportReport" type="primary" fill>
        Create New Report
      </base-button>
      <base-input
        v-model="search"
        @input="filterReports"
        placeholder="Search"
      />
      <base-table :data="reports" :columns="columns">
        <template slot-scope="{ row }">
          <tr>
            <td>{{ row.index }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.description }}</td>
            <td class="td-actions text-right">
              <base-button type="link" @click="onEditReport(row)">
                <i class="tim-icons icon-pencil"></i>
              </base-button>
              <base-button type="link" @click="onDeleteReport(row)">
                <i class="tim-icons icon-simple-remove"></i>
              </base-button>
            </td>
          </tr>
        </template>
      </base-table>
    </card>
  </div>
</template>

<script>
import { BaseTable, BaseButton, Modal } from "@/components";
import axios from "axios";

export default {
  components: {
    BaseTable,
    BaseButton,
  },
  data() {
    return {
      search: "",
      reports: [],
      columns: ["Id", "Name", "Description"],
    };
  },
  created() {
    this.fetchReports();
  },
  methods: {
    toggleCreateReportReport() {
      this.$router.push("/reports/create");
    },
    onEditReport(report) {
      this.$router.push(`/reports/edit/${report.id}`);
    },
    async onDeleteReport(report) {
      axios
        .delete(`http://localhost:5143/api/ReportData/${report.id}`)
        .then((res) => {
          this.fetchReports();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async filterReports() {
      try {
        const res = await axios.get(`http://localhost:5143/api/ReportData`);
        this.reports = res.data
          .filter((el) =>
            el.name.toLowerCase().includes(this.search.toLowerCase())
          )
          .map((el, key) => ({
            id: el.id,
            index: key + 1,
            name: el.name,
            description: el.description,
          }));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    },
    async fetchReports() {
      try {
        const res = await axios.get("http://localhost:5143/api/ReportData");
        this.reports = res.data.map((el, key) => ({
          id: el.id,
          index: key + 1,
          name: el.name,
          description: el.description,
        }));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    },
  },
};
</script>

<style scoped>
.reports-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
