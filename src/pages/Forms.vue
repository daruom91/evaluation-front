<template>
  <div class="forms-page">
    <card>
      <base-button @click="toggleCreateFormForm" type="primary" fill>
        Create New Form
      </base-button>
      <base-table :data="forms" :columns="columns">
        <template slot-scope="{ row }">
          <td>{{ row.index }}</td>
          <td>{{ row.name }}</td>
          <td class="td-actions text-right">
            <base-button type="link" @click="onDeleteForm(row)">
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </td>
        </template>
      </base-table>
    </card>
  </div>
</template>

<script>
import { BaseTable, BaseButton, Modal } from "@/components";
import axios from "axios";
import { format } from "date-fns";
import debounce from "lodash/debounce";
export default {
  components: {
    BaseTable,
    BaseButton,
  },
  data() {
    return {
      forms: [],
      columns: ["Id", "Name"],
    };
  },
  created() {
    this.fetchForms();
  },
  methods: {
    toggleCreateFormForm() {
      this.$router.push("/forms/create");
    },
    async onDeleteForm(form) {
      axios
        .delete(`http://localhost:5143/api/Forms/${form.id}`)
        .then((res) => {
          this.fetchForms();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async fetchForms() {
      try {
        const res = await axios.get("http://localhost:5143/api/Forms/all");
        this.forms = res.data.map((el, key) => ({
          id: el.id,
          index: key + 1,
          name: el.name,
        }));
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    },
  },
};
</script>

<style scoped>
.forms-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
