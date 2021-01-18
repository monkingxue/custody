<template>
  <div>
    <div
      v-if="!isAuthenticated"
      class="no-login"
      @click="goToLogin"
    >
      请登录查看 &gt;
    </div>
    <div
      v-else
      class="trader-content"
    >
      <div class="line">
        <span
          class="flex"
          @click="showTips"
        >
          历史盈亏&nbsp;
          <img
            src="../../assets/images/icon18.png"
            width="13"
          >
        </span>
        <div
          v-if="+tradeStat.profit_total"
          class="profit"
        >
          <span
            :class="[
              'total din',
              +tradeStat.profit_total > 0 ? 'green' : 'orange'
            ]"
          >
            {{ +tradeStat.profit_total > 0 ? "+" : "" }}
            {{ tradeStat.profit_total }}{{ tradeStat.profit_currency }}
          </span>
          <span class="fiat din">&asymp;&nbsp;&yen;{{ getFiatPrice }}</span>
        </div>
        <div
          v-else
          class="profit"
        >
          <span class="total din">--</span>
        </div>
      </div>
      <div class="line">
        <span>买入平均价格</span>
        <span>{{ avgBuyPrice ? `${avgBuyPrice} ${tradeStat.profit_currency}` : "--" }}</span>
      </div>
      <div class="line">
        <span>卖出平均价格</span>
        <span>{{ avgSellPrice ? `${avgSellPrice} ${tradeStat.profit_currency}` : "--" }}</span>
      </div>
      <div
        v-if="buyOrderPercent && sellOrderPercent"
        class="progress"
      >
        <span
          class="bg-green"
          :style="`width: ${buyOrderPercent}%`"
        />
        <span
          class="bg-orange"
          :style="`width: ${sellOrderPercent}%`"
        />
      </div>
      <div class="line label no-border">
        <span>买入总额</span>
        <span>卖出总额</span>
      </div>
      <div class="line price no-border">
        <span>
          {{
            tradeStat.buy_base_currency_total
              ? `${tradeStat.buy_base_currency_total} ${base}`
              : "--"
          }}
        </span>
        <span>
          {{
            tradeStat.sell_base_currency_total
              ? `${tradeStat.sell_base_currency_total} ${base}`
              : "--"
          }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Dialog } from "vant"
import { Message } from "components"

export default {
  props: {
    symbol: {
      type: String
    }
  },
  data() {
    return {
      base: "",
      tradeStat: {},
      loading: false,
      loaded: false
    }
  },
  computed: {
    priceDigits() {
      return this.storePairItem.price_digits
    },
    storePairItem() {
      return DI.get("store").state.pair.pairItem
    },
    account() {
      return DI.get('auth').getUser()
    },
    centerStore() {
      return DI.get("store").state.market.market
    },
    isAuthenticated() {
      return DI.get("auth").isAuthenticated()
    },
    getFiatPrice() {
      if (this.tradeStat.profit_currency) {
        const obj = this.centerStore[this.tradeStat.profit_currency] || {}
        return this.tradeStat.profit_total && obj.buy_price
          ? (this.tradeStat.profit_total * obj.buy_price).toFixed(2)
          : "--"
      }
      return "--"
    },
    avgBuyPrice() {
      return this.tradeStat.avg_buy_price && this.priceDigits
        ? DI.get("filters").cutNumber(
          this.tradeStat.avg_buy_price,
          this.priceDigits
        )
        : 0
    },
    avgSellPrice() {
      return this.tradeStat.avg_sell_price && this.priceDigits
        ? DI.get("filters").cutNumber(
          this.tradeStat.avg_sell_price,
          this.priceDigits
        )
        : 0
    },
    buyOrderPercent() {
      if (!this.tradeStat.buy_base_currency_total) {
        return ""
      }
      return (
        (this.tradeStat.buy_base_currency_total * 100) /
        (Number(this.tradeStat.buy_base_currency_total) +
          Number(this.tradeStat.sell_base_currency_total))
      )
    },
    sellOrderPercent() {
      if (!this.tradeStat.sell_base_currency_total) {
        return ""
      }
      return (
        (this.tradeStat.sell_base_currency_total * 100) /
        (Number(this.tradeStat.buy_base_currency_total) +
          Number(this.tradeStat.sell_base_currency_total))
      )
    }
  },
  watch: {
    symbol: {
      immediate: true,
      handler(val) {
        if(val && !this.loaded) {
          this.base = DI.get("utils").getBaseFromSymbol(val)
          this.getTradeStat()
        }
      }
    },
    account: {
      immediate: true,
      handler(val) {
        if(val.identity && !this.loaded) {
          this.getTradeStat()
        }
      }
    }
  },
  methods: {
    showTips() {
      Dialog.alert({
        messageAlign: "left",
        className: "tipsMessage",
        message: `按照币币交易订单成交的时间顺序，计算历史盈亏。

历史盈亏 =（卖出价 - 买入价）* 买卖共同成交数量

（注：净买入/卖出部分不计入历史盈亏计算）`,
        confirmButtonText: "好的"
      })
    },
    getTradeStat() {
      if (!this.account.identity || !this.symbol || this.loading) {
        return
      }
      this.loading = true
      DI.get("pairHttp")
        .getTradeStat(this.symbol)
        .then(res => {
          this.tradeStat = res
          if (res.profit_total && res.profit_total !== "0") {
            this.$emit('show')
          }
        })
        .catch(Message)
        .then(() => {
          this.loaded = true
          this.loading = false
        })
    },
    goToLogin() {
      this.$router.push({
        name: "login"
      })
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
.trader-content {
  font-size: 12px;
  min-height: 280px;

  .bg-green {
    background-color: @green;
  }
  .bg-orange {
    background-color: @orange;
  }
  .green {
    color: @green;
  }
  .orange {
    color: @orange;
  }
  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 58px;
    border-bottom: 1px solid #eeeeee;
    &.label {
      padding-top: 10px;
      font-weight: bold;
      height: 20px;
      border-bottom: none;
    }
    &.price {
      padding: 5px 0 20px;
      height: 20px;
      color: rgba(34, 34, 34, 0.3);
      border-bottom: none;
    }
    .flex {
      align-items: center;
    }
  }
  .profit {
    display: flex;
    flex-direction: column;
    text-align: right;
    flex: 1 1;
    .total {
      font-size: 16px;
    }
  }
  .progress {
    margin-top: 20px;
    display: flex;
    span {
      height: 10px;
    }
  }
}
.no-login {
  width: 100%;
  margin: 5vh 0;
  color: rgba(34, 34, 34, 0.6);
  text-align: center;
  font-size: 12px;
}
</style>
<style lang="less">
.tipsMessage {
  .van-dialog__message {
    font-size: 12px;
    padding: 25px 20px;
  }
}
</style>
