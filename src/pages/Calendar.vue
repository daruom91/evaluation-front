<template>
  <div class="event-calendar">
    <base-button @click="addSampleEvent" type="primary" class="mb-3">
      Add One To One
    </base-button>

    <vue-cal style="height: 650px" :selected-date="new Date().toISOString().slice(0, 10)"
      :disable-views="['years', 'year']" hide-weekends @cell-dblclick="handleCellClick" :dblclick-to-navigate="false"
      :events="events">
    </vue-cal>
    <modal :show.sync="showModal">
      <h4>Create Event</h4>
      <base-input v-model="eventTitle" type="text" label="Event Title" />
      <base-input v-model="startDate" type="datetime-local" label="Start Date" />

      <base-input v-model="endDate" type="datetime-local" label="End Date" />
      <div class="form-group">
        <label>Manager</label>
        <select v-model="manager" class="form-control dark" label="Manager">
          <option v-for="manager in managers" class="dark" :value="manager.id" :key="manager.id">
            {{ manager.firstName }} {{ manager.lastName }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Employee</label>
        <select v-model="employee" class="form-control dark" label="Employee" required>
          <option v-for="user in users" class="dark" :value="user.id" :key="user.id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>
      <!-- <base-input v-model="color" type="color" label="Color" /> -->
      <div class="d-flex justify-content-between">
        <base-button @click="createEvent" type="primary">Create</base-button>
        <base-button @click="showModal = false" type="primary">Close</base-button>
      </div>
    </modal>
  </div>
</template>
<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import axios from "axios";
import { format } from "date-fns";
export default {
  components: {
    VueCal,
  },
  data: () => ({
    managers: [],
    users: [],
    showModal: false,
    eventTitle: "",
    startDate: "",
    manager: "",
    employee: "",
    endDate: "",
    events: [],
  }),
  methods: {
    createEvent() {
      if (!this.eventTitle || !this.startDate || !this.endDate) {
        this.$notify({
          type: "danger",
          title: "Please fill all the fields",
          text: "Please fill all the fields",
        });
        return;
      }
      const payload = {
        title: this.eventTitle,
        startDate: this.startDate,
        endDate: this.endDate,
        managerId: this.manager,
        employeeId: this.employee,
      };

      axios.post("http://localhost:5143/api/Events", payload).then((res) => {
        this.$notify({
          type: "success",
          title: "Event Created Successfully!",
          text: "Event Created Successfully",
        });
        this.fetchEvents();
      });
      this.showModal = false;
    },
    addSampleEvent() {
      this.startDate = new Date().toISOString().slice(0, 16);
      this.showModal = !this.showModal;
    },
    handleCellClick(event) {
      this.eventTitle = "";
      this.startDate = new Date(event)?.toISOString().slice(0, 16);
      this.endDate = "";
      this.showModal = !this.showModal;
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    async fetchEvents() {
      await axios.get("http://localhost:5143/api/Events").then((res) => {
        res.data.map((event) => {
          console.log("event", event);
          this.events.push({
            title:
              event.title +
              " : " +
              event.employee.name +
              " with " +
              event.manager.name,
            start: format(new Date(event.startDate), "yyyy-MM-dd HH:mm"),
            end: format(new Date(event.endDate), "yyyy-MM-dd HH:mm"),
            // content: event.employee.name + " with " + event.manager.name,
            backgroundColor: this.getRandomColor(),
          });
        });
      });
      console.log("events", this.events);
    },
    fetchManagers() {
      axios
        .get(`http://localhost:5143/api/Users/filter?role=Manager`)
        .then((res) => {
          this.managers = res.data;
        });
    },
    fetchUsers() {
      axios
        .get(`http://localhost:5143/api/Users/filter?role=Employee`)
        .then((res) => {
          this.users = res.data;
        });
    },
  },
  async mounted() {
    this.fetchEvents();
    this.fetchManagers();
    this.fetchUsers();
  },
};
</script>
<style>
.vuecal__event {
  height: fit-content !important;
  background-color: #7a91eeff !important;
  color: #fff !important;
}

.vuecal__cell-events-count {
  background-color: #7a91eeff !important;
  color: #fff !important;
}
</style>
