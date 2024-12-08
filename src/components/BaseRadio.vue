<template>
  <div
    class="form-check form-check-radio"
    :class="[inlineClass, { disabled: disabled }]"
  >
    <label :for="cbId" class="form-check-label">
      <input
        :id="cbId"
        class="form-check-input"
        type="radio"
        :name="name"
        :disabled="disabled"
        :value="value"
        v-model="model"
      />
      <slot></slot>
      <span class="form-check-sign"></span>
    </label>
  </div>
</template>
<script>
export default {
  name: "base-radio",
  props: {
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      description: "Whether radio is disabled",
    },
    value: {
      type: [String, Boolean],
      description: "Radio value",
    },
    inline: {
      type: Boolean,
      description: "Whether radio is inline",
    },
  },
  data() {
    return {
      cbId: "",
    };
  },
  computed: {
    model: {
      get() {
        return this.$parent.selectedOption;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    inlineClass() {
      return this.inline ? "form-check-inline" : "";
    },
  },
  created() {
    this.cbId = Math.random().toString(16).slice(2);
  },
};
</script>
