<template>
  <div class="forms-list-page">
    <card>
      <h4 slot="header">{{ forms.name }}</h4>

      <div v-for="field in forms.fields" :key="field.id">
        <div class="form-group">
          <label>{{ field.label }}</label>
          <base-input
            v-if="field.fieldType == 'text'"
            :type="field.fieldType"
            v-model="formData[field.label]"
          />
          <base-input
            v-if="field.fieldType == 'number'"
            :type="field.fieldType"
            v-model="formData[field.label]"
          />
          <base-input
            v-if="field.fieldType == 'textarea'"
            :type="field.fieldType"
            rows="3"
            v-model="formData[field.label]"
          />
          <div
            class="checkbox-group"
            v-if="field.fieldType == 'checkbox_group'"
          >
            <base-checkbox
              v-for="(option, index) in field.options"
              :key="index"
              v-model="formData[field.label]"
              :name="option.name"
              @input="handleRadioChange(option.label, field.label)"
              :value="index == 0 ? true : false"
            >
              {{ option.label }}
            </base-checkbox>
          </div>

          <div class="radio-group" v-if="field.fieldType == 'radio_group'">
            <base-radio
              v-for="(option, index) in field.options"
              :key="index"
              v-model="formData[field.label]"
              :name="option.name"
              @input="handleRadioChange(option.label, field.label)"
              :value="index == 0 ? true : false"
            >
              {{ option.label }}
            </base-radio>
          </div>
        </div>
      </div>
      <base-button type="submit" @click="handleSubmit">Submit</base-button>
    </card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      test: "",
      formData: {},
      formId: this.$route.params.id,
      forms: {},
    };
  },
  created() {
    this.fetchForms();
  },
  methods: {
    async fetchForms() {
      try {
        const response = await axios.get(
          `http://localhost:5143/api/Forms/${this.formId}`
        );
        this.forms = response.data;
        this.formData = {
          ...response.data.fields.map((el) => {
            return {
              [el.label]: "",
            };
          })[response.data.fields.length - 1],
        };
        console.log(this.formData);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    },
    handleSubmit() {
      const payload = {
        formId: this.formId,
        userId: JSON.parse(localStorage.getItem("user")).userId,
        fieldValues: this.formData,
      };
      axios
        .post(`http://localhost:5143/api/Forms/submit-form`, payload)
        .then((res) => {
          this.$notify({
            type: "success",
            message: "Form submitted successfully",
            icon: "tim-icons icon-check-2",
            verticalAlign: "top",
            horizontalAlign: "right",
          });
          this.$router.push("/forms");
        })
        .catch((err) => {
          this.$notify({
            type: "error",
            message: "Form submission failed",
            icon: "tim-icons icon-check-2",
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        });

      // You can also send this data to your backend if needed
    },
    handleCheckboxChange(value, label) {
      console.log(value);
      this.formData[label] = value;
    },
    handleRadioChange(value, label) {
      this.formData[label] = value;
    },
  },
};
</script>

<style scoped>
.forms-list-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
