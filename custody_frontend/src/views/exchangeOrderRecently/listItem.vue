<template>
  <div
    v-if="!(cancelOrderIds.indexOf(order.order_id) > -1 && isOpenOrders)"
    class="order-item touch din"
    @click="goToOrder"
  >
    <!-- bibi limit open orders -->
    <div v-if="order.type === 'bibi_limit_order' && isOpenOrders">
      <div class="order-line">
        <div>
          <span class="o-type">
            {{ order.side === 'buy' ? $t('buy') : $t('sell') }}{{ order.base_currency.name }}
          </span>
          <span>{{ order.create_time }}</span>
        </div>
        <!-- limit order: open & pending & partial_filled -->
        <div
          class="o-status link"
          @click="cancelLimitOrder"
        >
          {{ $t('revoke') }}
        </div>
      </div>
      <div class="order-line order-title">
        <span>{{ $t('commissionPrice') }}({{ order.quote_currency.name }})</span>
        <span>{{ $t('commissionAmount') }}({{ order.base_currency.name }})</span>
        <span>{{ $t('transactionProgress') }}(%)</span>
      </div>
      <div class="order-line order-number">
        <span>{{ order.price }}</span>
        <span>{{ order.base_currency.amount }}</span>
        <span>{{ order.filled_detail && order.filled_detail.progress_rate ? order.filled_detail.progress_rate : 0 }}</span>
      </div>
    </div>

    <!-- bibi limit order history -->
    <div v-else-if="order.type === 'bibi_limit_order' && !isOpenOrders">
      <div class="order-line">
        <div>
          <span class="o-type">
            {{ order.side === 'buy' ? $t('buy') : $t('sell') }}{{ order.base_currency.name }}
          </span>
          <span>{{ order.create_time }}</span>
        </div>
        <!-- 完全成交 -->
        <div
          v-if="order.status === 'buy_currency_success'"
          class="o-status success"
        >
          <van-icon name="success" />
          {{ humanizeByName(order.status) }}
        </div>
        <!-- 部分成交 -->
        <div
          v-else-if="order.status === 'partial_filled'"
          class="o-status process"
        >
          {{ humanizeByName(order.status) }}
        </div>

        <!-- 失败 & 取消 -->
        <div
          v-else
          class="o-status canceled"
        >
          {{ humanizeByName(order.status) }}
        </div>
      </div>
      <div class="order-line order-title">
        <span>{{ $t('averagePrice') }}({{ order.quote_currency.name }})</span>
        <span>{{ $t('filledAmount') }}({{ order.base_currency.name }})</span>
        <span>{{ $t('turnover') }}({{ order.quote_currency.name }})</span>
      </div>
      <div class="order-line order-number">
        <span>
          {{ order.price }}
        </span>
        <span>
          {{ order.base_currency.amount }}
        </span>
        <span v-if="order.status === 'buy_currency_success'">
          {{ order.quote_currency.amount }}
        </span>
        <span v-else-if="order.status === 'partial_filled'">
          {{ order.filled_detail && order.filled_detail.progress_rate ? order.filled_detail.progress_rate : 0 }}
        </span>
        <span v-else>
          0
        </span>
      </div>
    </div>

    <!-- bibi market order -->
    <div v-else-if="order.type === 'bibi_order'">
      <div class="order-line">
        <div>
          <span class="o-type">
            {{ order.side === 'buy' ? $t('buy') : $t('sell') }}{{ order.base_currency.name }}
          </span>
          <span>{{ order.create_time }}</span>
        </div>

        <!-- 已取消 -->
        <div
          v-if="order.status === 'canceled' || order.status === 'buy_currency_fail'"
          class="o-status canceled"
        >
          {{ humanizeByName(order.status) }}
        </div>

        <!-- 已完成 -->
        <div
          v-else-if="order.status === 'buy_currency_success'"
          class="o-status success"
        >
          <van-icon name="success" />
          {{ humanizeByName(order.status) }}
        </div>

        <!-- 其它 -->
        <div
          v-else
          class="o-status process"
        >
          <van-loading
            size="12px"
            color="#ff654c"
          />
          {{ humanizeByName(order.status) }}
        </div>
      </div>
      <div
        v-if="isOpenOrders"
        class="order-line order-title"
      >
        <span>{{ $t('commissionPrice') }}({{ order.quote_currency.name }})</span>
        <span>{{ $t('commissionAmount') }}({{ order.base_currency.name }})</span>
        <span>{{ $t('transactionProgress') }}(%)</span>
      </div>
      <div
        v-else
        class="order-line order-title"
      >
        <span>{{ $t('averagePrice') }}({{ order.quote_currency.name }})</span>
        <span>{{ $t('filledAmount') }}({{ order.base_currency.name }})</span>
        <span>{{ $t('turnover') }}({{ order.quote_currency.name }})</span>
      </div>
      <div class="order-line order-number">
        <span v-if="order.status !== 'open'">
          {{ order.price }}
        </span>
        <span
          v-else
          style="height:16px"
        >
          <content-loader
            :width="50"
            :height="16"
            :speed="2"
            primary-color="#f3f3f3"
            secondary-color="#ecebeb"
          >
            <rect
              x="0"
              y="0"
              rx="3"
              ry="3"
              width="20"
              height="7"
            />
          </content-loader>
        </span>
        <span v-if="order.status !== 'open'">
          {{ order.base_currency.amount }}
        </span>
        <span
          v-else
          style="height:16px"
        >
          <content-loader
            :width="50"
            :height="16"
            :speed="2"
            primary-color="#f3f3f3"
            secondary-color="#ecebeb"
          >
            <rect
              x="30"
              y="0"
              rx="3"
              ry="3"
              width="20"
              height="7"
            />
          </content-loader>
        </span>
        <span v-if="order.status !== 'open' && isOpenOrders">
          100%
        </span>
        <span v-else-if="order.status !== 'open'">
          {{ order.quote_currency.amount }}
        </span>
        <span
          v-else
          style="height:16px"
        >
          <content-loader
            :width="50"
            :height="16"
            :speed="2"
            primary-color="#f3f3f3"
            secondary-color="#ecebeb"
          >
            <rect
              x="30"
              y="0"
              rx="3"
              ry="3"
              width="20"
              height="7"
            />
          </content-loader>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Message } from "components"
import { ContentLoader } from "vue-content-loader"
import { Toast } from "vant"

export default {
  components: {
    ContentLoader
  },
  props: {
    order: Object,
    type: String
  },
  data() {
    return {
      cancelOrderIds: []
    }
  },
  computed: {
    isOpenOrders() {
      return this.type === 'open'
    }
  },
  methods: {
    cancelLimitOrder(ev) {
      ev.stopPropagation()
      const { order_id } = this.order
      DI.get("pairHttp")
        .cancelLimitOrder({ order_id })
        .then(() => {
          Toast.success(this.$t('canceledSuccessfully'))
          this.cancelOrderIds.push(order_id)
          DI.get('vue').$emit('update-orderlist-polling')
        })
        .catch(Message)
    },
    humanizeByName(value) {
      return DI.get('utils').humanizeByName('EXCHANGE_ORDER_STATUS', value)
    },
    goToOrder() {
      this.$router.push({
        name: "exchangeOrderDetail",
        params: { ...this.order, id: this.order.order_id }
      })
    }
  }
}
</script>

<style scoped lang="less">
@green: #36d58f;
.order-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;

  .order-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(34, 34, 34, 0.3);
    font-size: 12px;

    span {
      flex: 1 1;
      width: 0;
    }
    span:nth-child(2),
    span:last-child {
      text-align: right;
    }
  }
  .order-title {
    font-size: 10px;
    margin: 20px 0 5px;
  }
  .order-number {
    font-size: 15px;
    color: rgba(34, 34, 34, 0.6);
  }
  .o-type {
    font-size: 14px;
    margin-right: 10px;
    color: rgba(34, 34, 34, 0.6);
  }
  .o-status {
    display: flex;
    align-items: center;

    i {
      margin-right: 2px;
    }
    &.process {
      span{
        width: auto;
        margin-right: 2px;
      }
      color: #ffa500;
    }
    &.success {
      color: @green;
    }
    &.canceled {
      color: rgba(34, 34, 34, 0.3);
    }
    &.link {
      color: rgba(34, 34, 34, 0.6);
      border: 1px solid #EEE;
      padding: 0px 6px;
      height: 20px;
      line-height: 20px;
    }
  }
}
</style>
