<template>
  <base-table :data="tableData" thead-classes="text-primary">
    <template slot-scope="{ row }">
      <tr>
      <td>
        <base-checkbox
          v-model="row.status"
          :checked="row.status === 1"
          :disabled="true"
        > </base-checkbox>
      </td>
      <td>
        <p class="title">{{ row.title }}</p>
        <p class="text-muted">{{ row.description }}</p>
      </td>
        <td class="td-actions text-right">
          <base-button
            type="link"
            aria-label="edit button"
            @click="editObjective(row.id)"
            >
            <i class="tim-icons icon-pencil"></i>
          </base-button>
      </td>
    </tr>
    </template>
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
      const response = await fetchData("objectives", "get");
      this.tableData = response.data;
    },
    editObjective(id) {
      this.$router.push(`/objectives/edit/${id}`);
    },
  },
};
</script>
<style></style>
