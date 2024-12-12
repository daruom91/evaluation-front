<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title">Events Management</h4>
        </div>
        <div class="table-responsive">
          <form @submit.prevent="onFilter" class="d-flex gap-2 align-items-center justify-content-between">

            <div class="form-group">
              <input type="text" class="form-control" v-model="title" placeholder="Title" />
            </div>

            <div class="form-group">
              <select class="form-control dark" v-model="managerId">
                <option value="" disabled selected>Select Manager</option>
                <option v-for="manager in managers" :value="manager.id">{{ manager.firstName }} {{ manager.lastName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <select class="form-control dark" v-model="employeeId">
                <option value="" disabled selected>Select Employee</option>
                <option v-for="employee in employees" :value="employee.id">{{ employee.firstName }} {{ employee.lastName
                  }}</option>
              </select>
            </div>

            <div class="form-group">
              <button type="submit" class="btn btn-primary">Filter</button>
            </div>
          </form>
          <base-table :data="tableData" :columns="tableColumns" thead-classes="text-primary">
            <template slot="empty-state">
              <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="tim-icons icon-alert-circle-exc mb-2 d-block" style="font-size: 24px"></i>
                  No users found
                </td>
              </tr>
            </template>
            <template slot-scope="{ row }">
              <tr>
                <td>{{ row?.title }}</td>
                <td>{{ row?.manager?.name }}</td>
                <td>{{ row?.employee?.name }}</td>
                <td>{{ row?.startDate }}</td>
                <td>{{ row?.endDate }}</td>
                <td class="td-actions text-right" v-if="user?.role !== 'Employee'">

                  <template>
                    <base-button type="link" @click="onEditEvent(row)" class="mr-1">
                      <i class="tim-icons icon-pencil"></i>
                    </base-button>
                    <base-button type="link" @click="onDeleteEvent(row)">
                      <i class="tim-icons icon-simple-remove"></i>
                    </base-button>

                  </template>
                </td>
              </tr>
            </template>
          </base-table>
        </div>
      </card>
    </div>

    <modal :show.sync="showAddModal" v-if="eventToEdit">
      <h4>Create Event</h4>
      <base-input v-model="eventToEdit.title" type="text" label="Event Title" />
      <base-input v-model="eventToEdit.startDate" type="datetime-local" label="Start Date" />

      <base-input v-model="eventToEdit.endDate" type="datetime-local" label="End Date" />
      <div class="form-group">
        <label>Manager</label>
        <select v-model="eventToEdit.managerId" class="form-control dark" label="Manager">
          <option value="" disabled selected>Select Manager</option>
          <option v-for="manager in managers" :value="manager.id" :key="manager.id">
            {{ manager.firstName }} {{ manager.lastName }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Employee</label>
        <select v-model="eventToEdit.employeeId" class="form-control dark" label="Employee">
          <option value="" disabled selected>Select Employee</option>
          <option v-for="employee in employees" :value="employee.id" :key="employee.id">
            {{ employee.firstName }} {{ employee.lastName }}
          </option>
        </select>
      </div>
      <div class="d-flex justify-content-between">
        <base-button @click="onAddEvent" type="primary">Edit</base-button>
        <base-button @click="showAddModal = false" type="primary">Close</base-button>
      </div>
    </modal>

    <modal :show.sync="showDeleteModal" headerClasses="justify-content-center">
      <template slot="header">
        <h4 class="title title-up">Confirm Delete</h4>
      </template>
      <template>
        <p>
          Are you sure you want to delete event "{{ eventToDelete?.title }}"?
        </p>
        <p class="text-muted">This action cannot be undone.</p>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">
          Cancel
        </base-button>
        <base-button type="danger" @click="confirmDelete"> Delete </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import { BaseTable, Modal } from "@/components";
import { fetchData, getUser } from "../fetch";

export default {
  name: "users-page",
  components: {
    BaseTable,
    Modal,
  },
  data() {
    return {
      title: '',
      managerId: '',
      employeeId: '',
      tableColumns: ["Title", "Manager", "Employee", "Start Date", "End Date", "Actions"],
      tableData: [],
      showDeleteModal: false,
      eventToDelete: null,
      user: {},
      showAddModal: false,
      users: [],
      managers: [],
      employees: [],
      eventToEdit: null,
    };
  },
  async mounted() {
    this.user = getUser();
    // console.log(user);
    await this.onFilter();
    await this.getUsers();
  },
  methods: {
    async getUsers() {
      const response = await fetchData("Users/getall", "get");
      this.users = response.data;
      this.managers = this.users.filter((user) => user.roles.includes("Manager"));
      this.employees = this.users.filter((user) => user.roles.includes("Employee"));
      console.log(this.managers);
      console.log(this.employees);
    },

    async onAddEvent() {
      const response = await fetchData(`Events/${this.eventToEdit.id}`, "put", {
        ...this.eventToEdit,
      });
      console.log(response);
      await this.onFilter();
      this.showAddModal = false;
    },
    async onFilter() {
      let url = `Events/filter?title=${this.title}&managerId=${this.managerId}&employeeId=${this.employeeId}`;
      const response = await fetchData(`${url}`, "get");
      this.tableData = response.data;
    },
    onEditEvent(event) {
      this.eventToEdit = event;
      this.eventToEdit.employeeId = event.employee.id;
      this.eventToEdit.managerId = event.manager.id;
      delete this.eventToEdit.employee;
      delete this.eventToEdit.manager;
      this.showAddModal = true;
    },
    onDeleteEvent(event) {
      this.eventToDelete = event;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      try {
        await fetchData(`Events/${this.eventToDelete.id}`, "delete");
        this.$notify({
          type: "success",
          message: "Event deleted successfully",
          icon: "tim-icons icon-check-2",
        });
        await this.onFilter();
      } catch (error) {
        this.$notify({
          type: "danger",
          message: "Error deleting event",
          icon: "tim-icons icon-alert-circle-exc",
        });
      } finally {
        this.showDeleteModal = false;
        this.eventToDelete = null;
      }
    },
  },
};
</script>
