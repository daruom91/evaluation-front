<template>
  <div class="wrapper wrapper-full-page">
    <div class="full-page">
      <div class="content">
        <div class="container">
          <router-view></router-view>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'auth-layout',
  data() {
    return {
      year: new Date().getFullYear()
    }
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle('nav-open')
    },
    closeMenu() {
      document.body.classList.remove('nav-open')
    }
  },
  beforeDestroy() {
    this.closeMenu()
  }
}
</script>

<style lang="scss">
@import "../../assets/sass/black-dashboard/custom/variables";

.wrapper-full-page {
  min-height: 100vh;
  height: auto;

  .full-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 80px 0;
    position: relative;
    background: $card-black-background;

    .content {
      flex: 1;
      display: flex;
      align-items: center;

      .container {
        width: 100%;
      }
    }

    .footer {
      position: relative;
      padding: 24px 0;
      width: 100%;
      background: transparent;

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .nav {
        margin-bottom: 0;
        padding-left: 0;
        margin-top: 15px;
      }

      .nav-item {
        display: inline-block;

        .nav-link {
          color: $white;
          padding: 10px 15px;
          font-size: 14px;
          text-transform: uppercase;

          &:hover {
            color: $primary;
          }
        }
      }

      .copyright {
        font-size: 14px;
        text-align: center;
        margin: 15px 0;
        color: $white;

        i {
          color: $danger;
        }

        a {
          color: $primary;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

.white-content {
  .wrapper-full-page {
    .full-page {
      background: $light-bg;

      .footer {
        .nav-link {
          color: $black;

          &:hover {
            color: $primary;
          }
        }

        .copyright {
          color: $black;
        }
      }
    }
  }
}
</style>
