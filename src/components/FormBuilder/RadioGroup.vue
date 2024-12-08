<template>
  <div class="form-group">
    <label v-if="groupLabel">{{ groupLabel }}</label>
    <div class="radio-group">
      <base-radio
        v-for="option in options"
        :key="option.value"
        v-model="selectedOption"
        :name="groupName"
        :value="option.value"
        class="custom-radio"
      >
        {{ option.label }}
      </base-radio>
    </div>
  </div>
</template>

<script>
export default {
  name: "radio-group",
  props: {
    groupLabel: {
      type: String,
      default: "Radio Group",
    },
    groupName: {
      type: String,
      default: "radio_group",
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectedOption: this.value,
    };
  },
  watch: {
    selectedOption(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
}
.custom-radio {
  margin-bottom: 10px;
}
</style>
