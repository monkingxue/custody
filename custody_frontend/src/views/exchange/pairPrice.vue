<template>
  <div class="pair-price-wrap">
    <div
      :class="[
        'xch-pair',
        source === 'EXCHANGE' && 'exchange-header',
        isStock && 'stock-header',
        fixedHeight && navFixed && 'xch-pair-fixed'
      ]"
    >
      <div class="xch-pair-left">
        <div class="pair-icon">
          <img
            v-if="iconUrl"
            :src="iconUrl"
            width="28"
          >
        </div>
        <b class="price din">
          {{ chartPrice ? chartPrice : exchangePrice }}
        </b>
        <img
          v-if="isStock"
          class="icon-text-stock"
          src="../../assets/images/biz/icon-text-stock.png"
          width="12"
        >
        <div
          v-if="source === 'EXCHANGE' || navFixed"
          class="fiat din"
        >
          &asymp;&nbsp;&yen;{{ getFiatPrice }}
        </div>
      </div>
      <div class="xch-pair-right">
        <div
          v-if="source !== 'EXCHANGE' && !navFixed"
          class="fiat din"
        >
          &asymp;&nbsp;&yen;{{ getFiatPrice }}
        </div>
        <div
          v-if="(source === 'EXCHANGE' || navFixed) && linePath && lineAreaPath"
          class="linechart-small"
        >
          <svg
            :width="90"
            :height="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="small-line-up-fill-color"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stop-opacity="0.2"
                  :style="`stop-color: ${lineColor};`"
                />
                <stop
                  offset="100%"
                  stop-opacity="0"
                  :style="`stop-color: ${lineColor};`"
                />
              </linearGradient>
            </defs>
            <path
              fill="none"
              :stroke="lineColor"
              stroke-width="1"
              :d="linePath"
            />
            <path
              class="area"
              fill="url(#small-line-up-fill-color)"
              :d="lineAreaPath"
            />
          </svg>
        </div>
        <div :class="['din change', +getPairChange < 0 ? 'orange' : 'green']">
          {{ getPairChange }}%
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import depth from "../orderbook/depth"

export default {
  mixins: [depth],
  props: {
    fixedHeight: [String, Number],
    source: String,
    xchTarget: String
  },
  data() {
    return {
      symbol: "",
      base: "",
      quote: "",
      chartPrice: "",
      navFixed: false,
      linePath: "",
      lineAreaPath: "",
      initPrice: ""
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    isStock() {
      return this.source === 'STOCK'
    },
    lineColor() {
      return this.isStock ? "#009AFF" : "#00D196"
    },
    biTargetInfo() {
      return this.base ? this.biInfo[this.base] : ""
    },
    iconUrl() {
      if (this.isStock && this.base) {
        return DI.get("STOCK_CO_INFO")[this.base]
          ? DI.get("STOCK_CO_INFO")[this.base]
          : ""
      }
      if (!this.biTargetInfo) {
        return ""
      }
      return this.biTargetInfo["use_device_icon"]
        ? DI.get("BI_LOCAL_ICON")[this.base]
        : this.biTargetInfo["icon_url"]
    },
    centerStore() {
      return DI.get("store").state.market.market
    },
    buyPrice() {
      if (this.asksData && this.asksData.length && this.asksData[0].length) {
        return this.asksData[0][0]
      }
      return ""
    },
    sellPrice() {
      if (this.bidsData && this.bidsData.length && this.bidsData[0].length) {
        return this.bidsData[0][0]
      }
      return ""
    },
    exchangePrice() {
      if (this.source === "CHART" && this.storePairItem.support_orderbook_booster) {
        return DI.get("filters").cutNumber(+this.middlePrice, this.priceDigits) || this.initPrice
      }
      if (this.isStock) {
        return this.storeStockItem.price || this.initPrice
      }
      return this.xchTarget === "BUY" ? this.buyPrice : this.sellPrice
    },
    getPairChange() {
      let priceChangePercent
      if (this.isStock) {
        priceChangePercent =
          this.storeStockItem && this.storeStockItem.price_change_percent
            ? this.storeStockItem.price_change_percent
            : ""
      } else {
        priceChangePercent =
          this.storePairItem && this.storePairItem.price_change_percent
            ? this.storePairItem.price_change_percent
            : ""
      }
      return priceChangePercent
        ? (+priceChangePercent > 0 ? "+" : "") + (+priceChangePercent).toFixed(2)
        : ""
    },
    getFiatPrice() {
      if (this.isStock) {
        return this.storeStockItem.price_cny
      }
      const obj = this.centerStore[this.quote] || {}
      return this.exchangePrice && obj.buy_price
        ? (this.exchangePrice * obj.buy_price).toFixed(2)
        : (0).toFixed(2)
    },
    storeStockObj() {
      return DI.get("store").state.stock.stockObj
    },
    storeStockItem() {
      return this.base && this.storeStockObj && this.storeStockObj[this.base]
        ? this.storeStockObj[this.base]
        : {}
    }
  },
  watch: {
    fixedHeight: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            window.addEventListener("scroll", this.handleFixed)
          })
        }
      }
    },
    $route() {
      this.initPairPrice()
    }
  },
  mounted() {
    this.initPairPrice()
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleFixed)
  },
  methods: {
    initPairPrice() {
      const { params } = this.$route

      const symbol = params.symbol
      this.symbol = symbol
      this.base = DI.get("utils").getBaseFromSymbol(symbol)
      this.quote = DI.get("utils").getQuoteFromSymbol(symbol)

      if (params.pairPriceInfo && params.pairPriceInfo.last) {
        this.initPrice = params.pairPriceInfo.last
      }

      DI.get("vue").$on("set-linechart-price", price => {
        this.chartPrice = price
      })
      DI.get("vue").$on(
        "set-linechart-path",
        ({ linePathSmall, lineAreaPathSmall }) => {
          this.linePath = linePathSmall
          this.lineAreaPath = lineAreaPathSmall
        }
      )
    },
    handleFixed() {
      const winScrollY = window.scrollY
      if (winScrollY > this.fixedHeight) {
        this.navFixed = true
      } else {
        this.navFixed = false
      }
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
@blue: #009AFF;

.pair-price-wrap {
  height: 40px;

  .xch-pair {
    display: flex;
    justify-content: space-between;
    .xch-pair-left {
      display: flex;
      align-items: center;
    }
    .pair-icon {
      margin-right: 5px;
    }
    .price {
      font-size: 28px;
    }
    .icon-text-stock {
      position: relative;
      top: -4px;
      margin-left: 6px;
    }
    .xch-pair-right {
      text-align: right;
    }
    .fiat {
      font-size: 12px;
      color: rgba(34, 34, 34, 0.6);
    }
    .change {
      &.orange {
        color: @orange;
      }
      &.green {
        color: @green;
      }
    }
  }

  .exchange-header,
  .xch-pair-fixed {
    background-color: #fff;
    align-items: center;
    height: 40px;

    .xch-pair-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .linechart-small {
      width: 90px;
      height: 30px;
    }
    .pair-icon img {
      width: 20px;
    }
    .change {
      margin-left: 10px;
    }
    .price,
    .change {
      font-size: 14px;
    }
    .price {
      margin-right: 10px;
    }
  }

  .xch-pair-fixed {
    position: fixed;
    left: 0;
    top: 44px;
    z-index: 98;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    .xch-pair-left {
      padding-left: 30px;
    }
    .xch-pair-right {
      padding-right: 30px;
    }
  }

  .stock-header {
    .change {
      &.green {
        color: @blue;
      }
    }
    &.xch-pair-fixed {
      .icon-text-stock {
        top: -2px;
        margin: 0 8px 0 -5px;
      }
    }
  }
}
</style>
