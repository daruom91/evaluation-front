<template>
  <table class="table">
    <thead :class="theadClasses">
      <tr>
        <slot name="columns">
          <th v-for="column in columns" :key="column">{{column}}</th>
        </slot>
      </tr>
    </thead>
    <tbody>
      <template v-if="data && data.length">
        <slot v-for="(item, index) in data" :row="item" :index="index">
          <tr :key="index">
            <td v-for="(column, index) in columns" :key="index">
              {{item[column.toLowerCase()]}}
            </td>
          </tr>
        </slot>
      </template>
      <template v-else>
        <slot name="empty-state">
          <tr>
            <td :colspan="columns.length" class="text-center py-4 text-muted">
              <i class="tim-icons icon-alert-circle-exc mb-2 d-block" style="font-size: 24px;"></i>
              No data available
            </td>
          </tr>
        </slot>
      </template>
    </tbody>
  </table>
</template>
<script>
export default {
  name: "base-table",
  props: {
    columns: {
      type: Array,
      default: () => [],
      description: "Table columns",
    },
    data: {
      type: Array,
      default: () => [],
      description: "Table data",
    },
    type: {
      type: String, // striped | hover
      default: "",
      description: "Whether table is striped or hover type",
    },
    theadClasses: {
      type: String,
      default: "",
      description: "<thead> css classes",
    },
    tbodyClasses: {
      type: String,
      default: "",
      description: "<tbody> css classes",
    },
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
  },
};
</script>
<style></style>
