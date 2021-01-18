<template>
  <div class="otc-premium-wrap">
    <Empty v-if="storeLoadEnd && !dataArr.length" />

    <div
      v-else-if="dataArr.length === 0"
      class="loading-box"
    >
      <Loading color="#36d58f" />
    </div>

    <div v-else>
      <div
        v-for="info in dataArr"
        :key="info.symbol"
        class="coin-item"
      >
        <div class="coin-box">
          <div class="coin-info flex-left-right">
            <div class="flex">
              <div 
                v-if="getIconUrl(info.symbol)" 
                class="coin-icon"
              >
                <img 
                  :src="getIconUrl(info.symbol)" 
                  width="28"
                >
              </div>
              <div class="coin-name">
                <b>{{ info.symbol }}</b>
                <div class="tips lightGrayText">
                  {{ info.tips }}
                </div>
              </div>
            </div>
            <b class="time din">
              {{
                crosshairPos.symbol === info.symbol
                  ? crosshairPos.time
                  : info.latestData.time
              }}
            </b>
          </div>

          <ul class="price-box">
            <li>
              <span class="dot otc" />
              <b>场外：</b>
              {{
                `${info.unit}${
                  crosshairPos.symbol === info.symbol
                    ? crosshairPos.otc
                    : info.latestData.otc
                }`
              }}
            </li>
            <li>
              <span class="dot ite" />
              <b>场内：</b>
              {{
                `${info.unit}${
                  crosshairPos.symbol === info.symbol
                    ? crosshairPos.ite
                    : info.latestData.ite
                }`
              }}
            </li>
            <li>
              <span class="dot rate" />
              <b>溢价：</b>
              {{
                crosshairPos.symbol === info.symbol
                  ? crosshairPos.rate
                  : info.latestData.rate
              }}%
            </li>
          </ul>
        </div>

        <div 
          class="chart-box"
          @touchstart="(ev)=>initCrossHair(info, ev)"
          @touchmove="(ev)=>moveCrossHair(info, ev)"
          @touchend="hideCrossHair"
        >
          <!-- line chart -->
          <svg
            :width="chartWidth"
            :height="chartHeight + 15"
            class="line-chart"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                :id="`ite-fill-color-${info.symbol}`"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stop-opacity="0.5"
                  :style="`stop-color: ${chartColor['ite']};`"
                />
                <stop
                  offset="100%"
                  stop-opacity="0"
                  :style="`stop-color: ${chartColor['ite']};`"
                />
              </linearGradient>
              <linearGradient
                :id="`otc-fill-color-${info.symbol}`"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stop-opacity="0.5"
                  :style="`stop-color: ${chartColor['otc']};`"
                />
                <stop
                  offset="100%"
                  stop-opacity="0"
                  :style="`stop-color: ${chartColor['otc']};`"
                />
              </linearGradient>
            </defs>

            <!-- y tick -->
            <g transform="translate(0,15)">
              <g
                v-for="(tick, lineIndex) in info.lineAxisY"
                :key="tick"
                :transform="`translate(0,${lineIndex * chartHeight / 2})`"
              >
                <g
                  font-size="8px"
                  fill-opacity="0.5"
                >
                  <text
                    :x="chartWidth - 5"
                    y="-2"
                    text-anchor="end"
                  >
                    {{ tick }}
                  </text>
                </g>
                <g
                  stroke="#f1f1f1"
                  stroke-opacity="1"
                  stroke-dasharray="2"
                >
                  <path :d="`M0,0L${chartWidth},0`" />
                </g>
              </g>
            </g>
            <!-- 2 line chart -->
            <g transform="translate(0,15)">
              <g class="series">
                <path
                  class="line"
                  fill="none"
                  :stroke="chartColor['otc']"
                  stroke-width="1"
                  :d="info.otcLine"
                />
                <path
                  class="area"
                  :fill="`url(#otc-fill-color-${info.symbol})`"
                  :d="info.otcArea"
                />
              </g>
              <g class="series">
                <path
                  class="line"
                  fill="none"
                  :stroke="chartColor['ite']"
                  stroke-width="1"
                  :d="info.iteLine"
                />
                <path
                  class="area"
                  :fill="`url(#ite-fill-color-${info.symbol})`"
                  :d="info.iteArea"
                />
              </g>
            </g>

            <!-- cross hair -->
            <g v-if="crosshairPos.symbol === info.symbol">
              <g transform="translate(0, 6)">
                <text
                  text-anchor="middle"
                  fill="#999"
                  :x="crosshairPos.x"
                  style="font-size: 8px;"
                >
                  {{ crosshairPos.time }}
                </text>
              </g>
              <line
                :x1="crosshairPos.x"
                :y1="10"
                :x2="crosshairPos.x"
                :y2="chartHeight + 15"
                stroke-width="1"
                stroke="#bbb"
              />
            </g>
          </svg>

          <!-- bar chart -->
          <svg
            :width="chartWidth"
            :height="chartBarHeight + 30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- y tick -->
            <g transform="translate(0,10)">
              <g
                v-for="(tick, barIndex) in info.barAxisY"
                :key="tick"
                :transform="`translate(0,${barIndex * chartBarHeight / 2})`"
              >
                <g
                  font-size="8px"
                  fill-opacity="0.5"
                >
                  <text
                    :x="chartWidth - 5"
                    y="-2"
                    text-anchor="end"
                  >
                    {{ tick }}
                  </text>
                </g>
                <g
                  stroke="#f1f1f1"
                  stroke-opacity="1"
                  stroke-dasharray="2"
                >
                  <path :d="`M0,0L${chartWidth},0`" />
                </g>
              </g>
            </g>
            <!-- time range -->
            <g
              font-size="8px"
              fill-opacity="0.5"
              transform="translate(0, -28)"
            >            
              <g
                v-for="tick in info.timeRange"
                :key="tick.x"
                :transform="`translate(${tick.x},${chartHeight + 20})`"
              >
                <text
                  :text-anchor="tick.textAnchor"
                  x="0"
                  y="16"
                >
                  {{ tick.time }}
                </text>
              </g>
            </g>
            <!-- bar chart -->
            <g transform="translate(0,10)">
              <g
                v-for="rate in info.rateBarData"
                :key="rate.barX"
              >
                <g :transform="`translate(${rate.barX}, ${rate.barY})`">
                  <rect
                    :width="info.barStepX"
                    :height="rate.barHeight"
                    stroke="#9362FF"
                    fill="#9362FF"
                    fill-opacity="0.4"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Empty, Loading } from "components"

const CHART_WIDTH = window.innerWidth - 20
const CHART_HEIGHT = 120
const BAR_HEIGHT = 100
const CHART_COLOR = {
  ite: "#FF8900",
  otc: "#00B4FF",
  rate: "#9362FF"
}

export default {
  components: {
    Loading,
    Empty
  },
  data() {
    return {
      type: "otcPremium",
      loading: false,
      intervalRanking: null,
      chartWidth: CHART_WIDTH,
      chartHeight: CHART_HEIGHT,
      chartBarHeight: BAR_HEIGHT,
      dataArr: [],
      crosshairPos: {}
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    storeAllRanking() {
      return DI.get("store").state.ranking.ranking
    },
    storeOTCPremium() {
      return this.type && this.storeAllRanking[this.type] ? this.storeAllRanking[this.type] : []
    },
    storeLoadEnd() {
      const loadEndFlag = DI.get("store").state.ranking.loadEndFlag
      return loadEndFlag && loadEndFlag[this.type]
        ? loadEndFlag[this.type]
        : false
    },
    chartColor() {
      return CHART_COLOR
    }
  },
  watch: {
    storeOTCPremium: {
      immediate: true,
      handler(val) {
        if(val && val.length) {
          this.processData()
        }
      }
    }
  },
  mounted() {
    this.initOtcPremium()
    this.intervalRanking = setInterval(() => {
      this.initOtcPremium()
    }, 1000 * 10)
  },
  beforeDestroy() {
    clearInterval(this.intervalRanking)
  },
  methods: {
    initOtcPremium() {
      DI.get("store").dispatch("SYNC_RANKING_PAIR", { type: this.type })
    },
    getIconUrl(target) {
      return this.biInfo && this.biInfo[target] && !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get('BI_LOCAL_ICON')[target]
    },
    processSymbolData(otcData) {
      const items = otcData.items
      if (!otcData || !items || !items.length) {
        return
      }
      const len = items.length
      const lineStepX = DI.get("filters").cutNumber(CHART_WIDTH / (len - 1))
      const barStepX = DI.get("filters").cutNumber(CHART_WIDTH / len)
      let newItems = []

      // Note: ite场内价格, otc场外价格, rate表示溢价百分比
      // get max min
      let iteArr = []
      let otcArr = []
      let rateArr = []
      let timeRange = [{ time: '过去一个月溢价', x: CHART_WIDTH / 2, textAnchor: "middle" }]
      let maxLinePoint = 0, minLinePoint = 0
      let maxRatePoint = 0
      let latestData

      for (let i = 0; i < len; i++) {
        const { ite, otc, rate, time } = items[i]
        iteArr.push(ite)
        otcArr.push(otc)
        rateArr.push(rate)
        const formatTime = this.$dayjs(time).format("MM/DD")

        if (i === len - 1) {
          latestData = { ite, otc, rate, time: formatTime }
          timeRange.push({ time: formatTime, x: CHART_WIDTH - 5, textAnchor: "end" })
        }
        if (i === 0) {
          timeRange.push({ time: formatTime, x: 5, textAnchor: "start" })
        }
        newItems.push({ ...items[i], time: formatTime })

        if (Math.abs(rate) > maxRatePoint) {
          maxRatePoint = Math.abs(rate)
        }
        if (maxLinePoint === 0 || maxLinePoint < ite || maxLinePoint < otc) {
          maxLinePoint = Math.max(ite, otc)
        }
        if (minLinePoint === 0 || minLinePoint > ite || minLinePoint > otc) {
          minLinePoint = Math.min(ite, otc)
        }
      }

      // get line path & bar data
      let iteLine = "M0,"
      let otcLine = "M0,"
      let lastCurX = CHART_WIDTH
      let rateBarData = []
      const positionMap = new Map()

      for (let i = 0; i < len; i++) {
        // calculate lineto xy
        const curX = Math.floor(lineStepX * i)
        const iteCurY = DI.get("filters").cutNumber(
          ((maxLinePoint - iteArr[i]) * CHART_HEIGHT) / (maxLinePoint - minLinePoint),
          6
        )
        const otcCurY = DI.get("filters").cutNumber(
          ((maxLinePoint - otcArr[i]) * CHART_HEIGHT) / (maxLinePoint - minLinePoint),
          6
        )
        if (i === 0) {
          iteLine += iteCurY
          otcLine += otcCurY
        } else {
          iteLine += `L${curX},${iteCurY}`
          otcLine += `L${curX},${otcCurY}`
        }

        if (i === len - 1) {
          lastCurX = curX
        }

        // calculate bar xy&height
        const barX = barStepX * i
        const rate = rateArr[i]
        const barChartHalfHeight = BAR_HEIGHT / 2
        const barHeight = DI.get("filters").cutNumber(Math.abs(rate) / maxRatePoint * barChartHalfHeight, 6)
        const barY = rate > 0 ? barChartHalfHeight - barHeight : barChartHalfHeight
        rateBarData.push({ barX, barY, barHeight })

        // generate position map
        positionMap.set(curX, i)
      }

      return {
        ...otcData,
        newItems,
        iteLine,
        iteArea: `${iteLine}L${lastCurX},${CHART_HEIGHT}L0,${CHART_HEIGHT}`,
        otcLine,
        otcArea: `${otcLine}L${lastCurX},${CHART_HEIGHT}L0,${CHART_HEIGHT}`,
        lineAxisY: [
          DI.get("filters").cutNumber(maxLinePoint, 2),
          DI.get("filters").cutNumber((maxLinePoint + minLinePoint) / 2, 2),
          DI.get("filters").cutNumber(minLinePoint, 2)
        ],
        barStepX,
        rateBarData,
        barAxisY: [`${maxRatePoint}%`, "0%", `-${maxRatePoint}%`],
        timeRange,
        latestData,
        positionMap
      }
    },
    processData() {
      if (!this.storeOTCPremium || !this.storeOTCPremium.length) {
        return
      }
      this.dataArr = []
      this.storeOTCPremium.forEach((otcData) => {
        this.dataArr.push(this.processSymbolData(otcData))
      })
      // console.log("processData dataArr: ", this.dataArr) // eslint-disable-line no-console
    },
    initCrossHair(info, ev) {
      const pageX = Math.round(ev.touches[0].pageX - 5)
      this.touchStartX = pageX
      if (info.positionMap.has(pageX)) {
        const index = info.positionMap.get(pageX)
        this.crosshairPos = { ...info.newItems[index], x: pageX, symbol: info.symbol }
      }
    },
    moveCrossHair(info, ev) {
      const pageX = Math.round(ev.touches[0].pageX - 5)
      if (Math.abs(pageX - this.touchStartX) > 50) {
        ev.preventDefault()
      }
      if (info.positionMap.has(pageX)) {
        const index = info.positionMap.get(pageX)
        this.crosshairPos = { ...info.newItems[index], x: pageX, symbol: info.symbol }
      }
    },
    hideCrossHair() {
      this.crosshairPos = {}
    }
  }
}
</script>

<style lang="less" scoped>
.otc-premium-wrap {
  .loading-box {
    padding: 100px 0;
    text-align: center;
  }

  .coin-item {
    background-color: #fff;
    margin-bottom: 10px;
  }

  .coin-box {
    padding: 20px;
  }
  .coin-icon {
    width: 28px;
    height: 28px;
    overflow: hidden;
    margin-right: 10px;
  }

  .coin-name {
    .tips {
      font-size: 10px;
    }
  }
  .time {
    font-weight: bold;
  }
  .price-box {
    margin-top: 20px;
    font-size: 12px;
    line-height: 22px;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 50%;
      display: flex;
      align-items: center;
    }
    .dot {
      width: 6px;
      height: 6px;
      margin-right: 6px;
      &.ite {
        background-color: #FF8900;
      }
      &.otc {
        background-color: #00B4FF;
      }
      &.rate {
        background-color: #9362FF;
      }
    }
  }
  .chart-box {
    padding-bottom: 20px;
    .line-chart {
      margin-bottom: 20px;
    }
  }
}
</style>
