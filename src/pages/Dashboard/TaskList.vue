<template>
  <base-table :data="objectives" thead-classes="text-primary">
    <template slot-scope="{ row }">
      <tr>
      <td>
        <base-checkbox
          :value="row.id"
          :checked="getCheckedArray(row)"
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
export default {
  props: {
    objectives: {
      type: Array,
      required: true,
    },
  },
  components: {
    BaseTable,
  },
  data() {
    return {};
  },
  methods: {
    editObjective(id) {
      this.$router.push(`/objectives/edit/${id}`);
    },
    getCheckedArray(row) {
      return row?.status === 1 ? [row.id] : [];
    }
  },
};
</script>
<style></style>
