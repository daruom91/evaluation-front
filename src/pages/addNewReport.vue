<template>
  <card>
    <h4 slot="header">Add New Report</h4>
    <base-input v-model="form.name" label="Name" placeholder="Enter Name" />
    <base-input
      v-model="form.description"
      label="Description"
      placeholder="Enter Description"
      type="textarea"
    />
    <base-button type="submit" @click="submitForm" fill>
      {{ this.$route.params.id ? "Update" : "Save" }}
    </base-button>
  </card>
</template>
<script>
import { BaseInput, BaseButton } from "@/components";
import axios from "axios";
export default {
  components: {
    BaseInput,
    BaseButton,
  },
  data() {
    const reportId = this.$route.params.id;
    if (reportId) {
      this.fetchReport();
      return {
        form: {
          id: reportId,
          name: "",
          description: "",
        },
      };
    }
    return {
      form: {
        name: "",
        description: "",
      },
    };
  },
  methods: {
    fetchReport() {
      axios
        .get(`http://localhost:5143/api/ReportData/${this.$route.params.id}`)
        .then((res) => {
          this.form = { ...res.data };
        });
    },
    submitForm() {
      if (this.$route.params.id) {
        axios
          .put(
            `http://localhost:5143/api/ReportData/${this.$route.params.id}`,
            {
              ...this.form,
              createdById: JSON.parse(localStorage.getItem("user")).userId,
            }
          )
          .then((res) => {
            this.$router.push("/reports");
          });
      } else {
        axios
          .post("http://localhost:5143/api/ReportData", {
            ...this.form,
            createdById: JSON.parse(localStorage.getItem("user")).userId,
          })
          .then((res) => {
            this.$router.push("/reports");
          });
      }
    },
  },
};
</script>
