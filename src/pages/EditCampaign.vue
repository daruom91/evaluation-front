<template>
  <div class="edit-campaign-page">
    <card v-if="campaign">
      <h4 slot="header">Edit Campaign</h4>
      <form @submit.prevent="submitForm">
        <base-input
          v-model="campaign.name"
          label="Campaign Name"
          placeholder="Enter campaign name"
          required
        />
        <base-input
          v-model="campaign.description"
          label="Description"
          placeholder="Enter campaign description"
          type="textarea"
          rows="4"
          required
        />
        <base-input
          v-model="campaign.startDate"
          label="Start Date"
          type="date"
          required
        />
        <base-input
          v-model="campaign.endDate"
          label="End Date"
          type="date"
          required
        />
        <label for="campaignType">Campaign Type</label>
        <select
          class="form-control dark"
          v-model="campaign.type"
          id="campaignType"
        >
          <option v-for="el in campaignTypes" :key="el.value" :value="el.value">
            {{ el.text }}
          </option>
        </select>
        <label for="campaignManager">Assign to Manager</label>
        <select
          class="form-control dark"
          v-model="campaign.assignedUser"
          id="campaignManager"
        >
          <option value="" disabled>Select Manager</option>
          <option v-for="el in userOptions" :key="el.value" :value="el.value">
            {{ el.text }}
          </option>
        </select>
        <base-button type="submit" @click="submitForm" fill>
          Save Changes
        </base-button>
      </form>
    </card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      campaign: null,
      campaignTypes: [
        { value: "Annual", text: "Annuelle" },
        { value: "Weekly", text: "Semestrielle" },
        { value: "Quarterly", text: "Trimestrielle" },
      ],
      userOptions: [],
    };
  },
  created() {
    this.fetchCampaign();
    this.fetchUserOptions();
  },
  methods: {
    getCurrentUser() {
      return JSON.parse(localStorage.getItem("user"));
    },
    fetchCampaign() {
      const campaignId = this.$route.params.id;
      axios
        .get(`http://localhost:5143/api/Campaigns/getall`)
        .then((response) => {
          const campaign = response.data.find((el) => el.id === campaignId);
          this.campaign = {
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            startDate: campaign.startDate.split("T")[0],
            endDate: campaign.endDate.split("T")[0],
            type: campaign.type,
            assignedUser: campaign.managers[0]?.id || "",
          } || {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            type: "",
            assignedUser: "",
          };
        });
    },
    fetchUserOptions() {
      axios
        .get("http://localhost:5143/api/Users/filter?role=manager")
        .then((response) => {
          this.userOptions = response.data.map((el) => ({
            value: el.id,
            text: `${el.firstName} ${el.lastName}`,
          }));
        });
    },
    submitForm() {
      const payload = {
        id: this.campaign.id,
        name: this.campaign.name,
        description: this.campaign.description,
        startDate: new Date(this.campaign.startDate),
        endDate: new Date(this.campaign.endDate),
        type: this.campaign.type,
        createdByUserId: this.getCurrentUser().userId,
        createdByUserName: "",
        managers: [
          {
            id: this.campaign.assignedUser,
            name: "",
          },
        ],
      };
      axios
        .put(
          `http://localhost:5143/api/Campaigns/update/${this.campaign.id}`,
          payload
        )
        .then(() => {
          axios
            .post(`http://localhost:5143/api/Campaigns/Share`, {
              campaignId: this.campaign.id,
              managerIds: [this.campaign.assignedUser],
            })
            .then(() => {
              this.$router.push("/campaigns");
            });
        });
    },
  },
};
</script>

<style scoped>
.edit-campaign-page {
  max-width: 600px;
  margin: 0 auto;
}
.dark {
  background-color: #1d253b;
  color: #fff;
}
</style>
