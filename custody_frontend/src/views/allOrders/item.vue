<template>
  <div
    :class="{ canceled: item.status === 'canceled' }"
    class="order-list touch"
    @click="goToOrder"
  >
    <div class="flex">
      <div
        v-if="getItemType() === 'bibi'"
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
          v-if="getItemType() === 'normal'"
          :src="getIconUrl(item.base_currency.name)"
        >
        <img
          v-if="['red', 'redReceive'].indexOf(getItemType()) > -1"
          src="../../assets/images/icon24.png"
        >
        <img
          v-if="getItemType() === 'regular_investing'"
          src="../../assets/images/icon32.png"
        >
      </div>
      <div>
        <span class="bl left-top">
          <template v-if="getItemType() === 'normal'">
            {{ item.side === "sell" ? "出售" : "购买" }} {{ item.amount }}
            {{ item.base_currency && item.base_currency.name }}
          </template>
          <template v-if="getItemType() === 'bibi'">
            {{ item.side === "buy" ? $t('buy') : $t('sell') }}
            {{ item.base_currency.amount }}
            {{ item.base_currency.name }}
          </template>
          <template v-if="getItemType() === 'red'">
            发红包 {{ item.amount }} {{ item.currency }}
          </template>
          <template v-if="getItemType() === 'redReceive'">
            收红包 {{ item.amount }} {{ item.currency }}
          </template>
          <template v-if="getItemType() === 'regular_investing'">
            买入定投
          </template>
        </span>
        <span class="font12 graycolor mt5 bl">
          {{ $dayjs.unix(item.created_at).format("MM月DD日 HH:mm:ss") }}
        </span>
      </div>
    </div>
    <div class="tr">
      <span
        v-if="getItemType() === 'normal' || getItemType() === 'regular_investing'"
        class="bl right-top"
      >
        ¥{{ item.quote_currency && item.quote_currency.amount }}
      </span>
      <span
        v-if="getItemType() === 'bibi'"
        class="bl right-top"
      >
        {{ item.quote_currency.amount }}{{ item.quote_currency.name }}
      </span>
      <span
        v-if="['red', 'redReceive'].indexOf(getItemType()) > -1"
        class="bl right-top"
      >
        {{ displaySymbol(item) }}¥{{ item.cny_amount }}
      </span>
      <template v-if="getItemType() === 'normal'|| getItemType() === 'regular_investing'">
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
          {{ $t("tobepaid") }}
          <CountDownMinute :time="calCountDownTime(item)" />
        </span>
        <span
          v-else
          class="font12 graycolor mt5 bl"
        >
          {{ getOrderStatus(item.status) }}
        </span>
      </template>
      <template v-if="getItemType() === 'bibi'">
        <span
          :class="[
            'font12 graycolor mt5 bl status',
            item.status === 'buy_currency_success' && 'success',
            item.status === 'partial_filled' && 'process'
          ]"
        >
          {{ humanizeByName("EXCHANGE_ORDER_STATUS", item.status) }}
        </span>
      </template>
      <template v-if="['red', 'redReceive'].indexOf(getItemType()) > -1">
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
          {{ item.status_cn || "已领取" }}
        </span>
      </template>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { CountDownMinute } from "components"

export default {
  components: {
    CountDownMinute
  },
  props: {
    item: Object,
    parentList: {
      type: String,
      default: 'orderList'
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    }
  },
  methods: {
    displaySymbol(item) {
      if (item.type && item.type === "red_packet") {
        return "- "
      }
      return ""
    },
    getIconUrl(target) {
      return this.biInfo &&
        this.biInfo[target] &&
        !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get("BI_LOCAL_ICON")[target]
    },
    getOrderStatus(status) {
      if (status === "buy_currency_success" && this.$template === "cobo") {
        return "已转入 Cobo 钱包"
      }
      return this.humanizeByName("ORDER_STATUS", status)
    },
    getItemType() {
      const item = this.item
      if (item.type && item.type === "red_packet") {
        return "red"
      }
      if (item.type && item.type === "red_packet_receiver") {
        return "redReceive"
      }
      if (
        item.type &&
        (item.type === "bibi_order" || item.type === "bibi_limit_order")
      ) {
        return "bibi"
      }
      if (item.tag) return item.tag
      return "normal"
    },
    humanizeByName(constant, value) {
      return DI.get("utils").humanizeByName(constant, value)
    },
    calCountDownTime(item) {
      return this.$dayjs
        .unix(item.created_at)
        .add(15, "m")
        .diff(this.$dayjs(), "s")
    },
    displaySellStatus(status) {
      if (status === "open") return "进行中"
      if (status === "buy_currency_success") return "已转账"
      return "已取消"
    },
    goToOrder() {
      const item = this.item
      const type = this.getItemType()
      if (type === "bibi") {
        this.$router.push({
          name: "exchangeOrderDetail",
          params: { ...item, id: item.order_id }
        })
        return
      }
      if (type === "red") {
        this.$router.push({
          name: "redEnvelopePoster",
          query: {
            id: item.identifier
          }
        })
        return
      }
      if (type === "redReceive") {
        return
      }
      const { status, side } = item
      let name = "orderDetail"
      if (status === "open") {
        name = "orderAlipay"
      }
      if (side === "sell") {
        name = "sellDetail"
      }
      this.$router.push({
        name: name,
        query: {
          id: item.order_id,
          from: this.parentList
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.order-list {
  display: flex;
  justify-content: space-between;
  padding: 13px 20px;
  border-bottom: 0.5px solid #eee;

  &.canceled {
    background: #fafafa;
    border-color: #f6f6f6;
    & img {
      filter: grayscale(100%);
    }
    div {
      opacity: 0.6;
    }
    .tr span {
      color: #7a7a7a;
    }
  }

  .bl {
    display: block;
  }

  .left-top,
  .right-top {
    font-size: 16px;
    height: 21px;
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
  .status {
    &.process {
      color: #ffa500;
    }
    &.success {
      color: #36d58f;
    }
    &.canceled {
      color: rgba(34, 34, 34, 0.3);
    }
  }
}
</style>
