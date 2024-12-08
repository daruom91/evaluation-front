<template>
  <div class="campaigns-page">
    <card>
      <h4 slot="header">Campaigns</h4>
      <base-button @click="toggleCreateCampaignForm" type="primary" fill>
        Create New Campaign
      </base-button>
      <base-table :data="campaigns" :columns="columns" class="mt-4">
        <template slot="empty-state">
          <tr>
            <td colspan="6" class="text-center py-4 text-muted">
              <i class="tim-icons icon-alert-circle-exc mb-2 d-block" style="font-size: 24px;"></i>
              No campaigns found
            </td>
          </tr>
        </template>
        <template slot-scope="{ row }">
          <tr>
            <td>{{ row.name }}</td>
            <td>{{ row.description }}</td>
            <td>{{ row.startDate }}</td>
            <td>{{ row.endDate }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.assignedUser }}</td>
          </tr>
        </template>
      </base-table>
    </card>

    <modal
      :show.sync="showCreateCampaignForm"
      @close="showCreateCampaignForm = false"
    >
      <campaign-form @submit="addCampaign" />
    </modal>
  </div>
</template>

<script>
import CampaignForm from "@/components/CampaignForm.vue";
import { BaseTable, BaseButton, Modal } from "@/components";

export default {
  components: {
    CampaignForm,
    BaseTable,
    BaseButton,
    Modal,
  },
  data() {
    return {
      showCreateCampaignForm: false,
      campaigns: [
        {
          name: "Campaign 1",
          description: "Description 1",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          type: "annuelle",
          assignedUser: "User 1",
        },
        {
          name: "Campaign 2",
          description: "Description 2",
          startDate: "2023-06-01",
          endDate: "2023-12-01",
          type: "semestrielle",
          assignedUser: "User 2",
        },
      ],
      columns: [
        "Name",
        "Description",
        "Start Date",
        "End Date",
        "Type",
        "Assigned User",
      ],
    };
  },
  methods: {
    toggleCreateCampaignForm() {
      console.log("Button clicked");
      this.showCreateCampaignForm = !this.showCreateCampaignForm;
    },
    addCampaign(newCampaign) {
      this.campaigns.push(newCampaign);
      this.showCreateCampaignForm = false;
    },
  },
};
</script>

<style scoped>
.campaigns-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
