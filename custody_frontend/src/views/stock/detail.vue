<template>
  <div class="stock-detail-wrap">
    <PairHeader
      :title="headerTitle"
      :base="base"
    />

    <div class="box">
      <PairPrice
        source="STOCK"
        :fixed-height="148"
      />
      <line-chart
        source="STOCK"
        :symbol="symbol"
      />
    </div>

    <div class="box">
      <span class="box-title">数据统计</span>
      <BiInfo
        source="STOCK"
        :symbol="symbol"
      />
    </div>

    <div class="fixed-btn">
      <div class="action-btn app-share-hide-elem">
        <div
          :class="['btn-green touch-opacity grey', isFromApp && 'btn-short']"
        >
          买入
        </div>
        <div
          :class="['btn-orange touch-opacity grey', isFromApp && 'btn-short']"
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
import PairHeader from "../exchange/pairHeader"
import PairPrice from "../exchange/pairPrice"
import LineChart from "../chart/lineChart"
import BiInfo from "../chart/biInfo"

export default {
  components: {
    PairHeader,
    PairPrice,
    LineChart,
    BiInfo
  },
  data() {
    return {
      symbol: null,
      base: null,
      quote: null
      // ,exchangeTimer: null
    }
  },
  computed: {
    isFromApp() {
      return DI.get('utils').isFromApp()
    },
    headerTitle() {
      return DI.get("utils").getPairFromSymbol(this.symbol)
    },
    storeStockList() {
      return DI.get("store").state.stock.stockList
    }
  },
  watch: {
    $route() {
      this.initPage()
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   clearInterval(this.exchangeTimer)
  //   next()
  // },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      const { params } = this.$route

      this.symbol = params.symbol
      this.base = DI.get("utils").getBaseFromSymbol(this.symbol)

      DI.get('store').dispatch('SYNC_STOCK_INFO', this.base)
      DI.get('store').dispatch('SYNC_SINGLE_PRICE', this.base)
      // this.exchangeTimer = setInterval(() => {
      //   DI.get('store').dispatch('SYNC_SINGLE_PRICE', this.base)
      // }, 1000 * 180)
    },
    appShare() {
      DI.get('utils').toggleBodyClass('app-share-wrap')
      setTimeout(() => {
        DI.get("utils").appScreenshot()
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

.stock-detail-wrap {
  min-height: calc(100vh - 68px);
  background-color: #f1f2f4;
  padding-bottom: 68px;
  .box {
    padding: 20px 30px;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .box-title {
    font-size: 14px;
    font-weight: 600;
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
    .grey {
      opacity: 0.3;
    }
  }
}
</style>