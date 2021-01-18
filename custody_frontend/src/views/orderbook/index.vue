<template>
  <div>
    <div :class="['orderbook-wrap', !from && 'orderbook-list']">
      <!-- exchange header: realtime -->
      <div
        v-if="from === 'EXCHANGE'"
        class="flex-left-right price-real-time"
      >
        <span class="text">
          <span class="breathe">
            <i class="breathe-div" />
          </span>
          <span class="inner">
            {{ isBuy ? "实时全网最低价" : "实时全网最高价" }}
          </span>
          <span
            v-if="isBuy && asksData[0]"
            class="site site-top"
          >
            <img :src="exchangeIcon(asksData[0][2])">
            <b>{{ exchangeInfo(asksData[0][2]).nameCN }}</b>
          </span>
          <span
            v-if="!isBuy && bidsData[0]"
            class="site site-top"
          >
            <img :src="exchangeIcon(bidsData[0][2])">
            <b>{{ exchangeInfo(bidsData[0][2]).nameCN }}</b>
          </span>
        </span>
        <span
          v-if="Number(estimateSaveMoney)"
          class="save flex"
          @click="showTips"
        >
          预计{{ isBuy ? "节省" : "多赚" }} {{ estimateSaveMoney | toFixed(4) }} USDT
          <img
            src="../../assets/images/icon18.png"
            width="13"
            height="13"
          >
        </span>
      </div>

      <!-- orderbook header -->
      <div v-if="!from">
        <LayerDepthChart
          v-if="!from"
          :symbol="symbol"
        />
        <div class="title flex-left-right">
          <span>买盘</span>
          <span>卖盘</span>
        </div>
      </div>

      <!-- loading -->
      <div
        v-if="!depthLoaded && !asks.length && !bids.length"
        class="orderbook loading-box"
      >
        <Loading color="#36d58f" />
      </div>

      <!-- no results -->
      <div
        v-else-if="depthLoaded && !asks.length && !bids.length"
        class="orderbook loading-box"
      >
        <Empty />
      </div>
      <!-- orderbook list -->
      <div
        v-else
        class="orderbook flex-left-right"
      >
        <div
          v-if="bids.length"
          class="list buy-list"
        >
          <div
            v-for="(item, index) in bids"
            :key="item[0] + item[2] + index"
            class="line"
            @click="() => fillPrice(item[0])"
          >
            <span class="amount">
              <img
                v-if="item[2] && exchangeIcon(item[2])"
                :src="exchangeIcon(item[2])"
              >
              {{ item[1] | cutNumber(amountDigits) }}
            </span>
            <span class="price">
              {{ item[0] | cutNumber(priceDigits) }}
              <span
                v-if="amountMax"
                class="bg"
                :style="`width:${(item[1] * 80) / amountMax}%`"
              />
            </span>
          </div>
        </div>
        <div
          v-if="asks.length"
          class="list sell-list"
        >
          <div
            v-for="(item, index) in asks"
            :key="item[0] + item[2] + index"
            class="line"
            @click="() => fillPrice(item[0])"
          >
            <span class="price">
              {{ item[0] | cutNumber(priceDigits) }}
              <span
                v-if="amountMax"
                class="bg"
                :style="`width:${(item[1] * 80) / amountMax}%`"
              />
            </span>
            <span class="amount">
              {{ item[1] | cutNumber(amountDigits) }}
              <img
                v-if="item[2] && exchangeIcon(item[2])"
                :src="exchangeIcon(item[2])"
              >
            </span>
          </div>
        </div>
      </div>

      <!-- exchange&chart footer -->
      <div
        v-if="(asks.length || bids.length) && (from === 'CHART' || from === 'EXCHANGE')"
        class="more"
      >
        <span
          class="arrow-right"
          @click="goToOrderBook"
        >
          {{ $t('viewAll') }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Message, Empty, Loading } from 'components'
import { Dialog } from "vant"
import depth from "./depth"
import LayerDepthChart from "./layerDepthChart"

const LIMIT = 200

export default {
  components: {
    LayerDepthChart,
    Loading,
    Empty
  },
  mixins: [depth],
  props: {
    limit: {
      type: Number
    },
    from: {
      type: String
    },
    xchTarget: {
      type: String
    }
  },
  data() {
    return {
      symbol: "",
      depthDataTimer: null
    }
  },
  computed: {
    StoreEstimateSaveMoney() {
      return DI.get("store").state.depth.estimateSaveMoney
    },
    estimateSaveMoney() {
      if (this.StoreEstimateSaveMoney['currency']) {
        return Number(this.StoreEstimateSaveMoney[this.isBuy ? 'asks' : 'bids']).toFixed(8)
      }
      return ""
    },
    isBuy() {
      return this.xchTarget === "BUY"
    },
    asks() {
      // 卖单
      if (this.limit && this.asksData) {
        return this.asksData.slice(0, this.limit)
      }
      return this.asksData || []
    },
    bids() {
      // 买单
      if (this.limit && this.bidsData) {
        return this.bidsData.slice(0, this.limit)
      }
      return this.bidsData || []
    },
    asksMax() {
      if (this.asks && this.asks.length) {
        const max = Math.max(...this.asks.map(i => i[1]))
        return DI.get("filters").cutNumber(max, this.amountDigits)
      }
      return ""
    },
    bidsMax() {
      if (this.bids && this.bids.length) {
        const max = Math.max(...this.bids.map(i => i[1]))
        return DI.get("filters").cutNumber(max, this.amountDigits)
      }
      return ""
    },
    amountMax() {
      return Math.max(this.asksMax, this.bidsMax)
    },
    tipMsg() {
      return `${DI.get("utils").getBaseFromSymbol(this.symbol)} ${
        this.isBuy ? "购买单价低于" : "卖出单价高于"
      }市场平均价\r ${this.estimateSaveMoney} USDT`
    }
  },
  watch: {
    $route() {
      this.initOrderbook()
    }
  },
  mounted() {
    this.initOrderbook()
  },
  beforeDestroy() {
    clearInterval(this.depthDataTimer)
  },
  methods: {
    initOrderbook() {
      const { params, name } = this.$route
      if (!params.symbol) {
        Message("缺少 symbol")
        return
      }
      this.symbol = params.symbol
      if (name === "orderbook" || name === "chart" || name === "exchange") {
        this.getDepthData()
      }
      if (name === "orderbook") {
        DI.get("utils").setTitle(
          `${DI.get("utils").getPairFromSymbol(this.symbol)}`
        )
        DI.get('store').dispatch('SYNC_PAIR_BY_NAME', { name: this.symbol })
      }
    },
    showTips() {
      Dialog.alert({
        className: "tipsMessage",
        message: this.tipMsg,
        confirmButtonText: "好的"
      })
    },
    exchangeIcon(target) {
      return DI.get('OTC_INFO')[target]['icon']
    },
    exchangeInfo(target) {
      return DI.get('OTC_INFO')[target] || {}
    },
    getDepthData() {
      DI.get("store").dispatch("SYNC_DEPTH", {
        symbol: this.symbol,
        limit: LIMIT
      })
      clearInterval(this.depthDataTimer)
      this.depthDataTimer = setInterval(() => {
        DI.get("store").dispatch("SYNC_DEPTH", {
          symbol: this.symbol,
          limit: LIMIT
        })
      }, 1000 * 3)
    },
    goToOrderBook() {
      this.$router.push({
        name: "orderbook",
        params: {
          symbol: this.symbol
        }
      })
    },
    fillPrice(price) {
      if (this.from === 'EXCHANGE') {
        DI.get("vue").$emit(
          "fill-orderbook-price",
          DI.get("filters").cutNumber(price, this.priceDigits)
        )
      }
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
@mainText: #222;
@grayText: rgba(34, 34, 34, 0.6);
@lightGrayText: rgba(34, 34, 34, 0.3);

.orderbook-wrap {
  font-size: 11px;

  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    color: #999;
  }
}
.orderbook-list {
  padding: 0 20px 20px;
}
.more {
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
}
.line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
}
.orderbook {
  overflow: hidden;
  min-height: 140px;
  .list {
    width: 48%;
  }
  .line {
    position: relative;
    z-index: 1;
  }
  .bg {
    position: absolute;
    top: 0;
    height: 24px;
  }
  .amount {
    display: flex;
    align-items: center;
    color: @grayText;
    img {
      width: 12px;
    }
  }
  .buy-list {
    .line {
      padding-right: 5px;
    }
    .price {
      color: @green;
    }
    .amount img {
      margin-right: 5px;
    }
    .bg {
      right: 0;
      background: rgba(54, 213, 143, 0.1);
    }
  }
  .sell-list {
    .line {
      padding-left: 5px;
    }
    .price {
      color: @orange;
    }
    .amount img {
      margin-left: 5px;
    }
    .bg {
      left: 0;
      background: rgba(255, 101, 76, 0.1);
    }
  }
}
.title {
  color: @lightGrayText;
  margin-bottom: 10px;
}

.price-real-time {
  align-items: center;
  background-color: #FAFAFA;
  color: #222;
  font-size: 10px;
  height: 40px;
  padding: 0 10px;
  margin-bottom: 10px;

  .text {
    display: flex;
    align-items: center;
  }
  .inner {
    margin-left: 5px;
  }
  .site {
    display: flex;
    align-items: flex-end;

    img {
      width: 16px;
      height: 16px;
    }
    b {
      margin: 0 5px;
    }
  }
  .site-top {
    margin-left: 5px;
    align-items: center;
  }
  .save {
    color: #36d58f;
    align-items: center;
    img {
      margin-left: 2px;
    }
  }
}
</style>
<style lang="less">
.tipsMessage {
  .van-dialog__message {
    font-size: 13px;
    padding: 25px 20px;
  }
}
</style>
