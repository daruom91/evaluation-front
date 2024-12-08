<template>
  <div class="row">
    <div class="col-md-8">
      <edit-profile-form :model="model"> </edit-profile-form>
    </div>
    <div class="col-md-4">
      <user-card :user="user"></user-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import EditProfileForm from "./Profile/EditProfileForm";
import UserCard from "./Profile/UserCard";

export default {
  components: {
    EditProfileForm,
    UserCard,
  },
  data() {
    return {
      model: null,
      user: null,
    };
  },
  created() {
    this.getUser().then((userData) => {
      this.user = userData;

      this.model = {
        id: this.user.id,
        username: this.user.firstName + " " + this.user.lastName,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
      };
    });
  },
  methods: {
    currentUser() {
      return JSON.parse(localStorage.getItem("user"));
    },
    getUser() {
      return axios
        .get(
          "http://localhost:5143/api/Users/getbyid/" + this.currentUser().userId
        )
        .then((res) => {
          return {
            fullName: res.data.firstName + " " + res.data.lastName,
            id: res.data.id,
            email: res.data.email,
            lastName: res.data.lastName,
            firstName: res.data.firstName,
            title: this.currentUser().role,
            description: "",
          };
        });
    },
  },
};
</script>

<style></style>
