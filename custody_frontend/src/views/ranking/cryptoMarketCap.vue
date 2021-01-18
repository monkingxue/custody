<template>
  <div class="crypto-market-cap-wrap">
    <div
      v-if="!btcCapPercent"
      class="chart-wrap loading-box"
    >
      <Loading color="#36d58f" />
    </div>
    <!-- chart pie box -->
    <div 
      v-else 
      class="chart-wrap chart-pie-wrap"
    >
      <div class="chart-pie-box">
        <div class="num-ratio">
          <img 
            src="../../assets/images/rank/coin-btc.png" 
            width="41"
          >
          <span class="din">${{ shorthandMoney(storeCryptoMarketCap.btc_supply_usd) }}</span>
          比特币市值
        </div>
        <div class="chart-pie">
          <svg 
            viewBox="0 0 32 32" 
            class="svg-chart"
          >
            <circle 
              class="pie"
              cx="16" 
              cy="16" 
              r="16"
              :stroke-dasharray="`${othersCapPercent} 100`"
            />
            <g class="text-box">
              <text
                text-anchor="middle"
                x="9"
                :y="btcCapPercent > 50 ? -11 : -18"
                class="text din"
                fill="#fff"
                :style="`font-size: ${btcCapPercent > 50 ? '7px' : '5px'}; font-weight: bold;`"
              >
                {{ btcCapPercent }}%
              </text>
            </g>
            <g class="text-box">
              <text 
                text-anchor="middle" 
                x="23"
                :y="othersCapPercent > 50 ? -11 : -18"
                class="text din"
                fill="#fff"
                :style="`font-size: ${othersCapPercent > 50 ? '7px' : '5px'}; font-weight: bold;`"
              >
                {{ othersCapPercent }}%
              </text>
            </g>
          </svg>
        </div>
        <div class="num-ratio">
          <img 
            src="../../assets/images/rank/coin-other.png" 
            width="56"
          >
          <span class="din">${{ shorthandMoney(storeCryptoMarketCap.others_supply_usd) }}</span>
          其他币种市值
        </div>
      </div>
      <div class="line-bottom">
        <div class="num-ratio">
          <span class="din">${{ shorthandMoney(storeCryptoMarketCap.total_supply_usd) }}</span>
          加密货币总市值
        </div>
      </div>
    </div>

    <!-- chart line box -->
    <div class="chart-wrap">
      <div class="title-line">
        <h4>历史占比</h4>
      </div>

      <!-- line chart -->
      <div
        v-if="!lineChartLoaded && cryptoDominancePeriod.length === 0"
        class="chart-line-box loading-box"
      >
        <Loading color="#36d58f" />
      </div>
      <div 
        v-else 
        class="chart-line-box"
        @touchstart="initCrossHair"
        @touchmove="moveCrossHair"
        @touchend="hideCrossHair"
      >
        <svg
          :width="chartWidth"
          :height="chartHeight + 50"
          class="line-chart"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="btc-fill-color"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-opacity="0.5"
                :style="`stop-color: #FF8900;`"
              />
              <stop
                offset="100%"
                stop-opacity="0"
                :style="`stop-color: #FF8900;`"
              />
            </linearGradient>
          </defs>

          <!-- y tick -->
          <g transform="translate(0,25)">
            <g
              v-for="(tick, lineIndex) in lineAxisY"
              :key="tick + lineIndex"
              :transform="`translate(0,${lineIndex * chartHeight / 2})`"
            >
              <g
                stroke="#f1f1f1"
                stroke-opacity="1"
                stroke-dasharray="2"
              >
                <path :d="`M0,0L${chartWidth},0`" />
              </g>
              <g
                font-size="8px"
                fill-opacity="0.5"
              >
                <text
                  :x="chartWidth - 5"
                  :y="4"
                  text-anchor="end"
                >
                  {{ tick }}
                </text>
              </g>
            </g>
          </g>
          <!-- line chart -->
          <g transform="translate(0,25)">
            <g class="series">
              <path
                class="line"
                fill="none"
                stroke="#FF8900"
                stroke-width="1"
                :d="linePath"
              />
              <path
                class="area"
                :fill="`url(#btc-fill-color)`"
                :d="lineArea"
              />
            </g>
          </g>
          <!-- time range -->
          <g
            font-size="8px"
            fill-opacity="0.5"
          >            
            <g
              v-for="(tick, index) in timeRange"
              :key="tick.x + index"
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
          <!-- cross hair -->
          <g v-if="crosshairPos.time">
            <g transform="translate(0, 30)">
              <text
                text-anchor="middle"
                fill="#999"
                :x="tooltipX"
                :y="-20"
                style="font-size: 9px;"
              >
                {{ crosshairPos.time }}
              </text>
              <text
                text-anchor="middle"
                fill="#999"
                :x="tooltipX"
                :y="-8"
                style="font-size: 9px;"
              >
                Bitcoin: {{ crosshairPos.percent }}%
              </text>
            </g>
            <g>
              <line
                :x1="crosshairPos.x"
                :y1="25"
                :x2="crosshairPos.x"
                :y2="chartHeight + 25"
                stroke-width="1"
                stroke="#eee"
              />
            </g>
          </g>
        </svg>
      </div>
      <!-- chart nav -->
      <ul class="chart-nav">
        <li
          v-for="item in chartNav"
          :key="item.type"
          :class="[item.type === chartFilterCur && 'active']"
          @click="() => switchTab(item.type)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Loading } from "components"

const CHART_WIDTH = window.innerWidth - 20
const CHART_HEIGHT = 120

const CHART_NAV = {
  "1d": {
    name: "24H",
    label: "1天",
    type: "1d"
  },
  "7d": {
    name: "过去1周",
    label: "1周",
    type: "7d"
  },
  "1m": {
    name: "过去1月",
    label: "1月",
    type: "1m"
  },
  "3m": {
    name: "过去3月",
    label: "3月",
    type: "3m"
  },
  "1y": {
    name: "过去1年",
    label: "1年",
    type: "1y"
  },
  "all": {
    name: "所有",
    label: "所有",
    type: "all"
  }
}

export default {
  components: {
    Loading
  },
  data() {
    return {
      chartWidth: CHART_WIDTH,
      chartHeight: CHART_HEIGHT,
      chartNav: CHART_NAV,
      chartFilterCur: "all",
      linePath: "",
      lineArea: "",
      lineAxisY: [],
      timeRange: [],
      positionMap: new Map(),
      crosshairPos: {},
      touchStartX: "",
      lineChartLoaded: false
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    storeCryptoMarketCap() {
      return DI.get("store").state.ranking.cryptoMarketCap
    },
    btcCapPercent() {
      return Math.round(this.storeCryptoMarketCap.btc_cap_percent * 100)
    },
    othersCapPercent() {
      return Math.round(this.storeCryptoMarketCap.others_cap_percent * 100)
    },
    storeCryptoDominance() {
      return DI.get("store").state.ranking.cryptoDominance
    },
    cryptoDominancePeriod() {
      return this.storeCryptoDominance[this.chartFilterCur] || []
    },
    tooltipX() {
      const tooltip_w = 80 / 2
      return this.crosshairPos.x > CHART_WIDTH - tooltip_w
        ? CHART_WIDTH - tooltip_w
        : this.crosshairPos.x < tooltip_w
          ? tooltip_w
          : this.crosshairPos.x
    }
  },
  watch: {
    cryptoDominancePeriod: {
      immediate: true,
      handler(val) {
        if(val && val.length) {
          this.processData()
        }
      }
    }
  },
  mounted() {
    DI.get("store").dispatch("SYNC_CRYPTO_MARKET_CAP")
    this.getCryptoDominance()
  },
  methods: {
    getCryptoDominance() {
      DI.get("store").dispatch("SYNC_CRYPTO_DOMINANCE", { period: this.chartFilterCur })
    },
    shorthandMoney(money) {
      return DI.get("filters").shorthandMoney(money)
    },
    switchTab(type) {
      if (type && type != this.chartFilterCur) {
        this.lineChartLoaded = false
        this.positionMap.clear()
        this.timeRange = []
        this.chartFilterCur = type
        this.getCryptoDominance()
      }
    },
    processData() {
      const items = this.cryptoDominancePeriod
      if (!items || !items.length) {
        return
      }
      const len = items.length
      const lineStepX = DI.get("filters").cutNumber(CHART_WIDTH / (len - 1))

      // get max min
      let dataArr = []
      let maxLinePoint = 0, minLinePoint = 0
      for (let i = 0; i < len; i++) {
        const time = this.$dayjs(items[i][0]).format("MM/DD")
        const percent = items[i][1]
        dataArr.push([time, percent])

        if (i === 0) {
          this.timeRange.push({ time, x: 5, textAnchor: "start" })
        }
        if (i === len - 1) {
          this.timeRange.push({ time, x: CHART_WIDTH - 5, textAnchor: "end" })
        }

        if (maxLinePoint === 0 || maxLinePoint < percent) {
          maxLinePoint = percent
        }
        if (minLinePoint === 0 || minLinePoint > percent) {
          minLinePoint = percent
        }
      }

      // get lineAxisY
      this.lineAxisY = [
        DI.get("filters").cutNumber(maxLinePoint, 2) + "%",
        DI.get("filters").cutNumber((+maxLinePoint + +minLinePoint) / 2, 2) + "%",
        DI.get("filters").cutNumber(minLinePoint, 2) + "%"
      ]

      // get line path & bar data
      this.linePath = "M0,"
      let lastCurX = CHART_WIDTH

      for (let i = 0; i < len; i++) {
        const percent = dataArr[i][1]
        // calculate lineto xy
        const curX = Math.floor(lineStepX * i)
        const curY = DI.get("filters").cutNumber(
          ((maxLinePoint - percent) * CHART_HEIGHT) / (maxLinePoint - minLinePoint),
          6
        )
        if (i === 0) {
          this.linePath += curY
        } else {
          this.linePath += `L${curX},${curY}`
        }

        if (i === len - 1) {
          lastCurX = curX
        }

        // generate position map
        this.positionMap.set(curX, {
          x: curX,
          y: curY,
          time:
            this.chartFilterCur === "all"
              ? this.$dayjs(items[i][0]).format("YYYY-MM-DD")
              : this.$dayjs(items[i][0]).format("MM-DD HH:mm"),
          percent
        })
      }

      this.lineArea = `${this.linePath}L${lastCurX},${CHART_HEIGHT}L0,${CHART_HEIGHT}`
      this.lineChartLoaded = true
    },
    showCrossHair(pageX) {
      if (this.positionMap.has(pageX)) {
        this.crosshairPos = this.positionMap.get(pageX)
      }
    },
    initCrossHair(ev) {
      const pageX = Math.round(ev.touches[0].pageX - 5)
      this.touchStartX = pageX
      this.showCrossHair(pageX)
    },
    moveCrossHair(ev) {
      const pageX = Math.round(ev.touches[0].pageX - 5)
      if (Math.abs(pageX - this.touchStartX) > 50) {
        ev.preventDefault()
      }
      this.showCrossHair(pageX)
    },
    hideCrossHair() {
      this.crosshairPos = {}
    }
  }
}
</script>

<style lang="less" scoped>
.crypto-market-cap-wrap {
  .loading-box {
    padding: 100px 0;
    text-align: center;
  }

  .chart-wrap {
    background-color: #fff;
    margin-bottom: 10px;
  }
  .chart-line-box {
    min-height: 160px;
    &.loading-box {
      min-height: 110px;
      padding: 50px 0 0;
    }
  }
  .title-line {
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0;
    h4 {
      font-size: 14px;
      font-weight: bold;
    }
    span {
      font-size: 10px;
      color: rgba(34, 34, 34, 0.3);
    }
  }

  .chart-pie-wrap {
    padding: 0 10px;
    min-height: 260px;

    .chart-pie-box {
      padding: 30px 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chart-pie {
      width: 44%;
      height: 0;
      padding-bottom: 44%;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: 0 11px 11px rgba(0, 0, 0, 0.1); 

      .svg-chart {
        transform: rotate(-90deg);
        border-radius: 50%;

        .pie {
          fill: #F7931A;
          stroke: #5251E5;
          stroke-width: 32;
        }
        .text-box {
          transform: rotate(90deg);
        }
        .text {
          color: #fff;
          white-space: nowrap;
          display: block;
        }
      }
    }
    .num-ratio {
      display: flex;
      flex-direction: column;
      color: rgba(34, 34, 34, 0.3);
      font-size: 10px; 
      align-items: center; 
      img {
        margin-bottom: 8px;
      }    
      .din {
        font-weight: bold;
        color: #222;
        font-size: 16px;
        margin-bottom: 2px;
      }
    }
    .line-bottom {
      display: flex;
      justify-content: center;
      padding-bottom: 30px;
    }
  }

  .chart-nav {
    padding: 0 10px 20px;
    margin-top: 5px;
    display: flex;
    justify-content: space-between;

    li {
      flex: 1 1;
      text-align: center;
      color: rgba(34, 34, 34, 0.3);
      font-size: 10px;
      height: 20px;
      line-height: 20px;
      max-width: 45px;

      &.active {
        color: #222;
        font-weight: bold;
        background-color: #f1f2f4;
        border-radius: 3px;
      }
    }
  }
}
</style>
