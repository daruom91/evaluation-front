<!-- eslint-disable vue/no-mutating-props -->
<template>
  <card>
    <h5 slot="header" class="title">Edit Profile</h5>
    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="Name" v-model="model.username" placeholder="Name">
        </base-input>
      </div>
      <div class="col-md-6 pl-md-1">
        <base-input label="Email" v-model="model.email" placeholder="Email">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input
          label="First Name"
          v-model="model.firstName"
          placeholder="First Name"
        >
        </base-input>
      </div>
      <div class="col-md-6 pl-md-1">
        <base-input
          label="Last Name"
          v-model="model.lastName"
          placeholder="Last Name"
        >
        </base-input>
      </div>
    </div>
    <base-button slot="footer" @click="save" type="primary" fill
      >Save</base-button
    >
  </card>
</template>
<script>
import axios from "axios";
export default {
  props: {
    model: {
      type: Object,
      default: () => {
        return {
          id: null,
          username: "",
          email: "",
          firstName: "",
          lastName: "",
        };
      },
    },
  },
  methods: {
    currentUser() {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    },
    save() {
      const user = this.currentUser();
      if (user) {
        axios
          .put(`http://localhost:5143/api/Users/edit/${user.userId}`, {
            firstName: this.model.firstName,
            lastName: this.model.lastName,
            email: this.model.email,
            role: user.role,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error("Error saving user:", err);
          });
      } else {
        console.error("No user found in local storage.");
      }
    },
  },
};
</script>
<style></style>
