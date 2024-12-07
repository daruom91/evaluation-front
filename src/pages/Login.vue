<template>
  <div class="row">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img/card-primary.png" alt="" />
          <h1 class="card-title">Welcome Back!</h1>
          <p class="text-center text-muted">Please login to your account</p>
        </template>

        <div>
          <base-input
            name="email"
            v-model="model.email"
            placeholder="Email"
            addon-left-icon="tim-icons icon-email-85"
            :error="errors.email"
          >
          </base-input>

          <base-input
            name="password"
            v-model="model.password"
            type="password"
            placeholder="Password"
            addon-left-icon="tim-icons icon-lock-circle"
            :error="errors.password"
          >
          </base-input>

          <div class="form-check text-left">
            <label class="form-check-label">
              <base-checkbox v-model="model.rememberMe">
                Remember me
              </base-checkbox>
            </label>
          </div>
        </div>

        <div slot="footer">
          <base-button
            type="primary"
            size="lg"
            class="mb-3"
            block
            @click="login"
            :loading="isLoading"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </base-button>

          <div class="text-center links">
            <a href="#" class="text-muted">Forgot Password?</a>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import { fetchData } from '../fetch';

export default {
  name: 'login-page',
  data() {
    return {
      model: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {
        email: null,
        password: null
      },
      isLoading: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        email: null,
        password: null
      };

      if (!this.model.email) {
        this.errors.email = 'Email is required';
      } else if (!this.validateEmail(this.model.email)) {
        this.errors.email = 'Please enter a valid email';
      }

      if (!this.model.password) {
        this.errors.password = 'Password is required';
      }

      return !this.errors.email && !this.errors.password;
    },
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    async login() {

      console.log("on login");
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;
      const response = await fetchData('Users/login', 'post', this.model);
       console.log(response);
      if (response.status === 200) {
        this.$notify({
            type: 'success',
            message: 'Welcome back!',
            icon: 'tim-icons icon-check-2',
            verticalAlign: 'top',
            horizontalAlign: 'right'
          });
          this.$router.push('/dashboard');
          localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        this.$notify({
          type: 'danger',
          message: 'Invalid email or password',
          icon: 'tim-icons icon-alert-circle-exc',
          verticalAlign: 'top',
          horizontalAlign: 'right'
        });
      }
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/sass/black-dashboard/custom/variables";

.card-login {
  .card-header {
    padding: 30px 0 15px;
    margin-bottom: 20px;

    img {
      width: 100%;
      margin-bottom: 20px;
    }

    .card-title {
      text-align: center;
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 1.75rem;
    }
  }

  .card-body {
    padding: 20px 30px 30px;
  }

  .form-check {
    margin: 20px 0;
  }

  .links {
    margin-top: 15px;

    a {
      color: $text-muted;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s ease;

      &:hover {
        color: $primary;
      }
    }
  }

  .base-input {
    margin-bottom: 15px;

    &.has-error {
      input {
        border-color: $danger;
      }

      .error {
        color: $danger;
        font-size: 0.8rem;
        margin-top: 5px;
      }
    }
  }

  .btn {
    &.btn-primary {
      transition: all 0.2s ease;

      &:not(:disabled) {
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
        }

        &:active {
          transform: translateY(1px);
        }
      }

      &.loading {
        position: relative;
        pointer-events: none;
        opacity: 0.8;
      }
    }
  }
}
</style>
