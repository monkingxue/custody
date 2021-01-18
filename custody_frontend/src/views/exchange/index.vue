<template>
  <div class="exchange">
    <PairHeader
      :title="headerTitle"
      :base="base"
    />

    <div class="box pair-price">
      <PairPrice
        source="EXCHANGE"
        :fixed-height="60"
        :xch-target="xchTarget"
      />
    </div>

    <div class="box orderbook-box">
      <order-book
        :symbol="symbol"
        :limit="7"
        :xch-target="xchTarget"
        from="EXCHANGE"
      />
    </div>

    <div class="box">
      <OrderForm
        :symbol="symbol"
        @updateTarget="updateXchTarget"
      />
    </div>

    <div class="box">
      <OrderList :symbol="symbol" />
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import PairHeader from "./pairHeader"
import PairPrice from "./pairPrice"
import OrderBook from "../orderbook"
import OrderForm from "./orderForm"
import OrderList from "../exchangeOrderRecently"
import LineChartPath from "../chart/lineChartPath"

const USER_EXCHANGE_TYPE = "USER_EXCHANGE_TYPE"

export default {
  components: {
    PairHeader,
    PairPrice,
    OrderBook,
    OrderForm,
    OrderList
  },
  mixins: [LineChartPath],
  data() {
    return {
      symbol: null,
      xchTarget: DI.get("offlineStorage").get(USER_EXCHANGE_TYPE, 'BUY')
    }
  },
  computed: {
    headerTitle() {
      return DI.get('utils').getPairFromSymbol(this.symbol)
    }
  },
  watch: {
    $route() {
      this.initPage()
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      const symbol = this.$route.params.symbol
      this.symbol = symbol
      DI.get('store').dispatch('SYNC_PAIR_BY_NAME', { name: this.symbol })
    },
    updateXchTarget(target) {
      this.xchTarget = target
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;

.exchange {
  min-height: calc(100vh);
  background-color: #f1f2f4;
  .box {
    padding: 20px 30px;
    background-color: #fff;
    margin-bottom: 10px;
    &.pair-price {
      padding: 6px 30px;
    }
    &.orderbook-box {
      padding: 20px;
    }
  }
}
</style>
