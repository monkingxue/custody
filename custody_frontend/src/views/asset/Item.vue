<template>
  <div
    class="transaction-item"
    @click="goToDetail"
  >
    <div class="title flex-left-right">
      <span class="name">{{ itemAction }}</span>
      <span class="amount">{{ `${itemSign}${item.amount}${item.currency}` }}</span>
    </div>
    <div class="info flex-left-right">
      <span>
        {{ $dayjs.unix(item.timestamp).format("MM月DD日 HH:mm:ss") }}
      </span>
      <span
        :class="
          item.transaction_type === 'withdraw' && item.status < 3
            ? 'process'
            : ''
        "
      >
        {{ itemStatus }}
        {{ withdrawProcess }}
      </span>
    </div>
  </div>
</template>

<script>
import { DI } from "core"

export default {
  props: {
    item: Object
  },
  data() {
    return {
      itemSign: "",
      itemAction: "",
      itemStatus: "",
      withdrawProcess: ""
    }
  },
  mounted() {
    this.initStatus()
  },
  methods: {
    initStatus() {
      const item = this.item
      /* eslint-disable */
      switch (item.transaction_type) {
        case "send_red_packet": {
          this.itemAction = "发红包"
          this.itemSign = "-"
          this.itemStatus = item.status_cn
          break
        }
        case "receive_red_packet": {
          this.itemAction = "收红包"
          this.itemSign = "+"
          this.itemStatus = "已完成"
          break
        }
        case "otc_order": {
          this.itemAction = item.extra.side === "sell" ? this.$t("sell") : this.$t("buy")
          this.itemSign = item.extra.side === "sell" ? "" : "+"
          this.itemStatus = "已完成"
          break
        }
        case "bibi_market_order":
        case "bibi_limit_order": {
          const base = DI.get("utils").getBaseFromSymbol(item.extra.symbol)
          if (base === item.currency) {
            this.itemAction =
              item.extra.side === "sell"
                ? `${this.$t("sell")}${base}`
                : `${this.$t("buy")}${base}`
            this.itemSign = item.extra.side === "buy" ? "+" : ""
          } else {
            this.itemAction =
              item.extra.side === "sell"
                ? `${this.$t("buy")}${base}`
                : `${this.$t("sell")}${base}`
            this.itemSign = item.extra.side === "buy" ? "+" : ""
          }
          this.itemStatus = "已完成"
          break
        }
        case "deposit": {
          this.itemAction = this.$t("deposit")
          this.itemSign = "+"
          this.itemStatus = "已完成"
          break
        }
        case "withdraw": {
          this.itemAction = this.$t("withdraw")
          const { status, transfer_detail } = item.extra
          this.itemStatus = DI.get("WITHDRAW_ORDER_STATUS")[status] || status
          if (status < 3 && transfer_detail.confirmedNum) {
            this.withdrawProcess = `(${transfer_detail.confirmedNum}/${transfer_detail.confirmingThreshold})`
          }
          break
        }
        case "yubibao_transaction":
        case "yubibao_contract_transaction": {
          // 相对于钱包来说 负数是买入
          const isbuy = item.amount < 0
          this.itemAction = `${isbuy ? '存入' : '转出'}余币宝`
          this.itemSign = !isbuy ? "+" : ''
          this.itemStatus = "已完成"
          break
        }
        case "rebate_order": {
          this.itemAction = "返佣订单"
          this.itemSign = "+"
          this.itemStatus = "已完成"
          break
        }
        case "bounty_task": {
          this.itemAction = "天天挖币转入"
          this.itemSign = "+"
          this.itemStatus = "已完成"
          break
        }
        case "regular_investing": {
          this.itemAction = "定投买入"
          this.itemSign = "+"
          this.itemStatus = "已完成"
          break
        }
        default: {
          this.itemAction = ""
          this.itemSign = ""
          this.itemStatus = ""
        }
      }
      /* eslint-enable */
    },
    goToDetail() {
      const item = this.item
      if (item.transaction_type === "withdraw") {
        this.$router.push({
          name: "dnwDetail",
          query: {
            id: item.transaction_id
          },
          params: item
        })
      } else if (item.transaction_type === "bibi_limit_order" || item.transaction_type === "bibi_market_order") {
        this.$router.push({
          name: "exchangeOrderDetail",
          params: {
            id: item.transaction_id
          }
        })
      } else if (item.transaction_type === "otc_order") {
        this.$router.push({
          name: "orderDetail",
          query: {
            id: item.transaction_id
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
@labelColor: rgba(34, 34, 34, 0.6);
@textColor: #222;
.transaction-item {
  padding: 15px 0 5px;
  border-bottom: 1px solid #eee;
  color: @textColor;

  .title {
    font-size: 14px;
  }
  .info {
    font-size: 12px;
    padding: 10px 0;
    color: @labelColor;
  }
  .process {
    color: #ff9b00;
  }
}
</style>
