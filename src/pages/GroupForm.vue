<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title">
            {{ isEdit ? "Edit Group" : "Create Group" }}
          </h4>
          <base-button type="secondary" @click="$router.push('/groups')">
            <i class="tim-icons icon-minimal-left"></i>
            Back to Groups
          </base-button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-6">
              <base-input
                label="Group Name"
                v-model="form.name"
                placeholder="Enter group name"
                required
              />
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label>Manager</label>
                <select
                  class="form-control dark"
                  v-model="form.managerId"
                  required
                >
                  <option value="" disabled>Select Manager</option>
                  <option
                    v-for="manager in managers"
                    :key="manager.id"
                    :value="manager.id"
                    class="dark"
                  >
                    {{ manager.firstName }} {{ manager.lastName }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label>Group Members</label>
                <div class="mb-2">
                  <base-input
                    v-model="employeeSearch"
                    placeholder="Search employees..."
                    @input="filterEmployees"
                  >
                  </base-input>
                </div>
                <select
                  multiple
                  class="form-control"
                  v-model="form.employeeIds"
                >
                  <option
                    v-for="employee in filteredEmployees"
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
              {{ isEdit ? "Update Group" : "Create Group" }}
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
  name: "group-form",
  data() {
    return {
      form: {
        name: "",
        managerId: "",
        managerName: "",
        employeeIds: [],
      },
      managers: [],
      employees: [],
      employeeSearch: "",
      filteredEmployees: [],
      isEdit: false,
    };
  },
  watch: {
    employees: {
      immediate: true,
      handler(val) {
        this.filteredEmployees = val;
      },
    },
  },
  async created() {
    await this.fetchUsers();

    const groupId = this.$route.params.id;
    if (groupId) {
      this.isEdit = true;
      await this.fetchGroup(groupId);
    }
  },
  methods: {
    filterEmployees() {
      if (!this.employeeSearch) {
        this.filteredEmployees = this.employees;
        return;
      }

      const searchTerm = this.employeeSearch.toLowerCase();
      this.filteredEmployees = this.employees.filter((employee) => {
        const fullName =
          `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(searchTerm);
      });
    },
    async fetchUsers() {
      try {
        const response = await fetchData("Users/filter", "get");
        const users = response.data;

        // Filter users by role
        this.managers = users.filter((user) => user.roles.includes("Manager"));
        this.employees = users.filter((user) =>
          user.roles.includes("Employee")
        );
        this.filteredEmployees = this.employees;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchGroup(id) {
      try {
        const response = await fetchData(`Groups/${id}`, "get");
        this.form = response.data;
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    },
    async handleSubmit() {
      try {
        const endpoint = this.isEdit
          ? `Groups/update/${this.$route.params.id}`
          : "Groups/create";
        const method = this.isEdit ? "put" : "post";
        const manager = this.managers.find(
          (manager) => manager.id === this.form.managerId
        );
        this.form.id = this.$route.params.id;
        this.form.managerName = `${manager.firstName} ${manager.lastName}`;
        await fetchData(endpoint, method, this.form);

        this.$notify({
          type: "success",
          message: `Group ${this.isEdit ? "updated" : "created"} successfully`,
          icon: "tim-icons icon-check-2",
        });

        this.$router.push("/groups");
      } catch (error) {
        this.$notify({
          type: "danger",
          message: `Error ${this.isEdit ? "updating" : "creating"} group`,
          icon: "tim-icons icon-alert-circle-exc",
        });
      }
    },
  },
};
</script>

<style scoped>
.form-control[multiple] {
  min-height: 200px;
}
</style>
