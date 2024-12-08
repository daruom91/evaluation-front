<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title">{{ isEdit ? 'Edit User' : 'Create User' }}</h4>
          <base-button type="secondary" @click="$router.push('/users')">
            <i class="tim-icons icon-minimal-left"></i>
            Back to Users
          </base-button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-6">
              <base-input
                label="First Name"
                v-model="form.firstName"
                placeholder="Enter first name"
                required
              />
            </div>
            <div class="col-md-6">
              <base-input
                label="Last Name"
                v-model="form.lastName"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <base-input
                label="Username"
                v-model="form.userName"
                placeholder="Enter username"
                required
              />
            </div>
            <div class="col-md-6">
              <base-input
                label="Email"
                type="email"
                v-model="form.email"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Role</label>
                <select class="form-control" v-model="form.role" required>
                  <option value="" disabled>Select Role</option>
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
            </div>
            <div class="col-md-6" v-if="!isEdit">
              <base-input
                label="Password"
                type="password"
                v-model="form.password"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div class="text-right">
            <base-button type="primary" native-type="submit">
              {{ isEdit ? 'Update User' : 'Create User' }}
            </base-button>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import { fetchData } from "../fetch";

export default {
  name: 'user-form',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        role: '',
        password: ''
      },
      isEdit: false
    }
  },
  async created() {
    const userId = this.$route.params.id;
    if (userId) {
      this.isEdit = true;
      await this.fetchUser(userId);
    }
  },
  methods: {
    async fetchUser(id) {
      try {
        const response = await fetchData(`Users/getbyid/${id}`, 'get');
        const userData = response.data;
        this.form = {
          ...userData,
          role: userData.roles[0],
          password: '' // Don't populate password in edit mode
        };

      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    async handleSubmit() {
      try {
        const endpoint = this.isEdit ? `Users/edit/${this.$route.params.id}` : 'Users/create';
        const method = this.isEdit ? 'put' : 'post';

        if (this.isEdit) {
          delete this.form.password;
          delete this.form.roles;
          delete this.form.id;
        }

        await fetchData(endpoint, method, this.form);
        this.$notify({
          type: 'success',
          message: 'User saved successfully',
          icon: 'tim-icons icon-check-2'
        });
        this.$router.push('/users');
      } catch (error) {
        console.error('Error saving user:', error.response);
        this.$notify({
          type: 'danger',
          message: error?.response?.data[0]?.description || 'Error saving user',
          icon: 'tim-icons icon-alert-circle-exc'
        });
      }
    }
  }
}
</script>
