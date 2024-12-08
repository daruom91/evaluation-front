<template>
  <div class="event-calendar">
    <base-button @click="addSampleEvent" type="primary" class="mb-3">
      Add One To One
    </base-button>

    <vue-cal
      style="height: 100vh"
      :time-from="9 * 60"
      :time-to="18 * 60"
      :disable-views="['years', 'year']"
      hide-weekends
      active-view="month"
      events-count-on-year-view
      small
      @cell-dblclick="handleCellClick"
      :dblclick-to-navigate="false"
      :events="events"
    >
      <template #event-color="event">
        <span :style="{ backgroundColor: event.color }">{{ event.title }}</span>
      </template>
    </vue-cal>
    <modal :show.sync="showModal">
      <h4>Create Event</h4>
      <base-input v-model="eventTitle" type="text" label="Event Title" />
      <base-input
        v-model="startDate"
        type="datetime-local"
        label="Start Date"
      />

      <base-input v-model="endDate" type="datetime-local" label="End Date" />
      <div class="form-group">
        <label>Manager</label>
        <select v-model="manager" class="form-control dark" label="Manager">
          <option
            v-for="manager in managers"
            :value="manager.id"
            :key="manager.id"
          >
            {{ manager.firstName }} {{ manager.lastName }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Employee</label>
        <select
          v-model="employee"
          class="form-control dark"
          label="Employee"
          required
        >
          <option v-for="user in users" :value="user.id" :key="user.id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>
      <!-- <base-input v-model="color" type="color" label="Color" /> -->
      <div class="d-flex justify-content-between">
        <base-button @click="createEvent" type="primary">Create</base-button>
        <base-button @click="showModal = false" type="primary"
          >Close</base-button
        >
      </div>
    </modal>
  </div>
</template>
<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
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
        start: this.startDate,
        end: this.endDate,
        manager: this.manager,
        employee: this.employee,
      };
      console.log(payload);
      this.events.push(payload);
      this.showModal = false;
    },
    addSampleEvent() {
      this.startDate = new Date().toISOString().slice(0, 16);
      this.showModal = !this.showModal;
    },
    handleCellClick(event) {
      this.eventTitle = "";
      this.startDate = new Date(event).toISOString().slice(0, 16);
      this.endDate = "";
      this.showModal = !this.showModal;
    },
    fetchEvents() {
      axios.get("http://localhost:5143/api/Events").then((res) => {
        this.events = res.data;
      });
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
};
</script>
