<template>
  <div
    class="wallet-pie-chart"
    :class="{special: !originalMode, original: originalMode}"
  >
    <div id="chart">
      <apexchart
        type="donut"
        width="80%"
        height="220"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script>
import { DI } from "core"
import VueApexCharts from "vue-apexcharts"

export default {
  components: {
    apexchart: VueApexCharts
  },
  props: {
    originalMode: { // false 的时候 小额会归类到其他
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '持仓分布'
    },
    balance: {
      type: Object,
      default: null
    },
    labels: {
      type: Array,
      default: null
    },
    total: {
      type: [String, Number],
      default: ""
    },
    animation: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      series: [],
      chartOptions: {
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        states: {
          normal: {
            filter: {
              type: "none",
              value: 0
            }
          },
          hover: {
            filter: {
              type: "none",
              value: 0
            }
          },
          active: {
            filter: {
              type: "none",
              value: 0
            }
          }
        },
        plotOptions: {
          pie: {
            expandOnClick: true,
            offsetY: 10,
            donut: {
              labels: {
                show: true,
                name: {
                  fontSize: 12,
                  fontFamily: "Helvetica, Arial, sans-serif",
                  offsetX: 0,
                  offsetY: 0
                },
                value: {
                  fontSize: 14,
                  offsetX: 0,
                  offsetY: -1,
                  fontFamily: "DINPro-Number",
                  formatter: function(val) {
                    return val + "%"
                  }
                },
                total: {
                  show: true,
                  label: this.title,
                  color: "#373d3f",
                  formatter: function() {
                    return ""
                  }
                }
              }
            }
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                animations: {
                  enabled: this.animation
                },
                width: "100%",
                offsetY: -10,
                dropShadow: {
                  enabled: false
                }
              },
              tooltip: {
                enabled: false
              },
              legend: {
                show: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: true,
                fontSize: "12px",
                fontFamily: "Helvetica, Arial",
                width: "100%",
                height: "28px",
                formatter: function(seriesName, opts) {
                  return [
                    seriesName,
                    `      ${opts.w.globals.series[opts.seriesIndex]}%`
                  ]
                },
                offsetX: -20,
                offsetY: -30,
                labels: {
                  useSeriesColors: true
                },
                markers: {
                  width: 7,
                  height: 7,
                  radius: 0
                },
                itemMargin: {
                  horizontal: 5,
                  vertical: 5
                },
                onItemClick: {
                  toggleDataSeries: false
                },
                onItemHover: {
                  highlightDataSeries: false
                }
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    }
  },
  watch: {
    biInfo: {
      immediate: true,
      deep: true,
      handler() {
        this.updateChartData()
      }
    }
  },
  methods: {
    updateChartData() {
      if (!Object.keys(this.biInfo).length) {
        return
      }
      const percents = []
      const labels = []
      // const colors = []

      if (this.originalMode) {
        for (let i = 0; i < this.labels.length; i++) {
          const currency = this.labels[i]
          const curVal = Math.round((this.balance[currency] / this.total) * 100)

          percents.push(curVal)
          labels.push(currency)
        // colors.push(this.biInfo[currency]["color"])
        }
      } else {
        for (let i = 0; i < this.labels.length; i++) {
          const currency = this.labels[i]
          let curVal = Math.round((this.balance[currency] / this.total) * 100)
          if (curVal < 1 || i > 6) {
            curVal = 100 - percents.reduce((acc, cur) => acc + cur)
            percents.push(curVal)
            labels.push("其他")
            // colors.push("#989898")
            break
          }

          percents.push(curVal)
          labels.push(currency)
        // colors.push(this.biInfo[currency]["color"])
        }
      }

      this.series = percents
      this.chartOptions.labels = labels
      // this.chartOptions.colors = colors
    }
  }
}
</script>

<style scoped lang="less">
.wallet-pie-chart {
  padding: 20px 20px 0;
  max-height: 400px;

  .chart-title {
    position: absolute;
    width: 50px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    left: 50%;
    top: 22%;
    margin-left: -25px;
    z-index: 5;
  }
}
</style>
<style>
.apexcharts-canvas {
  margin: 0 auto;
}
.apexcharts-legend {
  justify-content: space-between !important;
  flex-wrap: wrap;
  padding: 0 !important;
}
.original .apexcharts-legend {
  align-content: flex-start;
  align-items: flex-start;
  top: 185px !important;
  height: 100%;
}
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .special .apexcharts-legend {
    align-content: flex-start;
    align-items: flex-start;
    top: 185px !important;
    max-height: 160px;
    min-height: 40px;
    overflow-y: auto;
  }
}
.apexcharts-legend-series {
  background-color: #fafafa;
  height: 20px;
  line-height: 28px;
  border-radius: 2px;
  width: 37%;
  margin: 5px 0;
  padding: 0 10px;
  font-size: 12px;
  opacity: .9;
}
</style>

