<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title">Groups Management</h4>
          <base-button type="primary" @click="onAddGroup">
            <i class="tim-icons icon-simple-add"></i>
            Add Group
          </base-button>
        </div>
        <div class="table-responsive">
          <form @submit.prevent="onFilter" class="d-flex gap-2 align-items-center justify-content-between">
            <div class="form-group">
              <input type="text" class="form-control" v-model="groupName" placeholder="Group Name">
            </div>
            <div class="form-group">
              <select class="form-control" v-model="managerId">
                <option value="">All Managers</option>
                <option v-for="manager in managers" :key="manager.id" :value="manager.id">
                  {{manager.firstName}} {{manager.lastName}}
                </option>
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
                <td colspan="4" class="text-center py-4 text-muted">
                  <i class="tim-icons icon-alert-circle-exc mb-2 d-block" style="font-size: 24px;"></i>
                  No groups found
                </td>
              </tr>
            </template>
            <template slot-scope="{row}">
              <tr>
                <td>{{row.name}}</td>
                <td>{{row.managerName}}</td>
                <td>{{row?.employeeIds?.length}} members</td>
                <td class="td-actions text-right">
                <base-button type="link" @click="onEditGroup(row)" class="mr-1">
                  <i class="tim-icons icon-pencil"></i>
                </base-button>
                <base-button type="link" @click="onDeleteGroup(row)">
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
        <p>Are you sure you want to delete group "{{groupToDelete?.name}}"?</p>
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
  name: 'groups-page',
  components: {
    BaseTable,
    Modal
  },
  data() {
    return {
      groupName: '',
      managerId: '',
      managers: [],
      tableColumns: ['Name', 'Manager', 'Members', 'Actions'],
      tableData: [],
      showDeleteModal: false,
      groupToDelete: null
    }
  },
  async mounted() {
    await this.fetchManagers();
    await this.onFilter();
  },
  methods: {
    async fetchManagers() {
      try {
        const response = await fetchData('Users/filter', 'get');
        this.managers = response.data.filter(user => user.roles.includes('Manager'));
      } catch (error) {
        console.error('Error fetching managers:', error);
        this.$notify({
          type: 'danger',
          message: 'Error fetching managers',
          icon: 'tim-icons icon-alert-circle-exc'
        });
      }
    },
    async onFilter() {
      let url = `Groups/filter?name=${this.groupName}&managerId=${this.managerId}`
      const response = await fetchData(`${url}`, 'get');
      console.log('onFilter', response);
      this.tableData = response.data;
    },
    onAddGroup() {
      this.$router.push('/groups/create');
    },
    onEditGroup(group) {
      this.$router.push(`/groups/edit/${group.id}`);
    },
    onDeleteGroup(group) {
      this.groupToDelete = group;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      try {
        await fetchData(`Groups/delete/${this.groupToDelete.id}`, 'delete');
        this.$notify({
          type: 'success',
          message: 'Group deleted successfully',
          icon: 'tim-icons icon-check-2'
        });
        await this.onFilter();
      } catch (error) {
        this.$notify({
          type: 'danger',
          message: 'Error deleting group',
          icon: 'tim-icons icon-alert-circle-exc'
        });
      } finally {
        this.showDeleteModal = false;
        this.groupToDelete = null;
      }
    }
  }
}
</script>
