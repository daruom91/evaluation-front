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
          <option selected value="annuelle" class="dark">Annuelle</option>
          <option value="semestrielle" class="dark">Semestrielle</option>
          <option value="trimestrielle" class="dark">Trimestrielle</option>
        </select>
        <label for="campaignManager">Assign to Manager</label>
        <select
          class="form-control dark"
          v-model="campaign.assignedUser"
          id="campaignManager"
        >
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
        { value: "triamterene", text: "Triamterene" },
        { value: "annuelle", text: "Annuelle" },
        { value: "semestrielle", text: "Semestrielle" },
        { value: "trimestrielle", text: "Trimestrielle" },
      ],
      userOptions: [],
    };
  },
  created() {
    axios
      .get("http://localhost:5143/api/Users/filter?role=manager")
      .then((response) => {
        console.log(response.data);
        this.userOptions = response.data.map((el) => ({
          value: el.id,
          text: `${el.firstName} ${el.lastName}`,
        }));
      });
  },
  methods: {
    submitForm() {
      if (
        this.campaign.name &&
        this.campaign.description &&
        this.campaign.startDate &&
        this.campaign.endDate &&
        this.campaign.type &&
        this.campaign.assignedUser
      ) {
        console.log("Campaign data:", this.campaign);
        this.$emit("submit", this.campaign);
      } else {
        console.log("Please fill in all fields");
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
