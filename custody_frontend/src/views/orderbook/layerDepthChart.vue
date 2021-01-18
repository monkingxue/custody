<template>
  <div class="depth-chart-wrap">
    <!-- loading -->
    <div
      v-if="!depthLoaded && !asksData.length && !bidsData.length"
      class="depth-chart loading-box"
    >
      <Loading color="#36d58f" />
    </div>

    <!-- no results -->
    <div
      v-else-if="depthLoaded && !asksData.length && !bidsData.length"
      class="depth-chart loading-box"
    >
      <Empty />
    </div>
    <!-- layer chart -->
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
            v-for="xch in curOTCList"
            :id="`${xch}-fill-color`"
            :key="xch"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-opacity="0.5"
              :style="`stop-color: ${otcInfo[xch]['color']};`"
            />
            <stop
              offset="100%"
              stop-opacity="0"
              :style="`stop-color: ${otcInfo[xch]['color']};`"
            />
          </linearGradient>
          <!-- if only one exchange -->
          <linearGradient
            id="layerdepth-up-fill-color"
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
            id="layerdepth-down-fill-color"
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
          <!-- legend -->
          <g
            v-if="linePath.length"
            font-size="9px"
            :transform="`translate(${legendTransform}, -38)`"
          >
            <g
              v-for="(xch, index) in curOTCList"
              :key="xch"
              :transform="legendItemTransform(index)"
            >
              <rect
                v-if="!isOnlyOneXch"
                width="6"
                height="6"
                rx="2"
                :style="`fill:${otcInfo[xch]['color']};`"
              />
              <text
                x="11"
                y="7"
              >
                {{ otcInfo[xch]['nameCN'] }}
              </text>
            </g>
          </g>

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
            <!-- y line -->
            <g>
              <g
                v-for="tick in axisTickY"
                :key="tick.y"
                :transform="`translate(0,${tick.y})`"
              >
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
          <g
            v-for="path in linePath"
            :key="path.color"
            class="series"
          >
            <path
              class="line"
              fill="none"
              :stroke="isOnlyOneXch ? '#36d58f' : path.color"
              stroke-width="2"
              :d="path.lineBidsPath"
            />
            <path
              v-if="!isOnlyOneXch"
              class="area"
              fill="#fff"
              :d="path.lineBidsAreaPath"
            />
            <path
              class="area"
              :fill="isOnlyOneXch ? `url(#layerdepth-up-fill-color)` : `url(#${path.xch}-fill-color)`"
              :d="path.lineBidsAreaPath"
            />
            <path
              class="line"
              fill="none"
              :stroke="isOnlyOneXch ? '#ff654c' : path.color"
              stroke-width="2"
              :d="path.lineAsksPath"
            />
            <path
              v-if="!isOnlyOneXch"
              class="area"
              fill="#fff"
              :d="path.lineAsksAreaPath"
            />
            <path
              class="area"
              :fill="isOnlyOneXch ? `url(#layerdepth-down-fill-color)` : `url(#${path.xch}-fill-color)`"
              :d="path.lineAsksAreaPath"
            />
          </g>

          <!-- y tick -->
          <g
            font-size="11px"
            fill-opacity="0.5"
          >
            <g
              v-for="tick in axisTickY"
              :key="tick.y"
              :transform="`translate(0,${tick.y})`"
            >
              <text
                x="5"
                y="11"
              >
                {{ tick.val }}
              </text>
            </g>
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
              :transform="`translate(${tooltipInfo.x}, 30)`"
            >
              <g
                fill="#333"
                fill-opacity="0.5"
                style="pointer-events: none;"
                :transform="`translate(${tooltipInfo.type === 'bids' ? 5 : -125}, 0)`"
              >
                <rect
                  width="120"
                  :height="tooltipInfo.totalArr.length * 18 + 38"
                  rx="5"
                />
              </g>
              <g
                fill="#fff"
                style="pointer-events: none;"
                :transform="`translate(${tooltipInfo.type === 'bids' ? 20 : -110}, 22)`"
              >
                <text
                  x="0"
                  y="0"
                >
                  <tspan>{{ tooltipInfo.type === 'bids' ? "买盘价" : "卖盘价" }}：</tspan>
                  <tspan style="font-weight:bold">{{ tooltipInfo.price }}</tspan>
                </text>
                <text
                  v-for="(xch, index) in tooltipInfo.totalArr"
                  :key="xch.xch"
                  x="0"
                  :y="18 + index * 18"
                >
                  <tspan>{{ otcInfo[xch.xch]['nameCN'] }}：</tspan>
                  <tspan style="font-weight:bold">{{ xch.total }}</tspan>
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { DI } from "core"
import depth from "./depth"
import { Empty, Loading } from 'components'

const CHART_BOX_WIDTH = window.innerWidth - 10
const CHART_BOX_HEIGHT = 300
const CHART_HEIGHT = 240
const LEGEND_ITEM_W = 60
const LEGEND_ITEM_H = 15

export default {
  components: {
    Loading,
    Empty
  },
  mixins: [depth],
  props: {
    symbol: String,
    from: String
  },
  data() {
    return {
      chart: null,

      chartBoxWidth: CHART_BOX_WIDTH,
      chartBoxHeight: CHART_BOX_HEIGHT,
      chartHeight: CHART_HEIGHT,
      otcInfo: DI.get('OTC_INFO'),

      bids: {},
      asks: {},
      xchDataLen: {
        bids: {},
        asks: {}
      },

      linePath: [],

      axisTickX: [],
      axisTickY: [],
      axis: {
        maxY: "",
        stepX: ""
      },

      tooltipInfo: {},
      positionMap: new Map(),
      touchStartX: "",
      crossNum: 0,

      sortArr: []
    }
  },
  computed: {
    aggregateOTCList() {
      return DI.get('AGGREGATE_TRANS_SUPPORT_OTC')
    },
    curOTCList() {
      return this.aggregateOTCList.filter((xch) => this.sortArr.includes(xch))
    },
    legendTransform() {
      if (this.from === 'CHART') {
        return 15
      }
      if (this.curOTCList.length) {
        const legendLen = this.curOTCList.length
        if (legendLen <= this.legendLineNum) {
          return (CHART_BOX_WIDTH - legendLen * LEGEND_ITEM_W) / 2
        } else {
          return (CHART_BOX_WIDTH - this.legendLineNum * LEGEND_ITEM_W) / 2
        }
      }
      return CHART_BOX_WIDTH / 2
    },
    legendLineNum() {
      return this.from === 'CHART' ? 4 : 5
    },
    isOnlyOneXch() {
      return this.sortArr.length === 1
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
    legendItemTransform(index) {
      const offsetX = index % this.legendLineNum
      const offsetY = Math.floor(index / this.legendLineNum)
      return `translate(${offsetX * LEGEND_ITEM_W}, ${offsetY * LEGEND_ITEM_H})`
    },
    clearData() {
      // clear data
      this.positionMap.clear()
      this.crossNum = 0
      this.linePath = []
      this.bids = {}
      this.asks = {}
      this.xchDataLen = {
        bids: {},
        asks: {}
      }
    },
    handleDepthData() {
      // clear data
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
        this.splitData(this.bidsData, "bids", absPrice)
      }
      if (this.asksData.length) {
        this.splitData(this.asksData, "asks", absPrice)
      }
      this.generateAllPath()
    },
    splitData(list, type, absPrice) {
      const res = {}
      const resLen = {}
      const temp = []

      for (var i = 0; i < list.length; i++) {
        const item = list[i]
        const itemPrice = item[0]
        const itemAmount = item[1]
        const itemXch = item[2]

        // filter price too high or too low
        if (
          +itemPrice === 0 ||
          (absPrice && Math.abs(+itemPrice - this.middlePrice) > absPrice)
        ) {
          continue
        }
        if (type === "asks" && +itemPrice <= +this.bidsMiddlePrice) {
          this.crossNum = this.crossNum + 1
        }
        if (!res[itemXch]) {
          // repair blank points in front
          res[itemXch] = [...temp]
          resLen[itemXch] = 0
        }
        const price = itemPrice
        const amount = Number(DI.get("filters").cutNumber(itemAmount, this.amountDigits))
        const index = res[itemXch].length

        let total = ""
        if (index > 0) {
          total = Number(
            DI.get("filters").cutNumber(
              res[itemXch][index - 1].total + amount,
              this.amountDigits
            )
          )
        } else {
          total = amount
        }
        const curObj = { price, total, amount }
        resLen[itemXch] += 1

        // reassign valid price
        if (index > 0 && res[itemXch][index - 1].price === price) {
          res[itemXch][index - 1] = curObj
          continue
        }

        res[itemXch].push(curObj)

        // fill in blank obj in front
        temp.push({ price, total: 0, amount: 0 })
        // fill in blank obj to other xch
        Object.keys(res).forEach((item) => {
          if (item === itemXch) return
          const blankObj = {
            price,
            total: index > 0 ? res[item][index - 1].total : 0,
            amount: 0
          }
          res[item].push(blankObj)
        })
      }
      this[type] = { ...res }
      this.xchDataLen[type] = { ...resLen }
    },
    generateAllPath() {
      // sort xch start
      let sortObj = []
      Object.keys(this.bids).forEach((xch) => {
        // bids 买单 降序
        this.bids[xch].reverse()
        if (this.asks[xch]) {
          sortObj.push({ xch, total: this.bids[xch][0]['total'] })
        }
      })

      // if just one exchange
      if (sortObj.length === 1) {
        const xch = sortObj[0]['xch']
        this.sortArr = [xch]
        // calculate axis XY
        this.generateAxis(xch)
        this.generatePath(
          xch,
          this.bids[xch],
          this.asks[xch],
          0
        )
        return
      }

      sortObj = sortObj.sort((xch1, xch2) => xch2.total - xch1.total)
      // console.log('sortObj: ', sortObj) // eslint-disable-line no-console
      // sort xch end

      // recalculate total value
      sortObj.forEach((item, i) => {
        this.sortArr.push(item.xch)
        if (i === 0) {
          return
        }
        const curXch = item.xch
        const preXch = sortObj[i - 1].xch
        const curXchBids = this.bids[curXch]
        const curXchAsks = this.asks[curXch]
        const preXchBids = this.bids[preXch]
        const preXchAsks = this.asks[preXch]
        const length = Math.max(curXchBids.length, curXchAsks.length)

        for (let j = 0; j < length; j++) {
          if (curXchBids[j]) {
            const total = Number(DI.get("filters").cutNumber(
              preXchBids[j]["total"] + curXchBids[j]["total"],
              this.amountDigits
            ))
            this.bids[curXch][j] = { ...this.bids[curXch][j], total }
          }
          if (curXchAsks[j]) {
            const total = Number(DI.get("filters").cutNumber(
              preXchAsks[j]["total"] + curXchAsks[j]["total"],
              this.amountDigits
            ))
            this.asks[curXch][j] = { ...this.asks[curXch][j], total }
          }
        }
        if (i === sortObj.length - 1) {
          // calculate axis XY
          this.generateAxis(curXch)
        }
      })

      // generate path
      sortObj.forEach((item, i) => {
        this.generatePath(
          item.xch,
          this.bids[item.xch],
          this.asks[item.xch],
          sortObj.length - 1 - i
        )
      })
    },
    generateAxis(lastXch) {
      // use the top xch
      const bids = this.bids[lastXch]
      const asks = this.asks[lastXch]
      const bidsLen = bids.length
      const asksLen = asks.length

      // X: price, Y: total
      const maxTotalY = Math.max(
        bids[0]["total"],
        asks[asksLen - 1]["total"]
      )
      const maxY = Math.ceil(maxTotalY / 30) * 30
      const stepX = (this.chartBoxWidth / (bidsLen + asksLen - this.crossNum - 1)).toFixed(2)

      this.axis = { maxY, stepX }

      // XY tick points
      const stepValY = (maxY / 3).toFixed(2)
      const stepY = (this.chartHeight / 3).toFixed(2)

      this.axisTickX = [
        { val: bids[0].price, x: 0, textAnchor: "start" },
        { val: bids[bidsLen - 1].price, x: stepX * bidsLen, textAnchor: "middle" },
        { val: asks[asksLen - 1].price, x: this.chartBoxWidth, textAnchor: "end" }
      ]
      if (this.crossNum >= 150 || (bidsLen + asksLen) / 2 <= this.crossNum) {
        this.axisTickX = [
          { val: bids[0].price, x: 0, textAnchor: "start" },
          { val: asks[asksLen - 1].price, x: this.chartBoxWidth, textAnchor: "end" }
        ]
      }
      this.axisTickY = [
        { val: maxY, y: 0 },
        { val: maxY - stepValY, y: stepY },
        { val: maxY - stepValY * 2, y: stepY * 2 }
      ]
    },
    generateOneSidePath(side, type, startPoint, xch) {
      const { maxY, stepX } = this.axis

      const startX = Math.floor(stepX * startPoint)
      let linePath = type === 'asks' ? `M${startX},${CHART_HEIGHT}L${startX},` : `M${startX},`
      let lastAxisX = ""
      side.forEach((item, i) => {
        const { price, total } = item
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
        let positionVal
        if (!this.positionMap.has(axisX)) {
          positionVal = {
            type,
            x: axisX,
            y: axisY,
            price,
            totalArr: [{ xch, total }]
          }
        } else {
          positionVal = this.positionMap.get(axisX)
          const positionTotal = positionVal.totalArr
          positionTotal.unshift({ xch, total })
          Object.assign(positionVal, { totalArr: positionTotal })
        }
        this.positionMap.set(axisX, positionVal)
      })

      const lineAreaPath = `${linePath}L${lastAxisX},${CHART_HEIGHT}L${startX},${CHART_HEIGHT}`

      // asks path & area
      return { linePath, lineAreaPath }
    },
    generatePath(xch, bids, asks, index) {
      if (!bids.length || !asks.length) {
        return
      }

      // bids path & area
      const bidsPathObj = this.generateOneSidePath(bids, 'bids', 0, xch)
      const asksPathObj = this.generateOneSidePath(asks, 'asks', bids.length - this.crossNum, xch)

      this.linePath[index] = {
        lineBidsPath: bidsPathObj.linePath,
        lineBidsAreaPath: bidsPathObj.lineAreaPath,
        lineAsksPath: asksPathObj.linePath,
        lineAsksAreaPath: asksPathObj.lineAreaPath,
        xch,
        color: this.otcInfo[xch]['color']
      }
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
