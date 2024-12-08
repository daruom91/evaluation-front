<template>
  <div class="campaign-form">
    <card>
      <h4 slot="header">Create Campaign</h4>
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
          <option
            v-for="el in campaignTypes"
            :key="el.value"
            :value="el.value"
            class="dark"
          >
            {{ el.text }}
          </option>
        </select>
        <label for="campaignManager">Assign to Manager</label>
        <select
          class="form-control dark"
          v-model="campaign.assignedUser"
          id="campaignManager"
          placeholder="Select Manager"
        >
          <option value="" disabled class="dark">Select Manager</option>
          <option v-for="el in userOptions" :key="el.value" :value="el.value">
            {{ el.text }}
          </option>
        </select>
        <base-button @click="submitForm" type="submit" fill>
          Create Campaign
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
      campaign: {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        type: "",
        assignedUser: null,
      },
      campaignTypes: [
        { value: "Annual", text: "Annuelle" },
        { value: "Weekly", text: "Semestrielle" },
        { value: "Quarterly", text: "Trimestrielle" },
      ],
      userOptions: [],
    };
  },
  created() {
    axios
      .get("http://localhost:5143/api/Users/filter?role=manager")
      .then((response) => {
        this.userOptions = response.data.map((el) => ({
          value: el.id,
          text: `${el.firstName} ${el.lastName}`,
        }));
      });
  },
  methods: {
    getCurrentUser() {
      return JSON.parse(localStorage.getItem("user"));
    },
    submitForm() {
      if (
        this.campaign.name &&
        this.campaign.description &&
        this.campaign.startDate &&
        this.campaign.endDate &&
        this.campaign.type &&
        this.campaign.assignedUser
      ) {
        const payload = {
          id: "",
          name: this.campaign.name,
          description: this.campaign.description,
          startDate: new Date(this.campaign.startDate),
          endDate: new Date(this.campaign.endDate),
          type: this.campaign.type,
          createdByUserId: this.getCurrentUser().userId,
          managers: [{ id: this.campaign.assignedUser, name: "" }],
          createdByUserName: "",
        };
        this.$emit("submit", payload);
      } else {
        alert("Please fill in all fields");
      }
    },
  },
};
</script>

<style scoped>
.campaign-form {
  max-width: 600px;
  margin: 0 auto;
}
.dark {
  background-color: #1d253b;
  color: #fff;
}
</style>
