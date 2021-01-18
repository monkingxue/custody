<template>
  <div class="depth-chart-wrap">
    <!-- loading -->
    <div
      v-if="!depthLoaded && !asks.length && !bids.length"
      class="depth-chart loading-box"
    >
      <Loading color="#36d58f" />
    </div>

    <!-- no results -->
    <div
      v-else-if="depthLoaded && !asks.length && !bids.length"
      class="depth-chart loading-box"
    >
      <Empty />
    </div>
    <!-- depth chart -->
    <div
      v-else
      class="depth-chart"
      @touchstart="initCrossHair"
      @touchmove="moveCrossHair"
      @touchend="hideCrossHair"
    >
      <svg
        :width="chartBoxWidth"
        :height="chartBoxHeight"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="depth-up-fill-color"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-opacity="0.5"
              style="stop-color: rgb(0, 209, 150);"
            />
            <stop
              offset="100%"
              stop-opacity="0.05"
              style="stop-color: rgb(0, 209, 150);"
            />
          </linearGradient>
          <linearGradient
            id="depth-down-fill-color"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-opacity="0.5"
              style="stop-color: rgb(247, 80, 62);"
            />
            <stop
              offset="100%"
              stop-opacity="0.05"
              style="stop-color: rgb(247, 80, 62);"
            />
          </linearGradient>
        </defs>
        <g transform="translate(0,40)">
          <!-- axis -->
          <g
            font-size="11px"
            fill-opacity="0.5"
          >
            <!-- x axis -->
            <g
              stroke="#eee"
              stroke-opacity="1"
              :transform="`translate(0,${chartHeight})`"
              opacity="1"
            >
              <path :d="`M0,0L${chartBoxWidth},0`" />
            </g>
            <!-- y tick -->
            <g>
              <g
                v-for="tick in axisTickY"
                :key="tick.y"
                :transform="`translate(0,${tick.y})`"
              >
                <g>
                  <text
                    x="5"
                    y="11"
                  >
                    {{ tick.val }}
                  </text>
                </g>
                <g
                  stroke="#f1f1f1"
                  stroke-opacity="1"
                  stroke-dasharray="5"
                >
                  <path :d="`M0,0L${chartBoxWidth},0`" />
                </g>
              </g>
            </g>
            <!-- x tick -->
            <g>
              <g
                v-for="tick in axisTickX"
                :key="tick.x"
                :transform="`translate(${tick.x},${chartHeight})`"
              >
                <text
                  :text-anchor="tick.textAnchor"
                  x="0"
                  y="16"
                >
                  {{ tick.val }}
                </text>
              </g>
            </g>
          </g>
          <!-- chart -->
          <g class="series">
            <path
              class="line"
              fill="none"
              stroke="#36d58f"
              stroke-width="2"
              :d="bidsPath"
            />
            <path
              class="area"
              fill="url(#depth-up-fill-color)"
              :d="bidsAreaPath"
            />
            <path
              class="line"
              fill="none"
              stroke="#ff654c"
              stroke-width="2"
              :d="asksPath"
            />
            <path
              class="area"
              fill="url(#depth-down-fill-color)"
              :d="asksAreaPath"
            />
          </g>

          <!-- tooltip -->
          <g v-if="tooltipInfo.x">
            <line
              :x1="tooltipInfo.x"
              y1="0"
              :x2="tooltipInfo.x"
              :y2="chartHeight"
              stroke-width="1"
              stroke="#000"
              stroke-dasharray="3,3"
              stroke-opacity="0.2"
            />
            <!-- bids & asks box -->
            <g
              role="tooltip"
              font-size="10px"
              :transform="`translate(${tooltipInfo.x},${tooltipInfo.y})`"
            >
              <g
                v-if="tooltipInfo.type === 'bids'"
                fill="#36d58f"
                fill-opacity="0.5"
                style="pointer-events: none;"
                transform="translate(6,-26.031)"
              >
                <path d="M3,0 L151,0 a3,3 0 0 1 3,3 L154,49.063 a3,3 0 0 1 -3,3 L3,52.063 a3,3 0 0 1 -3,-3 L0,49.063 L0,31.031 L-6,26.031 L0,21.031 L0,3 a3,3 0 0 1 3,-3" />
              </g>
              <g
                v-if="tooltipInfo.type === 'asks'"
                fill="#ff654c"
                fill-opacity="0.5"
                style="pointer-events: none;"
                transform="translate(-161,-26.031)"
              >
                <path d="M3,0 L152,0 a3,3 0 0 1 3,3 L155,3 L155,21.031 L161,26.031 L155,31.031 L155,49.063 a3,3 0 0 1 -3,3 L3,52.063 a3,3 0 0 1 -3,-3 L0,3 a3,3 0 0 1 3,-3" />
              </g>
              <g
                fill="#333"
                style="pointer-events: none;"
                :transform="`translate(${tooltipInfo.type === 'bids' ? 20 : -147},-19)`"
              >
                <text
                  x="0"
                  y="8"
                >
                  <tspan>{{ tooltipInfo.type === 'bids' ? "Bid" : "Ask" }}:</tspan>
                  <tspan style="font-weight:bold">{{ tooltipInfo.price }}</tspan>
                </text>
                <text
                  x="0"
                  y="22"
                >
                  <tspan>Total volume:</tspan>
                  <tspan style="font-weight:bold">{{ tooltipInfo.total }}</tspan>
                </text>
                <text
                  x="0"
                  y="36"
                >
                  <tspan>Volume:</tspan>
                  <tspan style="font-weight:bold">{{ tooltipInfo.volume }}</tspan>
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <!-- <div
        class="tips"
        @click="onShowTips"
      >
        <span>深度图交叉说明</span>
        <img
          src="../../assets/images/icon18.png"
          width="13"
          height="13"
        >
      </div> -->
    </div>
  </div>
</template>

<script>
import { DI } from "core"
import depth from "./depth"
import { Dialog } from "vant"
import { Empty, Loading } from 'components'

const CHART_BOX_WIDTH = window.innerWidth - 10
const CHART_BOX_HEIGHT = 300
const CHART_HEIGHT = 240

export default {
  components: {
    Loading,
    Empty
  },
  mixins: [depth],
  props: {
    symbol: {
      type: String
    }
  },
  data() {
    return {
      chart: null,

      chartBoxWidth: CHART_BOX_WIDTH,
      chartBoxHeight: CHART_BOX_HEIGHT,
      crossHairHeight: CHART_HEIGHT + 20,
      chartHeight: CHART_HEIGHT,

      bids: [],
      asks: [],
      bidsPath: "",
      asksPath: "",
      bidsAreaPath: "",
      asksAreaPath: "",
      axisTickX: [],
      axisTickY: [],

      tooltipInfo: {},
      positionMap: new Map(),
      touchStartX: "",
      crossNum: 0
    }
  },
  watch: {
    depth: {
      immediate: true,
      handler(val) {
        if (val.asks && val.bids) {
          this.handleDepthData()
        }
      }
    }
  },
  methods: {
    clearData() {
      // clear data
      this.positionMap.clear()
      this.crossNum = 0
      this.bids = []
      this.asks = []
      this.bidsPath = ""
      this.asksPath = ""
      this.bidsAreaPath = ""
      this.asksAreaPath = ""
    },
    handleDepthData() {
      this.clearData()

      let absPrice = Number(this.middlePrice / 2)
      if (this.bidsData.length < 120 || this.asksData.length < 120) {
        absPrice = this.middlePrice
      } else if (this.bidsData.length < 60 || this.asksData.length < 60) {
        absPrice = Number(this.middlePrice * 2)
      } else if (this.bidsData.length < 20 || this.asksData.length < 20) {
        absPrice = ""
      }
      if (this.bidsData.length) {
        this.processData(this.bidsData, "bids", true, absPrice)
      }
      if (this.asksData.length) {
        this.processData(this.asksData, "asks", false, absPrice)
      }
      this.generatePath()
    },
    processData(list, type, desc, absPrice) {
      const res = []
      // convert to data points
      for (var i = 0; i < list.length; i++) {
        const item = list[i]
        const price = item[0]
        const amount = item[1]

        if (
          +price === 0 ||
          (absPrice && Math.abs(+price - this.middlePrice) > absPrice)
        ) {
          continue
        }

        const volume = Number(DI.get("filters").cutNumber(amount, this.amountDigits))
        if (type === "asks" && +price <= +this.bidsMiddlePrice) {
          this.crossNum = this.crossNum + 1
        }
        let total = ""
        if (i > 0) {
          total = Number(
            DI.get("filters").cutNumber(
              res[i - 1].total + volume,
              this.amountDigits
            )
          )
        } else {
          total = volume
        }
        const dp = {
          price,
          volume,
          total
        }
        res.push(dp)
      }
      if (desc) {
        // bids 买单 降序
        res.reverse()
      }
      this[type] = res
    },
    showCrossHair(pageX) {
      if (this.positionMap.has(pageX)) {
        this.tooltipInfo = this.positionMap.get(pageX)
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
      this.tooltipInfo = {}
    },
    onShowTips() {
      Dialog.alert({
        messageAlign: 'left',
        message: '深度图是取自各家交易所深度融合，会出现综合后购买价格高于卖出价格的情况，此时深度图会出现交叉，属于正常现象。'
      })
    },
    generateAxis() {
      // use the top xch
      const bids = this.bids
      const asks = this.asks
      const bidsLen = bids.length
      const asksLen = asks.length

      // X: price, Y: total
      const maxTotalY = Math.max(
        bids[0]["total"],
        asks[asksLen - 1]["total"]
      )
      const maxY = Math.ceil(maxTotalY / 30) * 30
      const stepX = (CHART_BOX_WIDTH / (bidsLen + asksLen - this.crossNum - 1)).toFixed(2)

      this.axis = { maxY, stepX }

      // XY tick points
      const stepValY = (maxY / 3).toFixed(2)
      const stepY = (this.chartHeight / 3).toFixed(2)

      this.axisTickX = [
        { val: bids[0].price, x: 0, textAnchor: "start" },
        { val: bids[bidsLen - 1].price, x: stepX * bidsLen, textAnchor: "middle" },
        { val: asks[asksLen - 1].price, x: CHART_BOX_WIDTH, textAnchor: "end" }
      ]
      if (this.crossNum >= 150 || (bidsLen + asksLen) / 2 <= this.crossNum) {
        this.axisTickX = [
          { val: bids[0].price, x: 0, textAnchor: "start" },
          { val: asks[asksLen - 1].price, x: CHART_BOX_WIDTH, textAnchor: "end" }
        ]
      }
      this.axisTickY = [
        { val: maxY, y: 0 },
        { val: maxY - stepValY, y: stepY },
        { val: maxY - stepValY * 2, y: stepY * 2 }
      ]
      // console.log("crossNum: ", this.crossNum) //eslint-disable-line no-console
    },
    generatePath() {
      if (!this.bids.length || !this.asks.length) {
        return
      }

      // generate axis
      this.generateAxis()
      // bids&asks path area
      this.generateOneSidePath(this.bids, 'bids', 0)
      this.generateOneSidePath(this.asks, 'asks', this.bids.length - this.crossNum)
    },
    generateOneSidePath(side, type, startPoint) {
      const { maxY, stepX } = this.axis

      const startX = Math.floor(stepX * startPoint)
      let linePath = type === 'asks' ? `M${startX},${CHART_HEIGHT}L${startX},` : `M${startX},`
      let lastAxisX = ""
      side.forEach((item, i) => {
        const { price, volume, total } = item
        const sideLen = side.length

        // calculate lineto xy
        const axisX = Math.floor(stepX * (startPoint + i))
        const axisY = DI.get("filters").cutNumber(
          ((maxY - total) * CHART_HEIGHT) / maxY,
          this.amountDigits
        )
        if (i === 0) {
          linePath += axisY
        } else {
          linePath += `L${axisX},${axisY}`
        }

        if (i === sideLen - 1) {
          lastAxisX = axisX
        }

        if (type === 'bids' && i === sideLen - 1) {
          linePath += `L${axisX},${CHART_HEIGHT}`
        }

        if (type === "asks" && i < this.crossNum) {
          return
        }
        // generate position map
        this.positionMap.set(axisX, {
          type,
          x: axisX,
          y: axisY,
          price,
          volume,
          total
        })
      })

      this[`${type}Path`] = linePath
      this[`${type}AreaPath`] = `${linePath}L${lastAxisX},${CHART_HEIGHT}L${startX},${CHART_HEIGHT}`
    }
  }
}
</script>

<style scoped lang="less">
.depth-chart-wrap {
  margin: 0 -15px 20px;
  padding-top: 10px;
  overflow: hidden;
  .depth-chart {
    height: 300px;
    overflow: hidden;
    position: relative;

    svg {
      position: absolute;
      z-index: 2;
    }

    .tips {
      position: absolute;
      top: 10px;
      right: 0px;
      z-index: 3;
      font-size: 12px;
      color: #222222;
      opacity: .3;
      display: flex;
      align-items: center;
      img {
        margin-left: 4px;
      }
    }
  }
  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    color: #999;
  }
}
</style>
