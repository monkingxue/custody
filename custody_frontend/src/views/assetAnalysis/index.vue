<template>
  <div class="assets-analysis-wrap">
    <div class="box total">
      <div class="flex align-items-center">
        <span class="box-title">
          {{ $t('wallet.estimatedBalance') }}
          ({{ $t('yuan') }})
        </span>
        <span
          class="visibleSet"
          @click.stop="visibleSet"
        >
          <img
            v-if="visible"
            src="../../assets/images/account-visible.png"
          >
          <img
            v-else
            src="../../assets/images/account-invisible.png"
          >
        </span>
      </div>
      <div
        class="btc-box"
        style="font-family: helvetica;"
      >
        <div class="btc">
          <span v-if="!account.cny_total">---</span>
          <span
            v-else-if="crosshairPos.val"
            class="din crosshair-val"
          >
            {{ crosshairPos.val }}
          </span>
          <ScrollNumber
            v-else-if="visible"
            :height="38"
            :width="21"
            class="total-asset-num"
            :number="account.cny_total"
          />
          <span v-else>****</span>
        </div>
        <div class="rmb">
          &asymp;&nbsp;&nbsp;<span class="din">{{ btcTotal }}</span>&nbsp;BTC
        </div>
      </div>
    </div>

    <!-- chart line box -->
    <div class="box line-chart-wrap">
      <div class="box-title">
        持仓变化
      </div>
      <!-- line chart -->
      <div
        v-if="!lineChartLoaded && !balanceChartPeriod.length"
        class="line-chart-box loading-box"
      >
        <Loading color="#36d58f" />
      </div>
      <div
        v-else
        class="line-chart-box"
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
              id="asset-analysis-fill-color"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-opacity="0.5"
                :style="`stop-color: #4FD198;`"
              />
              <stop
                offset="100%"
                stop-opacity="0"
                :style="`stop-color: #4FD198;`"
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
                  :x="chartWidth - 7"
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
                stroke="#4FD198"
                stroke-width="1"
                :d="linePath"
              />
              <path
                class="area"
                :fill="`url(#asset-analysis-fill-color)`"
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
              :transform="`translate(${tick.x},${chartHeight + 28})`"
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
            <g transform="translate(0, 12)">
              <text
                text-anchor="middle"
                fill="#999"
                :x="tooltipX"
                :y="0"
                style="font-size: 9px;"
              >
                {{ crosshairPos.time }}
              </text>
            </g>
            <g>
              <line
                :x1="crosshairPos.x"
                :y1="20"
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

    <!-- chart pie box -->
    <div class="box pie-chart-wrap">
      <div class="box-title">
        持仓分布
      </div>
      <WalletPie
        v-if="BISortValued.length"
        :labels="BISortValued"
        :balance="cnyBalance"
        :total="account.cny_total"
      />
      <!-- <div class="flex-left-right align-items-center">
        <div class="pie-chart">
          <svg viewBox="0 0 32 32">
            <circle
              v-for="item in pieChartData"
              :key="item.currency"
              cx="16"
              cy="16"
              r="16"
              :stroke="item.color"
              :stroke-dasharray="item.dasharray"
            />
            <circle
              class="pie-center"
              cx="16"
              cy="16"
              r="6"
              stroke="#fff"
            />
          </svg>
        </div>
        <div class="legend flex">
          <div
            v-for="item in pieChartData"
            :key="item.currency"
            class="item din"
          >
            <span
              class="flex align-items-center"
              :style="`color: ${item.color}`"
            >
              <span
                class="dot"
                :style="`backgroundColor: ${item.color}`"
              />
              <b>{{ item.currency }}</b>
            </span>
            <b>{{ item.percent }}</b>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { DI } from "core"
import { Loading, ScrollNumber } from "components"
import WalletPie from "../walletPie"

const USER_ACCOUNT_SHOW = "USER_ACCOUNT_SHOW"
const CHART_WIDTH = window.innerWidth - 20
const CHART_HEIGHT = 120
const PIE_COLOR = [
  "#F7931A",
  "#627EEA",
  "#2BAB86",
  "#FF001F",
  "#005DF5",
  "#2A3069",
  "#2A3069"
]
const PIE_COLOR_OTHER = "#989898"

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
  }
  // ,
  // "3m": {
  //   name: "过去3月",
  //   label: "3月",
  //   type: "3m"
  // },
  // "1y": {
  //   name: "过去1年",
  //   label: "1年",
  //   type: "1y"
  // },
  // "all": {
  //   name: "所有",
  //   label: "所有",
  //   type: "all"
  // }
}

export default {
  components: {
    Loading,
    ScrollNumber,
    WalletPie
  },
  data() {
    return {
      chartWidth: CHART_WIDTH,
      chartHeight: CHART_HEIGHT,
      chartNav: CHART_NAV,
      chartFilterCur: "1d",
      linePath: "",
      lineArea: "",
      lineAxisY: [],
      timeRange: [],
      positionMap: new Map(),
      crosshairPos: {},
      touchStartX: "",
      lineChartLoaded: false,
      visible: DI.get("offlineStorage").get(USER_ACCOUNT_SHOW) !== "invisible",
      pieChartData: []
    }
  },
  computed: {
    account() {
      return DI.get("auth").getUser()
    },
    cnyBalance() {
      return this.account.cny_balance
    },
    btcTotal() {
      if (!this.account.btc_total) {
        return "---"
      }
      if (!this.visible) {
        return "****"
      }
      if (this.crosshairPos.val) {
        return (this.crosshairPos.val * this.account.btc_total / this.account.cny_total).toFixed(8)
      }
      return this.account.btc_total
    },
    BISort() {
      return this.cnyBalance && this.biInfo
        ? Object.keys(this.biInfo).sort((a, b) => {
          const cnyB = this.cnyBalance[b] ? this.cnyBalance[b] : 0
          const cnyA = this.cnyBalance[a] ? this.cnyBalance[a] : 0
          return cnyB - cnyA
        })
        : []
    },
    BISortValued() {
      return this.BISort.filter(bi => +this.cnyBalance[bi] > 0)
    },
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
    storeBalanceChart() {
      return DI.get('store').state.auth.balanceChart
    },
    balanceChartPeriod() {
      return this.storeBalanceChart[this.chartFilterCur] || []
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
    balanceChartPeriod: {
      immediate: true,
      handler(val) {
        if(val && val.length) {
          this.processData()
        }
      }
    },
    BISortValued: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length) {
          this.pieChartData = []
          this.processPieChartData()
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      DI.get("utils").setTitle(this.$t("wallet.balanceAnalytics"))
      if (DI.get('utils').isFromApp()) {
        DI.get("vue").$emit("set-header-right", {
          share: true,
          action: this.appShare
        })
      }
    })
    DI.get("auth").syncUser()
    this.getBalanceChart()
  },
  methods: {
    appShare() {
      DI.get('utils').toggleBodyClass('app-share-wrap')
      setTimeout(() => {
        DI.get("utils").appScreenshot()
      }, 100)
      setTimeout(() => {
        DI.get('utils').toggleBodyClass('app-share-wrap')
      }, 110)
    },
    getBalanceChart() {
      DI.get("store").dispatch("SYNC_BALANCE_CHART", this.chartFilterCur)
    },
    switchTab(type) {
      if (type && type != this.chartFilterCur) {
        this.lineChartLoaded = false
        this.positionMap.clear()
        this.timeRange = []
        this.chartFilterCur = type
        this.getBalanceChart()
      }
    },
    processData() {
      const items = this.balanceChartPeriod
      if (!items || !items.length) {
        return
      }
      const len = items.length
      const lineStepX = DI.get("filters").cutNumber(CHART_WIDTH / (len - 1))

      // get max min
      let dataArr = []
      let maxLinePoint = 0, minLinePoint = 0
      for (let i = 0; i < len; i++) {
        const time = this.$dayjs.unix(items[i][0]).format("MM/DD")
        const val = items[i][1]
        dataArr.push([time, val])

        if (i === 0) {
          this.timeRange.push({ time, x: 5, textAnchor: "start" })
        }
        if (i === len - 1) {
          this.timeRange.push({ time, x: CHART_WIDTH - 5, textAnchor: "end" })
        }

        if (maxLinePoint === 0 || maxLinePoint < val) {
          maxLinePoint = val
        }
        if (minLinePoint === 0 || minLinePoint > val) {
          minLinePoint = val
        }
      }

      // get lineAxisY
      this.lineAxisY = [
        DI.get("filters").cutNumber(maxLinePoint, 2),
        DI.get("filters").cutNumber((+maxLinePoint + +minLinePoint) / 2, 2),
        DI.get("filters").cutNumber(minLinePoint, 2)
      ]

      // get line path & bar data
      this.linePath = "M0,"
      let lastCurX = CHART_WIDTH

      for (let i = 0; i < len; i++) {
        const val = dataArr[i][1]
        // calculate lineto xy
        const curX = Math.floor(lineStepX * i)
        const curY = DI.get("filters").cutNumber(
          ((maxLinePoint - val) * CHART_HEIGHT) / (maxLinePoint - minLinePoint),
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
              ? this.$dayjs.unix(items[i][0]).format("YYYY-MM-DD")
              : this.$dayjs.unix(items[i][0]).format("MM-DD HH:mm"),
          val
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
    },
    visibleSet() {
      this.visible = !this.visible
      DI.get("offlineStorage").set(
        USER_ACCOUNT_SHOW,
        this.visible ? "visible" : "invisible"
      )
    },
    processPieChartData() {
      let accPercentVal = 0
      for (let i = 0; i < this.BISortValued.length; i++) {
        let currency = this.BISortValued[i]
        let color = PIE_COLOR[i]
        let percentVal = ((this.cnyBalance[currency] / this.account.cny_total) * 100).toFixed(2)
        let dasharray = `0, ${accPercentVal}, ${percentVal}, ${100 - percentVal - accPercentVal}`
        if (i === 0) {
          // 60, 40, 0, 0
          dasharray = `${percentVal}, ${100 - percentVal}, 0, 0`
        }

        if ( percentVal === 0) {
          break
        }
        if (percentVal < 1 || i > 6) {
          percentVal = (100 - +accPercentVal).toFixed(2)
          currency = this.$t("wallet.otherCurrency")
          color = PIE_COLOR_OTHER
          dasharray = `0, ${accPercentVal}, ${percentVal}, ${100 - percentVal - accPercentVal}`
          this.pieChartData.push({ currency, percent: `${(+percentVal).toFixed(1)}%`, color, dasharray })
          break
        }

        this.pieChartData.push({ currency, percent: `${(+percentVal).toFixed(1)}%`, color, dasharray })
        accPercentVal += +percentVal
      }
    }
  }
}
</script>

<style scoped lang="less">
.assets-analysis-wrap {
  min-height: calc(100vh - 54px);
  background: url(../../assets/images/wallet-header.png) no-repeat left -76px #f1f2f4;
  background-size: 100%;
  padding: 0 10px 10px;
  h2 {
    font-size: 28px;
    padding: 20px 10px;
    color: #fff;
  }
  .box {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 10px;
    .box-title {
      font-size: 14px;
      font-weight: 500;
      color: #222;
    }
  }

  .total {
    background: transparent;
    color: #fff;
    padding-top: 30px;
    .box-title {
      color: #fff;
    }
    .btc-box {
      display: flex;
      margin-top: 8px;
    }
    .btc {
      font-size: 38px;
      height: 40px;
      font-weight: bold;
    }
    .crosshair-val {
      letter-spacing: 1px;
    }
    .rmb {
      margin-left: 10px;
      display: flex;
      align-items: flex-end;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    .visibleSet {
      position: relative;
      img {
        width: 19px;
        height: 14px;
        display: block;
      }
    }
    .visibleSet::after {
      content: " ";
      position: absolute;
      width: 100%;
      height: 100%;
      top: -10px;
      left: -10px;
      padding: 10px;
    }
  }

  .line-chart-wrap {
    padding: 20px 0;
    .box-title {
      padding-left: 20px;
    }
    .line-chart-box {
      height: 174px;
    }
    .loading-box {
      height: 104px;
      padding: 70px 0 0;
      text-align: center;
    }
    .chart-nav {
      padding: 0 10px;
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
          background-color: #f1f2f4;
          border-radius: 3px;
        }
      }
    }
  }

  .pie-chart-wrap {
    min-height: 200px;
    margin-bottom: 0;

    // .legend {
    //   width: calc(75vw - 60px);
    //   flex-wrap: wrap;
    // }
    // .dot {
    //   display: inline-block;
    //   width: 6px;
    //   height: 6px;
    //   border-radius: 2px;
    //   margin-right: 3px;
    // }
    // .item {
    //   background-color: #FAFAFA;
    //   height: 28px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    //   font-size: 12px;
    //   padding: 0 8px;
    //   border-radius: 3px;
    //   width: calc(46% - 16px);
    //   margin-left: 4%;
    //   margin-bottom: 10px;
    // }
  }
  .pie-chart {
    width: 35%;
    height: 0;
    padding-bottom: 35%;
    overflow: hidden;

    svg {
      transform: rotate(-90deg);
      border-radius: 50%;
    }
    circle {
      fill: none;
      stroke-width: 32;
    }
    .pie-center {
      fill: #fff;
      stroke-width: 0;
    }
  }
}
</style>
