<template>
  <div class="container-white">
    <div class="comm-list">
      <transition name="fadeOut">
        <div
          v-if="!noRecord && !orderList.length"
          class="placeholder-wrapper"
        >
          <div
            v-for="index in 12"
            :key="index"
            class="placeholder"
          >
            <content-loader
              :height="70"
              :width="300"
              :speed="2"
              primary-color="#f3f3f3"
              secondary-color="#ecebeb"
              class="svg"
            >
              <circle
                cx="32"
                cy="35"
                r="13"
              />
              <rect
                x="56"
                y="15"
                rx="9"
                ry="9"
                width="130"
                height="19"
              />
              <rect
                x="56"
                y="43"
                rx="6"
                ry="6"
                width="110"
                height="12"
              />
            </content-loader>
          </div>
        </div>
      </transition>
      <div
        v-if="noRecord"
        class="no-record"
      >
        <img
          src="../assets/images/empty.svg"
          width="60"
        >
        <span>暂无记录</span>
      </div>
      <transition name="fadeIn">
        <div
          v-if="!noRecord && orderList.length"
        >
          <div
            v-for="item in orderList"
            :key="item.order_id"
            :class="{'canceled': item.status === 'canceled'}"
            class="order-list touch"
            @click="(() => {goToOrder(item)})"
          >
            <div class="flex">
              <div
                v-if="getItemType(item) === 'bibi'"
                class="xch-icon"
              >
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
              <div
                v-else
                class="list-icon"
              >
                <img
                  v-if="getItemType(item) === 'normal'"
                  :src="getIconUrl(item.base_currency.name)"
                >
                <img
                  v-if="['red', 'redReceive'].indexOf(getItemType(item)) > -1"
                  src="../assets/images/icon24.png"
                >
              </div>
              <div>
                <span class="bl left-top">
                  <template v-if="getItemType(item) === 'normal'">
                    {{ item.side === 'sell' ? '出售' : '购买' }} {{ item.amount }} {{ item.base_currency && item.base_currency.name }}
                  </template>
                  <template v-if="getItemType(item) === 'bibi'">
                    {{ item.side === 'buy' ? '买入' : '卖出' }}
                    {{ item.base_currency.amount }}
                    {{ item.base_currency.name }}
                  </template>
                  <template v-if="getItemType(item) === 'red'">
                    发红包 {{ item.amount }} {{ item.currency }}
                  </template>
                  <template v-if="getItemType(item) === 'redReceive'">
                    收红包 {{ item.amount }} {{ item.currency }}
                  </template>
                </span>
                <span class="font12 graycolor mt5 bl">
                  {{ $dayjs.unix(item.created_at).format('MM月DD日 HH:mm:ss') }}
                </span>
              </div>
            </div>
            <div class="tr">
              <span
                v-if="getItemType(item) === 'normal'"
                class="bl right-top"
              >¥{{ item.quote_currency && item.quote_currency.amount }}</span>
              <span
                v-if="getItemType(item) === 'bibi'"
                class="bl right-top"
              >
                {{ item.quote_currency.amount }}{{ item.quote_currency.name }}
              </span>
              <span
                v-if="['red', 'redReceive'].indexOf(getItemType(item)) > -1"
                class="bl right-top"
              >{{ displaySymbol(item) }}¥{{ item.cny_amount }}</span>
              <template
                v-if="getItemType(item) === 'normal'"
              >
                <span
                  v-if="item.side === 'sell'"
                  class="font12 graycolor mt5 bl"
                >
                  {{ displaySellStatus(item.status) }}
                </span>
                <span
                  v-else-if="item.status === 'open' && calCountDownTime(item) > 0"
                  class="font12 orangecolor mt5 tr"
                >
                  {{ $t('lang.tobepaid') }}
                  <CountDownMinute
                    :time="calCountDownTime(item)"
                  />
                </span>
                <span
                  v-else
                  class="font12 graycolor mt5 bl"
                >
                  {{ getOrderStatus(item.status) }}
                </span>
              </template>
              <template v-if="getItemType(item) === 'bibi'">
                <span class="font12 graycolor mt5 bl">
                  {{ humanizeByName('EXCHANGE_ORDER_STATUS', item.status) }}
                </span>
              </template>
              <template
                v-if="['red', 'redReceive'].indexOf(getItemType(item)) > -1"
              >
                <span
                  v-if="item.status === 5"
                  class="font12 orangecolor mt5 bl"
                >
                  {{ item.status_cn }}
                </span>
                <span
                  v-else
                  class="font12 graycolor mt5 bl"
                >
                  {{ item.status_cn || '已领取' }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </transition>
      <LoadMore
        v-if="orderList.length < totalCount"
        v-element-in-view="loadMore"
      />
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Indicator, Message, CountDownMinute, LoadMore } from 'components'
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    CountDownMinute,
    ContentLoader,
    LoadMore
  },
  data() {
    return {
      orderList: [],
      noRecord: false,
      totalCount: 0,
      pageIndex: 1,
      loading: false
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('lang.orderinquiry'))
    DI.get('utils').setBackAction(() => {
      this.$router.push({ name: 'account' })
    })
    this.getOrderList()
  },
  methods: {
    displaySymbol(item) {
      if (item.type && item.type === 'red_packet') {
        return '- '
      }
      return ''
    },
    getIconUrl(target) {
      return this.biInfo && this.biInfo[target] && !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get('BI_LOCAL_ICON')[target]
    },
    getOrderStatus(status) {
      if (status === 'buy_currency_success' && this.$template === 'cobo') {
        return '已转入 Cobo 钱包'
      }
      return this.humanizeByName('ORDER_STATUS', status)
    },
    getItemType(item) {
      if (item.type && item.type === 'red_packet') {
        return 'red'
      }
      if (item.type && item.type === 'red_packet_receiver') {
        return 'redReceive'
      }
      if (item.type && item.type === 'bibi_order') {
        return 'bibi'
      }
      return 'normal'
    },
    humanizeByName(constant, value) {
      return DI.get('utils').humanizeByName(constant, value)
    },
    calCountDownTime(item) {
      return this.$dayjs.unix(item.created_at)
        .add(15, 'm')
        .diff(this.$dayjs(), 's')
    },
    displaySellStatus(status) {
      if (status === 'open') return '进行中'
      if (status === 'buy_currency_success') return '已转账'
      return '已取消'
    },
    goToOrder(item) {
      const type = this.getItemType(item)
      if (type === 'bibi') {
        this.$router.push({
          name: 'exchangeOrderDetail',
          query: {
            id: item.order_id,
            routerFrom: 'orderList'
          },
          params: item
        })
        return
      }
      if (type === 'red') {
        this.$router.push({
          name: 'redEnvelopePoster',
          query: {
            id: item.identifier
          }
        })
        return
      }
      if (type === 'redReceive') {
        return
      }
      const { status, side } = item
      let name = 'orderDetail'
      if (status === 'open') {
        name = 'orderAlipay'
      }
      if (side === 'sell') {
        name = 'sellDetail'
      }
      this.$router.push({
        name: name ,
        query: {
          id: item.order_id,
          from: 'orderList'
        }
      })
    },
    getOrderList() {
      this.loading = true
      // Indicator.open(this.$t('lang.loading'))
      DI.get('orderHttp')
        .getOrderList(this.pageIndex)
        .then((res) => {
          this.orderList = this.orderList.concat(res.orders)
          this.totalCount = res.total_length
        })
        .catch(Message)
        .then(() => {
          if (this.orderList.length === 0) {
            this.noRecord = true
          }
          Indicator.close()
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
}
.order-list .bl {
  display:block;
}
.left-top, .right-top {
  font-size: 16px;
  height: 21px;
}
.no-record {
  width: 100%;
  margin-top: 25vh;
  img {
    display: block;
    margin: 0 auto;
  }
  span {
    display: block;
    padding: 20px 0;
    color: #999;
    text-align: center;
    font-size: 15px;
  }
}
.list-icon {
  width: 25px;
  display: flex;
  align-items: center;
  margin-right: 15px;
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
