<template>
  <card>
    <div>
      <h1>View Form</h1>
    </div>
    <base-table :data="forms" :key="forms.length" :columns="columns">
      <template slot-scope="{ row }">
        <tr>
          <td>{{ row.index }}</td>
          <td>{{ row.formName }}</td>
          <td>{{ row.userName }}</td>
          <td>{{ row.managerName }}</td>
          <td>{{ row.rowFieldValues }}</td>
        </tr>
      </template>
    </base-table>
  </card>
</template>
<script>
import axios from "axios";
import { BaseTable } from "@/components";
export default {
  name: "ViewForm",
  components: {
    BaseTable,
  },
  data() {
    return {
      userId: JSON.parse(localStorage.getItem("user")).userId,
      forms: [],
      columns: ["Index", "Form Name", "User Name", "Manager Name", "Responses"],
    };
  },
  methods: {
    getForm() {
      axios
        .get(`http://localhost:5143/api/Forms/form-submissions`)
        .then((res) => {
          this.forms = res.data
            .map((el, index) => {
              let fieldValues = Object.keys(el.fieldValues)
                .map((key) => `${key}: ${el.fieldValues[key]}`)
                .join(` , `);
              return {
                ...el,
                rowFieldValues: fieldValues,
                index: index + 1,
              };
            })
            .filter((el) => el.userId === this.userId);
          console.log(this.forms);
        });
    },
  },
  mounted() {
    this.getForm();
  },
};
</script>
