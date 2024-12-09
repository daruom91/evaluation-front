<template>
  <div>
    <template v-if="userRole === 'Manager'">
      <div class="text-title">Manager stats</div>
      <div class="row">
        <div class="col-lg-3 col-md-6">
          <stats-card>
            <template slot="header">
              <div class="icon-big text-center icon-warning">
                <i class="tim-icons icon-paper text-primary"></i>
              </div>
            </template>
            <template slot="content">
              <p class="card-category">Total Campaigns</p>
              <h3 class="card-title">{{ managerStats.totalCampaigns }}</h3>
            </template>
          </stats-card>
        </div>

        <div class="col-lg-3 col-md-6">
          <stats-card>
            <template slot="header">
              <div class="icon-big text-center icon-warning">
                <i class="tim-icons icon-bullet-list-67 text-info"></i>
              </div>
            </template>
            <template slot="content">
              <p class="card-category">Total Tasks</p>
              <h3 class="card-title">{{ managerStats.totalTasks }}</h3>
            </template>
          </stats-card>
        </div>

        <div class="col-lg-3 col-md-6">
          <stats-card>
            <template slot="header">
              <div class="icon-big text-center icon-warning">
                <i class="tim-icons icon-check-2 text-success"></i>
              </div>
            </template>
            <template slot="content">
              <p class="card-category">Total Tasks On Time</p>
              <h3 class="card-title">{{ managerStats.tasksOnTime }}</h3>
            </template>
          </stats-card>
        </div>
        <div class="col-lg-3 col-md-6">
          <stats-card>
            <template slot="header">
              <div class="icon-big text-center icon-warning">
                <i class="tim-icons icon-time-alarm text-warning"></i>
              </div>
            </template>
            <template slot="content">
              <p class="card-category">Total Tasks Not Started</p>
              <h3 class="card-title">{{ managerStats.tasksNotStarted }}</h3>
            </template>
          </stats-card>
        </div>
        <div class="col-lg-3 col-md-6">
          <stats-card>
            <template slot="header">
              <div class="icon-big text-center icon-warning">
                <i class="tim-icons icon-alert-circle-exc text-danger"></i>
              </div>
            </template>
            <template slot="content">
              <p class="card-category">Total Tasks Late</p>
              <h3 class="card-title">{{ managerStats.tasksLate }}</h3>
            </template>
          </stats-card>
        </div>
      </div>
    </template>
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category">
                  {{ $t("dashboard.totalShipments") }}
                </h5>
                <h2 class="card-title">{{ $t("dashboard.performance") }}</h2>
              </div>
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle" :class="isRTL ? 'float-left' : 'float-right'"
                  data-toggle="buttons">
                  <label v-for="(option, index) in bigLineChartCategories" :key="option"
                    class="btn btn-sm btn-primary btn-simple" :class="{ active: bigLineChart.activeIndex === index }"
                    :id="index">
                    <input type="radio" @click="initBigChart(index)" name="options" autocomplete="off"
                      :checked="bigLineChart.activeIndex === index" />
                    {{ option }}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%" ref="bigChart" chart-id="big-line-chart"
              :chart-data="bigLineChart.chartData" :gradient-colors="bigLineChart.gradientColors"
              :gradient-stops="bigLineChart.gradientStops" :extra-options="bigLineChart.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 col-md-6">
        <stats-card>
          <template slot="header">
            <div class="icon-big text-center icon-warning">
              <i class="tim-icons icon-chart-pie-36 text-primary"></i>
            </div>
          </template>
          <template slot="content">
            <p class="card-category">Total Campaigns</p>
            <h3 class="card-title">{{ globalStats.totalCampaigns }}</h3>
          </template>
        </stats-card>
      </div>
      <div class="col-lg-3 col-md-6">
        <stats-card>
          <template slot="header">
            <div class="icon-big text-center icon-warning">
              <i class="tim-icons icon-atom text-info"></i>
            </div>
          </template>
          <template slot="content">
            <p class="card-category">Running Campaigns</p>
            <h3 class="card-title">{{ globalStats.runningCampaigns }}</h3>
          </template>
        </stats-card>
      </div>
      <div class="col-lg-3 col-md-6">
        <stats-card>
          <template slot="header">
            <div class="icon-big text-center icon-warning">
              <i class="tim-icons icon-send text-success"></i>
            </div>
          </template>
          <template slot="content">
            <p class="card-category">Not Started Campaigns</p>
            <h3 class="card-title">{{ globalStats.notStartedCampaigns }}</h3>
          </template>
        </stats-card>
      </div>
      <div class="col-lg-3 col-md-6">
        <stats-card>
          <template slot="header">
            <div class="icon-big text-center icon-warning">
              <i class="tim-icons icon-credit-card text-danger"></i>
            </div>
          </template>
          <template slot="content">
            <p class="card-category">Delivered on Time Campaigns</p>
            <h3 class="card-title">
              {{ globalStats.deliveredOnTimeCampaigns }}
            </h3>
          </template>
        </stats-card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 col-md-12">
        <card type="tasks" :header-classes="{ 'text-right': isRTL }">
          <template slot="header">
            <h6 class="title d-inline">
              {{ $t("dashboard.tasks", { count: objectives.length }) }}
            </h6>
          </template>
          <div class="table-full-width table-responsive">
            <task-list :objectives="objectives"></task-list>
          </div>
        </card>
      </div>
      <div class="col-lg-6 col-md-12">
        <card class="card" :header-classes="{ 'text-right': isRTL }">
          <h4 slot="header" class="card-title">
            {{ $t("dashboard.simpleTable") }}
          </h4>
          <div class="table-responsive">
            <user-table></user-table>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import LineChart from "@/components/Charts/LineChart";
// import BarChart from "@/components/Charts/BarChart";
import * as chartConfigs from "@/components/Charts/config";
import TaskList from "./Dashboard/TaskList";
import UserTable from "./Dashboard/UserTable";
import StatsCard from "@/components/Cards/StatsCard.vue";
import config from "@/config";
import { fetchData, getUser } from "../fetch";

export default {
  components: {
    LineChart,
    // BarChart,
    TaskList,
    UserTable,
    StatsCard,
  },
  data() {
    return {
      chartData: [],
      maxY: 10,
      minY: 0,
      globalStats: {},
      bigLineChart: {
        allData: [],
        activeIndex: 0,
        chartData: {
          datasets: [{}],
          labels: [
            // "JAN",
            // "FEB",
            // "MAR",
            // "APR",
            // "MAY",
            // "JUN",
            // "JUL",
            // "AUG",
            // "SEP",
            // "OCT",
            // "NOV",
            // "DEC",
          ],
        },
        chartOptions: {
          responsive: true,
        },
        extraOptions: {
          ...chartConfigs.purpleChartOptions,
          scales: {
            yAxes: [
              {
                ticks: { suggestedMin: this.minY, suggestedMax: this.maxY },
              },
            ],
          },
        },
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],

        categories: [],
      },
      // purpleLineChart: {
      //   extraOptions: chartConfigs.purpleChartOptions,
      //   chartData: {
      //     labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
      //     datasets: [
      //       {
      //         label: "Data",
      //         fill: true,
      //         borderColor: config.colors.primary,
      //         borderWidth: 2,
      //         borderDash: [],
      //         borderDashOffset: 0.0,
      //         pointBackgroundColor: config.colors.primary,
      //         pointBorderColor: "rgba(255,255,255,0)",
      //         pointHoverBackgroundColor: config.colors.primary,
      //         pointBorderWidth: 20,
      //         pointHoverRadius: 4,
      //         pointHoverBorderWidth: 15,
      //         pointRadius: 4,
      //         data: [80, 100, 70, 80, 120, 80],
      //       },
      //     ],
      //   },
      //   gradientColors: config.colors.primaryGradient,
      //   gradientStops: [1, 0.2, 0],
      // },
      // greenLineChart: {
      //   extraOptions: chartConfigs.greenChartOptions,
      //   chartData: {
      //     labels: ["JUL", "AUG", "SEP", "OCT", "NOV"],
      //     datasets: [
      //       {
      //         label: "My First dataset",
      //         fill: true,
      //         borderColor: config.colors.danger,
      //         borderWidth: 2,
      //         borderDash: [],
      //         borderDashOffset: 0.0,
      //         pointBackgroundColor: config.colors.danger,
      //         pointBorderColor: "rgba(255,255,255,0)",
      //         pointHoverBackgroundColor: config.colors.danger,
      //         pointBorderWidth: 20,
      //         pointHoverRadius: 4,
      //         pointHoverBorderWidth: 15,
      //         pointRadius: 4,
      //         data: [90, 27, 60, 12, 80],
      //       },
      //     ],
      //   },
      //   gradientColors: [
      //     "rgba(66,134,121,0.15)",
      //     "rgba(66,134,121,0.0)",
      //     "rgba(66,134,121,0)",
      //   ],
      //   gradientStops: [1, 0.4, 0],
      // },
      // blueBarChart: {
      //   extraOptions: chartConfigs.barChartOptions,
      //   chartData: {
      //     labels: ["USA", "GER", "AUS", "UK", "RO", "BR"],
      //     datasets: [
      //       {
      //         label: "Countries",
      //         fill: true,
      //         borderColor: config.colors.info,
      //         borderWidth: 2,
      //         borderDash: [],
      //         borderDashOffset: 0.0,
      //         data: [53, 20, 10, 80, 100, 45],
      //       },
      //     ],
      //   },
      //   gradientColors: config.colors.primaryGradient,
      //   gradientStops: [1, 0.4, 0],
      // },
      objectives: [],
      managerStats: {},
      userRole: "",
    };
  },
  computed: {
    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    bigLineChartCategories() {
      return this.$t("dashboard.chartCategories");
    },
  },
  methods: {
    async getManagerStats() {
      const user = getUser();
      if (user) {
        this.userRole = user.role;
        if (user.role === 'Manager') {
          const response = await fetchData(`reports/by-manager/${user.userId}`, "get");
          this.managerStats = response.data;
        }
      }

    },
    async getObjectives() {
      const response = await fetchData(`objectives`, "get");
      this.objectives = response.data;
    },
    async getGlobalStats() {
      const response = await fetchData(`reports/global`, "get");
      this.globalStats = response.data;
    },
    async initBigChart(index) {
      const type = index === 0 ? "day" : index === 1 ? "month" : "year";
      const response = await fetchData(`reports/created-per/${type}`, "get");
      this.chartData = response.data;
      this.maxY = Math.max(...response.data.map((item) => item.count));
      this.minY = Math.min(...response.data.map((item) => item.count));
      let chartData = {
        extraOptions: {
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: this.minY,
                  suggestedMax: this.maxY,
                },
              },
            ],
          },
        },
        datasets: [
          {
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: response.data.map((item) => item.count),
          },
        ],
        labels: response.data.map((item) => {
          return index === 2 ? item.date : this.moment(item.date).format("LL");
        }),
      };
      this.$refs.bigChart?.updateGradients(chartData);
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = index;
    },
  },
  mounted() {
    this.i18n = this.$i18n;
    if (this.enableRTL) {
      this.i18n.locale = "ar";
      this.$rtl.enableRTL();
    }
    this.initBigChart(0);
    this.getGlobalStats();
    this.getObjectives();
    this.getManagerStats();
  },
  beforeDestroy() {
    if (this.$rtl.isRTL) {
      this.i18n.locale = "en";
      this.$rtl.disableRTL();
    }
  },
};
</script>
<style></style>
