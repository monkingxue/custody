<template>
  <div class="container-white">
    <div class="comm-list">
      <ListLoading
        v-if="!noRecord && !orderList.length"
        :placeholders-num="12"
        class="open-orders-box"
      />

      <Empty v-else-if="noRecord" />

      <div
        v-else-if="!noRecord && orderList.length && isOpenOrders"
        class="open-orders-box"
      >
        <div
          v-for="orderItem in orderList"
          :key="orderItem.order_id"
        >
          <ListItem
            :type="orderType"
            :order="orderItem"
          />
        </div>
      </div>

      <div v-else-if="!noRecord && orderList.length">
        <div
          v-for="item in orderList"
          :key="item.order_id"
          :class="{'canceled': item.status === 'canceled' || item.status === 'buy_currency_fail'}"
          class="order-list touch"
          @click="(() => {goToOrder(item)})"
        >
          <div class="order-list-item">
            <div class="xch-icon">
              <img
                class="xch-icon-base"
                :src="getIconUrl(item.base_currency.name)"
                width="22"
              >
              <img
                class="xch-icon-quote"
                :src="getIconUrl(item.quote_currency.name)"
                width="22"
              >
            </div>
            <div class="order-detail">
              <div class="line">
                <span class="bl">
                  {{ item.side === 'buy' ? $t('buy') : $t('sell') }}
                  {{ item.base_currency.amount }}
                  {{ item.base_currency.name }}
                </span>
                <span class="bl">
                  {{ item.quote_currency.amount }}
                  {{ item.quote_currency.name }}
                </span>
              </div>
              <div class="line mt5">
                <span class="font12 graycolor bl">
                  {{ $dayjs.unix(item.created_at).format('MM月DD日 HH:mm:ss') }}
                </span>
                <span
                  v-if="item.status === 'buy_currency_fail'"
                  class="font12 graycolor bl"
                >
                  交易失败
                </span>
                <span
                  v-else-if="item.status === 'canceled'"
                  class="font12 graycolor bl"
                >
                  已撤销
                </span>
                <span
                  v-else
                  class="font12 graycolor bl"
                >
                  {{ $t("averagePrice") }}
                  {{ item.price }}
                  {{ item.quote_currency.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoadMore
        v-if="orderList.length < totalCount"
        v-element-in-view="loadMore"
      />
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Empty, LoadMore, Message } from "components"
import ListLoading from "./listLoading"
import ListItem from "../exchangeOrderRecently/listItem"

const HISTORY_PAGE_NUM = 15
const DEFAULT_SYMBOL = "BTC_USDT"

export default {
  components: {
    Empty,
    ListLoading,
    ListItem,
    LoadMore
  },
  data() {
    return {
      orderType: "",
      orderList: [],
      noRecord: false,
      totalCount: 0,
      pageIndex: 1,
      loading: false,
      symbol: ""
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    isOpenOrders() {
      return this.orderType === 'open'
    }
  },
  mounted() {
    const { orderType, symbol } = this.$route.params
    this.symbol = symbol || DEFAULT_SYMBOL
    this.orderType = orderType || 'history'

    DI.get('utils').setTitle(orderType === 'open' ? '全部委托' : '历史订单')
    this.getOrderList()
  },
  methods: {
    getIconUrl(target) {
      return this.biInfo && this.biInfo[target] && !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get('BI_LOCAL_ICON')[target]
    },
    goToOrder(item) {
      this.$router.push({
        name: 'exchangeOrderDetail',
        params: { ...item, id: item.order_id }
      })
    },
    getOrderList() {
      let status = "finished"
      if (this.isOpenOrders) {
        status = "unfinished"
      }
      this.loading = true
      DI.get('pairHttp')
        .getExchangeOrders(this.pageIndex, HISTORY_PAGE_NUM, status, this.symbol, 0)
        .then((res) => {
          this.orderList = this.orderList.concat(res.orders)
          this.totalCount = res.total_length
        })
        .catch(Message)
        .then(() => {
          if (this.orderList.length === 0) {
            this.noRecord = true
          }
          this.loading = false
        })
    },
    loadMore() {
      if (this.loading) return
      this.pageIndex += 1
      this.getOrderList()
    }
  }
}
</script>
<style scoped lang="less">
.order-list {
  display:flex;
  justify-content:space-between;
  padding:13px 20px;
  border-bottom: 0.5px solid #eee;

  &.canceled {
    background: #FAFAFA;
    border-color: #F6F6F6;
    & img { filter: grayscale(100%); }
    div { opacity: .6; }
    .tr span { color: #7a7a7a; }
  }
  .order-list-item {
    display: flex;
    flex: 1 1;
  }
  .order-detail {
    flex: 1 1;
    font-size: 14px;
  }
  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.open-orders-box {
  padding: 0 30px;
}
.xch-icon {
  position: relative;
  width: 32px;
  height: 32px;
  margin-right: 8px;

  .xch-icon-base,
  .xch-icon-quote {
    position: absolute;
  }
  .xch-icon-base {
    left: 0;
    top: 0;
    z-index: 2;
  }
  .xch-icon-quote {
    right: 0;
    bottom: 0;
    z-index: 1;
  }
}
</style>
