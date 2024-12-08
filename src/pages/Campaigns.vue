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
          <td class="td-actions text-right">
            <base-button
              type="link"
              @click="onEditCampaign(row.id)"
              class="mr-1"
            >
              <i class="tim-icons icon-pencil"></i>
            </base-button>
            <base-button type="link" @click="onDeleteCampaign(row)">
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </td>
        </tr>
        </template>
      </base-table>
    </card>

    <modal
      :show.sync="showCreateCampaignForm"
      @close="showCreateCampaignForm = false"
    >
      <campaign-form
        @submit="addCampaign"
        :showCreateCampaignForm="showCreateCampaignForm"
      />
    </modal>
  </div>
</template>

<script>
import CampaignForm from "@/components/CampaignForm.vue";
import { BaseTable, BaseButton, Modal } from "@/components";
import axios from "axios";
import { format } from "date-fns";

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
      campaigns: [],
      columns: [
        "Name",
        "Description",
        "Start Date",
        "End Date",
        "Type",
        "Assigned User",
        "Actions",
      ],
    };
  },
  created() {
    this.fetchCampaigns();
  },
  methods: {
    async onEditCampaign(campaignId) {
      console.log(campaignId);
      this.$router.push(`/campaigns/edit/${campaignId}`);
    },
    async onDeleteCampaign(campaign) {
      axios
        .delete(`http://localhost:5143/api/Campaigns/delete/${campaign.id}`)
        .then((res) => {
          this.fetchCampaigns();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async fetchCampaigns() {
      try {
        const res = await axios.get(
          "http://localhost:5143/api/Campaigns/getall"
        );
        this.campaigns = res.data.map((el) => ({
          id: el.id,
          name: el.name,
          description: el.description,
          startDate: format(new Date(el.startDate), "MM/dd/yyyy"),
          endDate: format(new Date(el.endDate), "MM/dd/yyyy"),
          type: el.type,
          assignedUser: el.createdByUserName,
        }));
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    },
    toggleCreateCampaignForm() {
      this.showCreateCampaignForm = !this.showCreateCampaignForm;
    },
    addCampaign(newCampaign) {
      axios
        .post("http://localhost:5143/api/Campaigns/create", newCampaign)
        .then((res) => {
          // this.fetchCampaigns();
          console.log("newCampaign", newCampaign);
          axios
            .post(`http://localhost:5143/api/Campaigns/Share`, {
              campaignId: res.data.campaignId,
              managerIds: newCampaign.managers.map((el) => el.id),
            })
            .then((res) => {
              this.showCreateCampaignForm = false;
              this.fetchCampaigns();
            });
        });
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
