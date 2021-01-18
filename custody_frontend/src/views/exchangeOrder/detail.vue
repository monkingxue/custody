<template>
  <div
    v-if="detail.symbol"
    class="container exchange-detail"
  >
    <div class="top-symbol">
      <div class="symbol">
        {{ String(detail.symbol).replace('_', ' / ') }}
      </div>
      <div>
        <span
          v-if="detail.side === 'buy'"
          class="label green"
        >{{ $t('buy') }}</span>
        <span
          v-if="detail.side === 'sell'"
          class="label orange"
        >{{ $t('sell') }}</span>
      </div>
    </div>
    <div class="detail-list">
      <div class="list-item">
        <div class="left">
          {{ $t('type') }}
        </div>
        <div class="right">
          {{ detail.type === 'bibi_limit_order' ? $t('limitOrder') : $t('marketOrder') }}
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          {{ $t('commissionAmount') }}
        </div>
        <div class="right">
          {{ detail.base_currency.amount }}
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          {{ $t('filledAmount') }}
        </div>
        <div
          v-if="detail.status === 'buy_currency_success'"
          class="right"
        >
          {{ detail.base_currency.amount }}
        </div>
        <div
          v-else-if="detail.status === 'partial_filled'"
          class="right"
        >
          {{ detail.filled_detail && detail.filled_detail.filled ? detail.filled_detail.filled : '' }}
        </div>
        <div
          v-else
          class="right"
        >
          0
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          {{ $t('price') }}
        </div>
        <div class="right">
          {{ detail.price }}
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          {{ $t('turnover') }}
        </div>
        <div class="right">
          {{ `${detail.quote_currency.amount} ${detail.quote_currency.name}` }}
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          {{ $t('orderStatus') }}
        </div>
        <div
          :class="['right status', statusClass]"
        >
          {{ humanizeByName('EXCHANGE_ORDER_STATUS', detail.status) }}
        </div>
      </div>
      <div class="line" />
      <div class="list-item">
        <div class="left">
          {{ $t('fee') }}{{ serviceFee }}
        </div>
        <div class="right">
          {{ detail.fee_amount }} {{ detail.fee_currency }}
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          {{ $t('orderSource') }}
        </div>
        <div class="right exchange">
          <img
            v-if="otcInfo"
            class="otc-icon"
            :src="otcInfo"
          >
          <span>{{ detail.exchange }}</span>
        </div>
      </div>
      <div class="list-item">
        <div class="left">
          {{ $t('tradeTime') }}
        </div>
        <div class="right">
          {{ detail.create_time }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Indicator, Message } from "components"

export default {
  data() {
    return {
      detail: {
        amount: "",
        base_currency: {
          amount: "",
          name: ""
        },
        quote_currency: {
          amount: "",
          name: ""
        }
      }
    }
  },
  computed: {
    setting() {
      return DI.get("store").state.setting.setting
    },
    account() {
      return DI.get("auth").getUser()
    },
    storePairItem() {
      return DI.get("store").state.pair.pairItem
    },
    serviceFee() {
      // trade_fee * 会员折扣 + exchange fee
      const discount = this.setting[
        `vip_bibi_offer.level_${this.account.credit_vip_level}`
      ]
      if (!discount) return ""
      if (
        this.storePairItem.trade_fee &&
        this.storePairItem.exchange_trade_fee
      ) {
        const fee =
          (this.storePairItem.trade_fee * discount) / 100 +
          this.storePairItem.exchange_trade_fee
        return `(${+(fee * 100).toFixed(3)}%)`
      }
      return ""
    },
    otcInfo() {
      const otc = DI.get('OTC_INFO')[String(this.detail.exchange).toLowerCase()]
      if (otc) return otc.icon
      return null
    },
    isBuy() {
      return this.detail.side === "buy"
    },
    statusClass() {
      if (this.detail.status === 'partial_filled') {
        return 'process'
      } else if (this.detail.status === 'buy_currency_success') {
        return 'success'
      } else {
        return 'canceled'
      }
    }
  },
  mounted() {
    DI.get("utils").setTitle(this.$t('orderDetail'))
    const { params } = this.$route
    if (!params.id) {
      Message(this.$t('orderIdError'))
      return
    }

    this.orderId = params.id
    if (params.order_id) {
      this.detail = params
    } else {
      Indicator.open(this.$t("loading"))
    }
    this.getOrderDetail()
  },
  methods: {
    humanizeByName(constant, value) {
      return DI.get('utils').humanizeByName(constant, value)
    },
    getOrderDetail() {
      DI.get("orderHttp")
        .getOrderDetailById(this.orderId)
        .then(res => {
          this.detail = res
          DI.get('store').dispatch('SYNC_PAIR_BY_NAME', { name: res.symbol })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    }
  }
}
</script>
<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
.exchange-detail {
  min-height: calc(100vh - 44px);
  .top-symbol {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    .symbol {
      font-size: 28px;
      color: #222222;
      text-align: center;
    }
  }
  .detail-list {
    padding: 0 20px;
    .otc-icon {
      height: 20px;
      width: 20;
      margin-right: 5px;
    }
    .list-item {
      padding: 5px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #7a7a7a;
    }
    .exchange {
      display: flex;
      align-items: center;
    }
    .line {
      border-top: 1px solid #eee;
      margin: 20px 0;
    }
  }
  .label {
    font-size: 14px;
    padding: 3px 4px;
    border-radius: 1px;
    margin-left: 10px;

    &.green {
      background-color: #eafaf3;
      color: @green;
    }
    &.orange {
      background-color: #ffefed;
      color: @orange;
    }
  }
  .status {
    &.process {
      color: #ffa500;
    }
    &.success {
      color: @green;
    }
    &.canceled {
      color: rgba(34, 34, 34, 0.3);
    }
  }
}
</style>
