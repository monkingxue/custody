<template>
  <div :class="isStock && 'stock-wrap'">
    <!-- chart price range -->
    <div class="year-range">
      <div v-if="minInfo.price != '' ">
        <div class="name">
          {{ rangeName }}价格范围
        </div>
        <div
          :class="['indicator', getPricePercent > 85 && 'textBefore']"
          :style="`left: ${getPricePercent}%`"
        >
          <img
            v-if="isStock"
            src="../../assets/images/biz/icon-sign-blue.png"
          >
          <img
            v-else
            src="../../assets/images/icon-sign-green.png"
          >
          <span>当前价格</span>
        </div>
        <div class="progress" />
        <div class="foot">
          <span class="c-price din">
            {{ `最低：${minPrice}` }}
          </span>
          <span class="c-price din">
            {{ `最高：${maxPrice}` }}
          </span>
        </div>
      </div>
    </div>

    <!-- chart -->
    <div class="price-chart-wrap">
      <!-- loading -->
      <div
        v-if="!chartLoaded && !chartData.length"
        class="price-chart loading-box"
      >
        <Loading color="#36d58f" />
      </div>

      <!-- no results -->
      <div
        v-else-if="chartLoaded && !chartData.length"
        class="price-chart loading-box"
      >
        <Empty />
      </div>
      <!-- line chart -->
      <div
        v-else
        class="price-chart"
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
              id="line-up-fill-color"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-opacity="0.5"
                :style="`stop-color: ${lineColor};`"
              />
              <stop
                offset="100%"
                stop-opacity="0"
                :style="`stop-color: ${lineColor};`"
              />
            </linearGradient>
          </defs>
          <g transform="translate(0,40)">
            <g
              v-if="crosshairPos.x"
              ref="tooltip"
              class="tooltip-box"
              transform="translate(0, -10)"
            >
              <text
                text-anchor="middle"
                fill="#999999"
                :x="tooltipX"
                style="font-size: 12px;"
              >
                {{ crosshairPos.time }}
              </text>
            </g>
            <g v-if="crosshairPos.x">
              <line
                :x1="crosshairPos.x"
                y1="0"
                :x2="crosshairPos.x"
                :y2="crossHairHeight"
                stroke-width="1"
                stroke="#eeeeee"
              />
            </g>
            <g class="series">
              <path
                class="line"
                fill="none"
                :stroke="lineColor"
                stroke-width="1"
                :d="linePath"
              />
              <path
                class="area"
                fill="url(#line-up-fill-color)"
                :d="lineAreaPath"
              />
            </g>
            <g
              v-if="maxInfo.x !== ''"
              class="markers font"
            >
              <g :transform="[`translate(${maxInfo.x}, ${maxInfo.y})`]">
                <text
                  y="5"
                  :text-anchor="maxInfo.x > 100 ? 'end' : 'start'"
                  :x="maxInfo.x > 100 ? -23 : 23"
                  style="font-size: 14px;"
                >
                  {{ maxPrice }}
                </text>
                <circle
                  r="2"
                  :cx="maxInfo.x > 100 ? -18 : 18"
                />
                <line
                  stroke="#333"
                  :x2="maxInfo.x > 100 ? -18 : 18"
                />
              </g>
              <g :transform="[`translate(${minInfo.x}, ${minInfo.y})`]">
                <text
                  y="5"
                  :text-anchor="minInfo.x < chartBoxWidth - 100 ? 'start' : 'end'"
                  :x="minInfo.x < chartBoxWidth - 100 ? 23 : -23"
                  style="font-size: 14px;"
                >
                  {{ minPrice }}
                </text>
                <circle
                  r="2"
                  :cx="minInfo.x < chartBoxWidth - 100 ? 18 : -18"
                />
                <line
                  stroke="#333"
                  :x2="minInfo.x < chartBoxWidth - 100 ? 18 : -18"
                />
              </g>
            </g>
          </g>
        </svg>

        <div
          v-if="!isAbtcChart && !isStock"
          class="niuyanLogo app-share-hide-elem"
          @click="goToNiuyan"
        />
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
import { Empty, Loading } from 'components'
import LineChartPath from "./lineChartPath"

const TOOLTIP_HALF_W = 45
const TOOLTIP_ALL_HALF_W = 35

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
    Loading,
    Empty
  },
  mixins: [LineChartPath],
  props: {
    symbol: String,
    source: String
  },
  data() {
    return {
      crosshairPos: {},
      touchStartX: ""
    }
  },
  computed: {
    setting() {
      return DI.get("store").state.setting.setting
    },
    quote() {
      return this.symbol ? DI.get("utils").getQuoteFromSymbol(this.symbol) : ""
    },
    lineColor() {
      return this.isStock ? "#009AFF" : "#00D196"
    },
    priceDigits() {
      if (this.isStock) {
        return this.storeStockItem.price_digits
      }
      return this.storePairItem.price_digits
    },
    storePairItem() {
      return DI.get("store").state.pair.pairItem
    },
    storeStockObj() {
      return DI.get("store").state.stock.stockObj
    },
    storeStockItem() {
      return this.base && this.storeStockObj && this.storeStockObj[this.base]
        ? this.storeStockObj[this.base]
        : {}
    },
    curPrice() {
      if (this.isStock) {
        return this.storeStockItem.price
      }
      return this.storePairItem.last
    },
    storePairBasic() {
      return DI.get("store").state.pair.pairBasic
    },
    USDPrice() {
      return this.setting.usd_to_usdt_price
    },
    BTCPrice() {
      return this.storePairBasic["BTC_USDT"]
    },
    ETHPrice() {
      return this.storePairBasic["ETH_USDT"]
    },
    tooltipX() {
      const tooltip_w = this.chartFilterCur === 'all' ? TOOLTIP_ALL_HALF_W : TOOLTIP_HALF_W
      return this.crosshairPos.x > this.chartBoxWidth - tooltip_w
        ? this.chartBoxWidth - tooltip_w
        : this.crosshairPos.x < tooltip_w
          ? tooltip_w
          : this.crosshairPos.x
    },
    chartNav() {
      return CHART_NAV
    },
    rangeName() {
      return CHART_NAV[this.chartFilterCur].name
    },
    maxPrice() {
      return this.maxInfo.price !== ""
        ? this.getUnitPrice(this.maxInfo.price)
        : ""
    },
    minPrice() {
      return this.minInfo.price !== ""
        ? this.getUnitPrice(this.minInfo.price)
        : ""
    },
    getPricePercent() {
      if (this.curPrice && this.maxPrice && this.minPrice) {
        let percentNum = DI.get("filters").cutNumber(
          (this.curPrice - this.minPrice) / (this.maxPrice - this.minPrice),
          4
        )
        percentNum = percentNum > 1 ? 1 : percentNum < 0 ? 0 : percentNum
        return percentNum * 100
      }
      return ""
    }
  },
  methods: {
    switchTab(type) {
      if (type && type != this.chartFilterCur) {
        this.chartLoaded = false
        DI.get('vue').$emit('set-linechart-path', ({ linePathSmall: "", lineAreaPathSmall: "" }))
        this.chartData = []
        this.chartFilterCur = type
        this.getLineChart(type)
      }
    },
    getUnitPrice(usdPrice) {
      // 如果是我们自己的API
      if (this.isAbtcChart || this.isStock) {
        return Number(usdPrice).toFixed(this.priceDigits)
      }
      // source: niuyan
      let unitPrice = ""
      if (this.quote === "BTC") {
        unitPrice = this.BTCPrice.last
          ? (usdPrice / this.BTCPrice.last).toFixed(this.priceDigits)
          : usdPrice.toFixed(this.priceDigits)
      } else if (this.quote === "ETH") {
        unitPrice = this.ETHPrice.last
          ? (usdPrice / this.ETHPrice.last).toFixed(this.priceDigits)
          : usdPrice.toFixed(this.priceDigits)
      } else {
        // USDT
        unitPrice = this.USDPrice
          ? (usdPrice * this.USDPrice).toFixed(this.priceDigits)
          : usdPrice.toFixed(this.priceDigits)
      }
      return unitPrice
    },
    showCrossHair(pageX) {
      if (this.positionMap.has(pageX)) {
        this.crosshairPos = this.positionMap.get(pageX)
        const price = this.getUnitPrice(this.crosshairPos.price)
        DI.get('vue').$emit('set-linechart-price', price)
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
      DI.get('vue').$emit('set-linechart-price', '')
    },
    goToNiuyan() {
      window.location = "https://niuyan.com/"
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
@blue: #009AFF;
@mainText: #222;
@grayText: rgba(34, 34, 34, 0.6);
@lightGrayText: rgba(34, 34, 34, 0.3);

.price-chart-wrap {
  margin: 0 -25px;
  min-height: 330px;
  overflow: hidden;
}

.year-range {
  height: 50px;
  padding: 20px 30px;
  margin: 0 -30px;
  border-bottom: 10px solid #F1F2F4;
  overflow: hidden;

  &.mt30 {
    margin-top: 30px;
  }
  .name {
    font-size: 12px;
    color: @lightGrayText;
  }
  .indicator {
    position: relative;
    height: 15px;
    margin-left: -3px;
    margin-bottom: -4px;
    img {
      width: 7px;
      height: 15px;
      margin-right: 2px;
    }
    span {
      display: block;
      position: absolute;
      top: 0;
      left: 9px;
      color: @green;
      width: 50px;
      text-align: left;
      font-size: 8px;
      line-height: 10px;
    }
    &.textBefore span {
      text-align: right;
      left: -52px;
    }
  }
  .progress {
    height: 3px;
    background-color: #F5F5F5;
    padding: 0 2px;
  }
  .foot {
    display: flex;
    justify-content: space-between;
    height: 24px;
    align-items: center;
    font-size: 10px;
    color: @grayText;
    font-weight: bold;
    span {
      flex: 1 1;
      &:last-child{
        text-align: right;
      }
    }
  }
}

.price-chart {
  height: 300px;
  overflow: hidden;
  position: relative;

  svg {
    position: absolute;
    z-index: 2;
  }

  .niuyanLogo {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 3;
    background: url("../../assets/images/niuyan.png") no-repeat left center;
    background-size: auto 100%;
    height: 16px;
    width: 16px;
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

.chart-nav {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;

  li {
    flex: 1 1;
    text-align: center;
    color: rgba(34, 34, 34, 0.3);
    font-size: 10px;
    height: 24px;
    line-height: 24px;
    max-width: 45px;

    &.active {
      color: #222;
      font-weight: bold;
      background-color: #f1f2f4;
      border-radius: 3px;
    }
  }
}

.stock-wrap .year-range {
  .indicator span {
    color: @blue;
  }
}
</style>
