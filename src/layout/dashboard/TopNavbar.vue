<template>
  <nav
    class="navbar navbar-expand-lg navbar-absolute"
    :class="{
      'bg-white': isLightMode,
      'navbar-transparent': !isLightMode,
    }"
  >
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div
          class="navbar-toggle d-inline"
          :class="{ toggled: $sidebar.showSidebar }"
        >
          <button
            type="button"
            class="navbar-toggler"
            aria-label="Navbar toggle button"
            @click="toggleSidebar"
          >
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <a class="navbar-brand" href="#pablo">{{ routeName }}</a>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        data-toggle="collapse"
        data-target="#navigation"
        aria-controls="navigation-index"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
            <li class="nav-item d-flex align-items-center">
              <div class="mode-switch">
                <input
                  class="mode-switch-input"
                  type="checkbox"
                  id="modeSwitch"
                  @change="toggleMode"
                  :checked="isLightMode"
                />
                <label class="mode-switch-label" for="modeSwitch">
                  <i
                    class="tim-icons icon-sun-55 mode-switch-icon mode-switch-icon--sun"
                  ></i>
                  <i
                    class="tim-icons icon-moon-61 mode-switch-icon mode-switch-icon--moon"
                  ></i>
                  <span class="mode-switch-ball"></span>
                </label>
              </div>
            </li>
            <div
              class="search-bar input-group"
              @click="searchModalVisible = true"
            >
              <!-- <input type="text" class="form-control" placeholder="Search...">
              <div class="input-group-addon"><i class="tim-icons icon-zoom-split"></i></div> -->
              <button
                class="btn btn-link"
                id="search-button"
                data-toggle="modal"
                data-target="#searchModal"
              >
                <i class="tim-icons icon-zoom-split"></i>
              </button>
              <!-- You can choose types of search input -->
            </div>
            <modal
              :show.sync="searchModalVisible"
              class="modal-search"
              id="searchModal"
              :centered="false"
              :show-close="true"
            >
              <input
                slot="header"
                v-model="searchQuery"
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="SEARCH"
              />
            </modal>
            <base-dropdown
              tag="li"
              :menu-on-right="!$rtl.isRTL"
              title-tag="a"
              class="nav-item"
            >
              <a
                slot="title"
                href="#"
                class="dropdown-toggle nav-link"
                data-toggle="dropdown"
                aria-expanded="true"
              >
                <i class="tim-icons icon-sound-wave"></i>
                <p class="d-lg-none">New Notifications</p>
              </a>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item"
                  >Mike John responded to your email</a
                >
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item"
                  >You have 5 more tasks</a
                >
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item"
                  >Your friend Michael is in town</a
                >
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item"
                  >Another notification</a
                >
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Another one</a>
              </li>
            </base-dropdown>
            <base-dropdown
              tag="li"
              :menu-on-right="!$rtl.isRTL"
              title-tag="a"
              class="nav-item"
              menu-classes="dropdown-navbar"
            >
              <a
                slot="title"
                href="#"
                class="dropdown-toggle nav-link"
                data-toggle="dropdown"
                aria-expanded="true"
              >
                <div class="photo">
                  <img src="img/anime3.png" alt="Profile" />
                </div>
                <p class="d-lg-none">Log out</p>
              </a>
              <li class="nav-link">
                <router-link to="/profile" class="nav-item dropdown-item"
                  >Profile</router-link
                >
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Settings</a>
              </li>
              <div class="dropdown-divider"></div>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item" @click.prevent="logout">Log out</a>
              </li>
            </base-dropdown>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import Modal from "@/components/Modal";

export default {
  components: {
    CollapseTransition,
    Modal,
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    isLightMode() {
      return document.body.classList.contains("white-content");
    },
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
    };
  },
  mounted() {
    if (localStorage.getItem("mode") === "light") {
      document.body.classList.add("white-content");
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    toggleMode() {
      document.body.classList.toggle("white-content");
      localStorage.setItem(
        "mode",
        document.body.classList.contains("white-content") ? "light" : "dark"
      );
    },
    logout() {
      this.$router.push('/auth/login');
      localStorage.removeItem('user');
    }
  },
};
</script>
<style lang="scss">
@import "@/assets/sass/black-dashboard/custom/variables";

.navbar {
  &.navbar-transparent {
    background: rgba($black, 0.95) !important;
    backdrop-filter: blur(10px);

    .navbar-brand,
    .nav-link,
    .navbar-text,
    .dropdown-item,
    .tim-icons {
      color: $white !important;
    }

    .navbar-toggler-bar {
      background: $white !important;
    }
  }

  &.bg-white {
    .navbar-brand,
    .nav-link,
    .navbar-text,
    .dropdown-item,
    .tim-icons {
      color: $black !important;
    }

    .navbar-toggler-bar {
      background: $black !important;
    }

    .notification {
      border-color: $danger;
    }
  }

  .navbar-collapse {
    &.show {
      background: inherit;
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 10px;

      .nav-link,
      .dropdown-item {
        color: inherit !important;
      }
    }
  }
}

.mode-switch {
  position: relative;
  margin-right: 1rem;

  &-input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;

    &:checked + .mode-switch-label {
      background: rgba($info, 0.2);

      .mode-switch-ball {
        transform: translateX(24px);
      }

      .mode-switch-icon--sun {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }

      .mode-switch-icon--moon {
        opacity: 0;
        transform: translateY(-50%) scale(0.4);
      }
    }
  }

  &-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 50px;
    height: 26px;
    background: rgba($dark-gray, 0.2);
    border-radius: 50px;
    position: relative;
    transition: background-color 0.3s ease;
    padding: 5px;
  }

  &-ball {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transition: transform 0.3s ease;
    background: $white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  &-icon {
    position: absolute;
    top: 50%;
    z-index: 2;
    transition: all 0.3s ease;
    font-size: 12px;
    line-height: 0;

    &--sun {
      right: 6px;
      transform: translateY(-50%) scale(0.4);
      opacity: 0;
      color: $warning;
    }

    &--moon {
      left: 6px;
      transform: translateY(-50%) scale(1);
      opacity: 1;
      color: $white;
    }
  }
}

// Keep existing transitions
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar,
.card,
.sidebar {
  transition: all 0.3s ease !important;
}
</style>
