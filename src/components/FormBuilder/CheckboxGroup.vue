<template>
  <div class="form-group">
    <label v-if="groupLabel">{{ groupLabel }}</label>
    <div class="checkbox-group">
      <base-checkbox
        v-for="option in options"
        :key="option.value"
        v-model="selectedOptions"
        :name="groupName"
        :value="option.value"
      >
        {{ option.label }}
      </base-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: "checkbox-group",
  props: {
    groupLabel: {
      type: String,
      default: "Checkbox Group",
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedOptions: this.value,
    };
  },
  watch: {
    selectedOptions(val) {
      this.$emit("input", val);
    },
  },
};
</script>
