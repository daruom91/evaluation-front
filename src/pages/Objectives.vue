<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title">Objectives Management</h4>
          <base-button v-if="isManager" type="primary" @click="onAddObjective">
            <i class="tim-icons icon-simple-add"></i>
            Add Objective
          </base-button>
        </div>
        <div class="table-responsive">
          <form @submit.prevent="onFilter" class="d-flex gap-2 align-items-center justify-content-between">
            <div class="form-group">
              <input type="text" class="form-control" v-model="title" placeholder="Objective Title">
            </div>
            <div class="form-group">
              <select class="form-control" v-model="campaignId">
                <option value="">All Campaigns</option>
                <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                  {{campaign.name}}
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
                <td colspan="7" class="text-center py-4 text-muted">
                  <i class="tim-icons icon-alert-circle-exc mb-2 d-block" style="font-size: 24px;"></i>
                  No objectives found
                </td>
              </tr>
            </template>
            <template slot-scope="{row}">
              <tr>
                <td>{{row.title}}</td>
                <td>{{row.description}}</td>
                <td>{{formatDate(row.startDate)}}</td>
                <td>{{formatDate(row.dueDate)}}</td>
                <td>{{row.campaignName}}</td>
                <td>{{row.employees.map(e => e.name).join(', ')}}</td>
              <td class="td-actions text-right">
                <base-button type="link" @click="onEditObjective(row)" class="mr-1">
                  <i class="tim-icons icon-pencil"></i>
                </base-button>


                <base-button type="link" @click="onDoneObjective(row)" v-if="row.status === 0">
                  <i class="tim-icons icon-check-2"></i>
                </base-button>
                <base-button type="link" @click="onDeleteObjective(row)">
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
        <p>Are you sure you want to delete objective "{{objectiveToDelete?.title}}"?</p>
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
  name: 'objectives-page',
  components: {
    BaseTable,
    Modal
  },
  computed: {
    isManager() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role == 'Manager';
    }
  },
  data() {
    return {
      title: '',
      campaignId: '',
      tableColumns: ['Title', 'Description', 'Start Date', 'Due Date', 'Campaign', 'Employees', 'Actions'],
      tableData: [],
      campaigns: [],
      showDeleteModal: false,
      objectiveToDelete: null
    }
  },
  async mounted() {
    await this.onFilter();
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async onFilter() {
      let url = `Objectives`
      const response = await fetchData(`${url}`, 'get');
      console.log('onFilter', response);
      this.tableData = response.data;
    },
    onAddObjective() {
      this.$router.push('/objectives/create');
    },
    onEditObjective(objective) {
      this.$router.push(`/objectives/edit/${objective.id}`);
    },
    onDeleteObjective(objective) {
      this.objectiveToDelete = objective;
      this.showDeleteModal = true;
    },
    async onDoneObjective(objective) {
      try {
        await fetchData(`Objectives/${objective.id}/markAsDone`, 'put');
        this.$notify({
          type: 'success',
          message: 'Objective marked as done',
          icon: 'tim-icons icon-check-2'
        });
        await this.onFilter();
      } catch (error) {
        this.$notify({
          type: 'danger',
          message: 'Error marking objective as done',
          icon: 'tim-icons icon-alert-circle-exc'
        });
      }
    },
    async confirmDelete() {
      try {
        await fetchData(`Objectives/${this.objectiveToDelete.id}`, 'delete');
        this.$notify({
          type: 'success',
          message: 'Objective deleted successfully',
          icon: 'tim-icons icon-check-2'
        });
        await this.onFilter();
      } catch (error) {
        this.$notify({
          type: 'danger',
          message: 'Error deleting objective',
          icon: 'tim-icons icon-alert-circle-exc'
        });
      } finally {
        this.showDeleteModal = false;
        this.objectiveToDelete = null;
      }
    }
  }
}
</script>

<style scoped>
.text-success {
  color: #00f2c3 !important;
}
.text-warning {
  color: #ff8d72 !important;
}
</style>
