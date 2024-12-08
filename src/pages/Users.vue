<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title">Users Management</h4>
          <base-button type="primary" @click="onAddUser">
            <i class="tim-icons icon-simple-add"></i>
            Add User
          </base-button>
        </div>
        <div class="table-responsive">
          <form @submit.prevent="onFilter"  class="d-flex gap-2 align-items-center justify-content-between">
            <div class="form-group">
              <input type="text" class="form-control" v-model="username" placeholder="Username">
            </div>
            <div class="form-group">
              <input type="text" class="form-control" v-model="email" placeholder="Email">
            </div>
            <div class="form-group">
              <select class="form-control" v-model="role">
                <option value="" disabled selected>Select Role</option>
                <option value="RH">RH</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Filter</button>
            </div>
          </form>
          <base-table
            :data="tableData"
            :columns="tableColumns"
            thead-classes="text-primary"
          >
            <template slot="empty-state">
              <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="tim-icons icon-alert-circle-exc mb-2 d-block" style="font-size: 24px;"></i>
                  No users found
                </td>
              </tr>
            </template>
            <template slot-scope="{row}">
              <tr>
                <td>{{row.firstName + " " + row.lastName}}</td>
                <td>{{row.userName}}</td>
                <td>{{row.email}}</td>
                <td>{{row.roles.join(', ')}}</td>
                <td class="td-actions text-right">
                  <base-button type="link" @click="onEditUser(row)" class="mr-1">
                    <i class="tim-icons icon-pencil"></i>
                  </base-button>
                  <base-button type="link" @click="onDeleteUser(row)">
                    <i class="tim-icons icon-simple-remove"></i>
                  </base-button>
                </td>
              </tr>
            </template>
          </base-table>
        </div>
      </card>
    </div>

    <modal :show.sync="showDeleteModal" headerClasses="justify-content-center">
      <template slot="header">
        <h4 class="title title-up">Confirm Delete</h4>
      </template>
      <template>
        <p>Are you sure you want to delete user "{{userToDelete?.firstName}} {{userToDelete?.lastName}}"?</p>
        <p class="text-muted">This action cannot be undone.</p>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">
          Cancel
        </base-button>
        <base-button type="danger" @click="confirmDelete">
          Delete
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import { BaseTable, Modal } from "@/components";
import { fetchData } from "../fetch";

export default {
  name: 'users-page',
  components: {
    BaseTable,
    Modal
  },
  data() {
    return {
      username: '',
      email: '',
      role: '',
      tableColumns: ['Name', 'Username', 'Email', 'Role', 'Actions'],
      tableData: [],
      showDeleteModal: false,
      userToDelete: null
    }
  },
  async mounted() {
    // const user = getUser();
    // console.log(user);
    await this.onFilter();
  },
  methods: {
    async onFilter() {
      let url = `Users/filter?username=${this.username}&email=${this.email}&role=${this.role}`
      const response = await fetchData(`${url}`, 'get');
      this.tableData = response.data;
    },
    onAddUser() {
      this.$router.push('/users/create');
    },
    onEditUser(user) {
      this.$router.push(`/users/edit/${user.id}`);
    },
    onDeleteUser(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      try {
        await fetchData(`Users/delete/${this.userToDelete.id}`, 'delete');
        this.$notify({
          type: 'success',
          message: 'User deleted successfully',
          icon: 'tim-icons icon-check-2'
        });
        await this.onFilter();
      } catch (error) {
        this.$notify({
          type: 'danger',
          message: 'Error deleting user',
          icon: 'tim-icons icon-alert-circle-exc'
        });
      } finally {
        this.showDeleteModal = false;
        this.userToDelete = null;
      }
    }
  }
}
</script>
