<template>
  <div class="event-calendar">
    <base-button @click="addSampleEvent" type="primary" class="mb-3">
      Add One To One
    </base-button>

    <vue-cal
      selected-date="2018-11-19"
      :time-from="9 * 60"
      :time-to="23 * 60"
      :disable-views="['years', 'year', 'month']"
      hide-weekends
      :events="events"
    >
    </vue-cal>
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
    events: [
      {
        start: format(new Date(), "yyyy-mm-dd 10:00"),
        end: format(new Date(), "yyyy-mm-dd 12:00"),
        title: "Doctor appointment",
        content: '<i class="icon material-icons">local_hospital</i>',
        class: "health",
      },
    ],
  }),
  methods: {
    addSampleEvent() {
      console.log("aaaaa");
    },
  },
};
</script>
