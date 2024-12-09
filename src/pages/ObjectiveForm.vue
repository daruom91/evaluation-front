<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title">
            {{ isEdit ? "Edit Objective" : "Create Objective" }}
          </h4>
          <base-button type="secondary" @click="$router.push('/objectives')">
            <i class="tim-icons icon-minimal-left"></i>
            Back to Objectives
          </base-button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-12">
              <base-input
                label="Title"
                v-model="form.title"
                placeholder="Enter objective title"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <base-input
                type="date"
                label="Start Date"
                v-model="form.startDate"
                required
              />
            </div>
            <div class="col-md-4">
              <base-input
                type="date"
                label="Due Date"
                v-model="form.dueDate"
                required
              />
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label>Campaign</label>
                <select class="form-control" v-model="form.campaignId" required>
                  <option value="" disabled>Select Campaign</option>
                  <option
                    v-for="campaign in campaigns"
                    :key="campaign.id"
                    :value="campaign.id"
                  >
                    {{ campaign.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label>Description</label>
                <textarea
                  class="form-control"
                  v-model="form.description"
                  rows="4"
                  placeholder="Enter objective description"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label>Assign Employees</label>
                <select
                  class="form-control dark"
                  v-model="form.employeeIds"
                  multiple
                  required
                >
                  <option
                    v-for="employee in employees"
                    class="dark"
                    :key="employee.id"
                    :value="employee.id"
                  >
                    {{ employee.firstName }} {{ employee.lastName }}
                  </option>
                </select>
                <small class="form-text text-muted"
                  >Hold Ctrl/Cmd to select multiple employees</small
                >
              </div>
            </div>
          </div>

          <div class="text-right">
            <base-button type="primary" native-type="submit">
              {{ isEdit ? "Update Objective" : "Create Objective" }}
            </base-button>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import { fetchData } from "../fetch";

export default {
  name: "objective-form",
  data() {
    return {
      form: {
        title: "",
        description: "",
        startDate: "",
        dueDate: "",
        campaignId: "",
        employeeIds: [],
      },
      isEdit: false,
      campaigns: [],
      employees: [],
    };
  },
  async created() {
    await this.fetchCampaigns();
    await this.fetchEmployees();
    const objectiveId = this.$route.params.id;
    if (objectiveId) {
      this.isEdit = true;
      await this.fetchObjective(objectiveId);
    }
  },
  methods: {
    async fetchCampaigns() {
      try {
        const response = await fetchData("Campaigns/getall", "get");
        this.campaigns = response.data;
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        this.$notify({
          type: "danger",
          message: "Error fetching campaigns",
          icon: "tim-icons icon-alert-circle-exc",
        });
      }
    },
    async fetchEmployees() {
      try {
        const response = await fetchData("Users/getall", "get");
        this.employees = response.data.filter((user) =>
          user.roles.includes("Employee")
        );
      } catch (error) {
        console.error("Error fetching employees:", error);
        this.$notify({
          type: "danger",
          message: "Error fetching employees",
          icon: "tim-icons icon-alert-circle-exc",
        });
      }
    },
    async fetchObjective(id) {
      try {
        const response = await fetchData(`Objectives/${id}`, "get");
        this.form = {
          ...response.data,
          campaignId: this.campaigns.find(
            (c) => c.name === response.data.campaignName
          )?.id,
          employeeIds: response.data.employees.map((e) => e.employeeId),
          startDate: response.data.startDate.split("T")[0],
          dueDate: response.data.dueDate.split("T")[0],
        };
      } catch (error) {
        console.error("Error fetching objective:", error);
      }
    },
    async handleSubmit() {
      try {
        const endpoint = this.isEdit
          ? `Objectives/${this.$route.params.id}`
          : "Objectives";
        const method = this.isEdit ? "put" : "post";
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.form.createdByManagerId = user.userId;
        await fetchData(endpoint, method, this.form);

        this.$notify({
          type: "success",
          message: `Objective ${
            this.isEdit ? "updated" : "created"
          } successfully`,
          icon: "tim-icons icon-check-2",
        });

        this.$router.push("/objectives");
      } catch (error) {
        this.$notify({
          type: "danger",
          message: `Error ${this.isEdit ? "updating" : "creating"} objective`,
          icon: "tim-icons icon-alert-circle-exc",
        });
      }
    },
  },
};
</script>
