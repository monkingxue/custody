<template>
  <div class="chart-wrap">
    <PairHeader
      :title="headerTitle"
      :base="base"
    />

    <div class="box">
      <PairPrice
        source="CHART"
        :fixed-height="148"
      />
      <line-chart :symbol="symbol" />
    </div>

    <div class="box tab-box">
      <scrollTabLabel
        class="tab-title"
        :tabs="tabData"
        :target="tabCur"
        :drag-percent-offset="dragPercentOffset"
        @change="switchTab"
      />

      <ScrollTab
        v-model="tabCur"
        :swipeable="true"
        :touchable="false"
        @onDragPercent="onDragPercent"
      >
        <ScrollTabItem id="tab0">
          <div
            v-if="tabCur === 'tab0'"
            class="orderbook-box"
          >
            <div :class="['depth-switch', isDepthLayer && 'show']">
              <span
                class="flex"
                @click="switchDepthLayer"
              >
                <span class="check-box" />显示分层深度图
              </span>
            </div>
            <LayerDepthChart
              v-if="isDepthLayer"
              :symbol="symbol"
              from="CHART"
            />
            <DepthChart
              v-else
              :symbol="symbol"
            />
            <DepthAnalysis />
            <order-book
              :symbol="symbol"
              :limit="10"
              from="CHART"
            />
          </div>
        </ScrollTabItem>
        <ScrollTabItem id="tab1">
          <MarketPrice
            v-if="tabCur === 'tab1'"
            @show-tip="onShowTip"
          />
        </ScrollTabItem>
        <ScrollTabItem
          v-if="showTraderFlag"
          id="tab2"
        >
          <Trader
            :symbol="symbol"
            @show="showTrader"
          />
        </ScrollTabItem>
        <ScrollTabItem id="tab3">
          <Fee v-if="tabCur === 'tab3'" />
        </ScrollTabItem>
        <ScrollTabItem id="tab4">
          <BiInfo
            v-if="tabCur === 'tab4'"
            :symbol="symbol"
          />
        </ScrollTabItem>
      </ScrollTab>
    </div>

    <div class="fixed-btn">
      <div
        v-if="tipVisible"
        class="tip-bottom"
      >
        <div class="main">
          <img
            class="left"
            src="../../assets/images/pair/icon-save.png"
          >
          现在下单预计为您节省
          <span class="din green">
            <span>{{ StoreEstimateSaveMoney.bids | toFixed(4) }}</span>
            <span class="usdt">USDT</span>
          </span>
          <img
            src="../../assets/images/icon18.png"
            width="11"
            height="11"
            @click="showTips"
          >
        </div>
        <img
          class="right"
          src="../../assets/images/pair/icon-save-close.png"
          @click="() => {tipVisible = false}"
        >
      </div>
      <div class="action-btn app-share-hide-elem">
        <!-- <span class="small">
          <img src="../../assets/images/icon-reminder-black.png">
          提醒
        </span> -->
        <div
          :class="['btn-green touch-opacity', isFromApp && 'btn-short']"
          @click="() => goToExchange('BUY')"
        >
          买入
        </div>
        <div
          :class="['btn-orange touch-opacity', isFromApp && 'btn-short']"
          @click="() => goToExchange('SELL')"
        >
          卖出
        </div>
        <span
          v-if="isFromApp"
          class="small touch-opacity share-btn"
          @click="appShare"
        >
          <img src="../../assets/images/icon-share-black.png">
          分享
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { scrollTabLabel, ScrollTab as ScrollTabContainer } from "components"
import { Dialog } from "vant"
import PairHeader from "../exchange/pairHeader"
import PairPrice from "../exchange/pairPrice"
import LineChart from "./lineChart"
import BiInfo from "./biInfo"
import MarketPrice from './marketPrice'
import DepthChart from "../orderbook/depthChart"
import LayerDepthChart from "../orderbook/layerDepthChart"
import DepthAnalysis from "./depthAnalysis"
import OrderBook from "../orderbook"
import Fee from "./fee"
import Trader from "./trader"
const { ScrollTab, ScrollTabItem } = ScrollTabContainer

const TAB_DATA = [
  {
    text: "聚合深度",
    value: "tab0"
  },
  {
    text: "全网最优价",
    value: "tab1"
  },
  {
    text: "操盘成绩",
    value: "tab2"
  },
  {
    text: "手续费折扣",
    value: "tab3"
  },
  {
    text: "概述",
    value: "tab4"
  }
]
const TAB_DATA_NO_TRADER = [
  {
    text: "聚合深度",
    value: "tab0"
  },
  {
    text: "全网最优价",
    value: "tab1"
  },
  {
    text: "手续费折扣",
    value: "tab3"
  },
  {
    text: "概述",
    value: "tab4"
  }
]
const DEFAULT_SYMBOL = "BTC_USDT"
const USER_EXCHANGE_TYPE = "USER_EXCHANGE_TYPE"

export default {
  components: {
    PairHeader,
    PairPrice,
    scrollTabLabel,
    ScrollTab,
    ScrollTabItem,
    LineChart,
    DepthChart,
    LayerDepthChart,
    DepthAnalysis,
    OrderBook,
    BiInfo,
    Fee,
    Trader,
    MarketPrice
  },
  data() {
    return {
      symbol: null,
      base: null,
      quote: null,
      dragPercentOffset: 0,
      tabCur: "tab0",
      isDepthLayer: true,
      showTraderFlag: false,
      exchangeTimer: null,
      tipVisible: null
    }
  },
  computed: {
    isFromApp() {
      return DI.get('utils').isFromApp()
    },
    tabData() {
      return this.showTraderFlag ? TAB_DATA : TAB_DATA_NO_TRADER
    },
    headerTitle() {
      return DI.get("utils").getPairFromSymbol(this.symbol)
    },
    StoreEstimateSaveMoney() {
      return DI.get("store").state.depth.estimateSaveMoney
    }
  },
  watch: {
    $route() {
      this.initPage()
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.exchangeTimer)
    next()
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      const { params } = this.$route

      const symbol = params.symbol || DEFAULT_SYMBOL
      this.symbol = symbol
      this.base = DI.get("utils").getBaseFromSymbol(symbol)

      DI.get('store').dispatch('SYNC_PAIR_BY_NAME', { name: this.symbol })
      this.exchangeTimer = setInterval(() => {
        DI.get('store').dispatch('SYNC_PAIR_BY_NAME', { name: this.symbol })
      }, 1000 * 10)
      DI.get("store").dispatch("SYNC_DEPTH_ANALYSIS", this.base)
      this.tabCur = "tab0"
    },
    showTips() {
      Dialog.alert({
        message: `${DI.get("utils").getBaseFromSymbol(this.symbol)} 购买单价低于市场平均价\r ${Number(this.StoreEstimateSaveMoney.bids).toFixed(8)} USDT`,
        confirmButtonText: "好的"
      })
    },
    onShowTip() {
      if (!Number(this.StoreEstimateSaveMoney.bids)) return
      if (this.tipVisible) return
      if (this.tipVisible === null) {
        this.tipVisible = true
      }
    },
    switchTab(target) {
      this.tabCur = target
      if (target !== 'tab1') {
        this.tipVisible = null
      }
    },
    onDragPercent(e) {
      this.dragPercentOffset = e
    },
    showTrader() {
      this.showTraderFlag = true
    },
    goToExchange(type) {
      DI.get("offlineStorage").set(USER_EXCHANGE_TYPE, type)
      this.$router.push({
        name: "exchange",
        params: {
          symbol: this.symbol
        }
      })
    },
    switchDepthLayer() {
      this.isDepthLayer = !this.isDepthLayer
    },
    appShare() {
      DI.get('utils').toggleBodyClass('app-share-wrap')
      setTimeout(() => {
        DI.get("utils").appScreenshot(true)
      }, 100)
      setTimeout(() => {
        DI.get('utils').toggleBodyClass('app-share-wrap')
      }, 110)
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;

.chart-wrap {
  min-height: calc(100vh - 68px);
  background-color: #f1f2f4;
  padding-bottom: 68px;
  .box {
    padding: 20px 30px;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .orderbook-box {
    margin: 0 -10px;
    padding-top: 5px;
    position: relative;

    .depth-switch {
      position: absolute;
      right: -15px;
      top: 15px;
      z-index: 10;
      font-size: 12px;
      color: rgba(34, 34, 34, 0.6);

      .flex {
        align-items: center;
      }
      .check-box {
        display: block;
        width: 12px;
        height: 12px;
        border: 1px solid #DCDDDF;
        margin-right: 10px;
        border-radius: 1px;
        position: relative;
      }
      .check-box::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 6px;
        height: 6px;
      }
      &.show .check-box::after {
        background-color: #00C3D2;
      }
    }
  }
  .tab-box {
    padding-top: 0;
    .tab-title {
      border-bottom: 1px solid #eeeeee;
    }
  }

  .fixed-btn {
    position: fixed;
    z-index: 10;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    .tip-bottom {
      display: flex;
      width: calc(100% - 60px);
      margin: 0 auto;
      border-bottom: 1px solid #EEE;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 12px;
      .main {
        display: flex;
        align-items: center;
      }
      .left {
        margin-left: 10px;
        height: 25px;
        width: 28px;
        margin-right: 10px;
      }
      .right {
        height: 15px;
        width: 15px;
        margin-right: 10px;
        position: relative;
      }
      .green {
        margin-left: 5px;
        color: #55D89D;
        font-size: 14px;
        .usdt {
          margin-left: 0px;
        }
      }
    }
    .action-btn {
      width: calc(100% - 60px);
      margin: 0 auto;
      margin-top: 10px;
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .small {
      display: flex;
      flex-direction: column;
      font-size: 8px;
      img {
        width: 24px;
      }
    }
    .share-btn {
      padding: 0 5px;
      margin-left: 5px;
      display: flex;
      align-items: center;
    }

    .btn-green,
    .btn-orange {
      border-radius: 3px;
      height: 48px;
      line-height: 48px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      min-width: 120px;
      width: 48%;
      text-align: center;
    }
    .btn-green {
      background-color: @green;
    }
    .btn-orange {
      background-color: @orange;
    }
    .btn-short {
      width: 36%;
    }
  }
}
</style>
<style lang="less">
.chart-wrap .tab-container {
  overflow: visible !important;
}
.chart-wrap .tab-title ul {
  color: rgba(34, 34, 34, 0.3) !important;
  font-size: 13px;
  justify-content: space-between;
  li {
    padding: 15px 0 !important;
    &:hover {
      color: rgba(34, 34, 34, 0.3) !important;
    }
  }
  .bot {
    background: #222 !important;
  }
  li.active {
    color: #222 !important;
  }
}
.app-share-wrap .chart-wrap {
  padding-bottom: 0;
}
</style>
