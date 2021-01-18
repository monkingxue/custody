<template>
  <div>
    <div
      id="order-panel"
      class="xch-tab"
    >
      <div
        :class="['xch-tab-left', { active: xchTarget === 'BUY' }]"
        @click="() => onSwitchTargetClick('BUY')"
      >
        <span>{{ $t('buy') }}</span>
      </div>
      <div
        :class="['xch-tab-right', { active: xchTarget === 'SELL' }]"
        @click="() => onSwitchTargetClick('SELL')"
      >
        <span>{{ $t('sell') }}</span>
      </div>
    </div>
    <div class="xch-form">
      <div class="tips-line xch-type-box">
        <div class="xch-type">
          <div
            class="bg-cur"
            :style="{transform: `translateX(${isLimitType ? 56 : 1}px)`}"
          />
          <span
            :class="['pr20', (!isSupportLimit || xchType === 'MARKET') && 'xch-type-cur']"
            @click="() => onSwitchTypeClick('MARKET')"
          >
            {{ $t('marketPrice') }}
          </span>
          <span
            :class="[isLimitType && 'xch-type-cur']"
            @click="() => onSwitchTypeClick('LIMIT')"
          >
            {{ $t('limitPrice') }}
          </span>
          <img
            v-if="!isSupportLimit"
            src="../../assets/images/icon18.png"
            width="16"
            height="16"
          >
        </div>
        <div>
          <span>
            {{ $t('fee') }}:
            <span v-if="serviceFee >= 0">{{ serviceFee }}%</span>
          </span>
          <span
            class="commend"
            @click="onGoToVIP"
          >
            VIP{{ account.credit_vip_level }}
          </span>
        </div>
      </div>
      <div
        v-if="isLimitType"
        class="comm-inputcon bu-input exchange-input din mb20"
      >
        <span class="graycolor">{{ $t('price') }}</span>
        <van-field
          v-model="limitPrice"
          type="number"
          size="large"
          input-align="center"
          :maxlength="maxPricelen"
          :placeholder="pricePlaceholder"
          @focus="()=> pricePlaceholder = '' "
          @blur="()=> pricePlaceholder = '0.00' "
        />
        <span class="graycolor unit">{{ storePairItem.quote }}</span>
      </div>
      <div class="comm-inputcon bu-input exchange-input din">
        <span class="graycolor">{{ $t('amount') }}</span>
        <van-field
          v-model="amount"
          type="number"
          size="large"
          input-align="center"
          :maxlength="maxAmountlen"
          :placeholder="amountPlaceholder"
          @focus="()=> amountPlaceholder = '' "
          @blur="()=> amountPlaceholder = '0.00' "
          @click="amountPercentCur=''"
        />
        <span class="graycolor unit">{{ storePairItem.base }}</span>
      </div>
      <div :class="['percent-slider', isXchTargetBuy ? 'green' : 'orange']">
        <vue-slider
          v-model="percentVal"
          :marks="[0, 25, 50, 75, 100]"
          :adsorb="true"
          :hide-label="true"
          :tooltip="'always'"
          :tooltip-placement="'top'"
          :label="false"
          :process-style="{backgroundColor: isXchTargetBuy ? '#36d58f' : '#ff654c'}"
          :dot-style="{
            backgroundColor: isXchTargetBuy ? '#36d58f' : '#ff654c',
            boxShadow: 'none'
          }"
          @change="fillAmount"
        >
          <template v-slot:step="{ active }">
            <div :class="['custom-step', { active }]" />
          </template>
          <template v-slot:tooltip="{ value }">
            <div class="custom-tooltip">
              {{ value }}%
            </div>
          </template>
        </vue-slider>
      </div>

      <div class="tips-line tips-fee">
        <div
          v-if="isAuthenticated"
          @click="() => fillAmount(100, true)"
        >
          {{ $t('available') }}: {{ sourceBalance }}
          {{ isXchTargetBuy ? storePairItem.quote : storePairItem.base }}
        </div>
        <div v-else>
          --
        </div>
        <div>{{ $t('amount') }}: {{ getTransactionAmount }} {{ storePairItem.quote }}</div>
      </div>
      <div class="rel">
        <van-button
          :class="['img-btn-dark', isXchTargetBuy ? 'btn-green' : 'btn-orange']"
          :disabled="isProcessing"
          :loading="isProcessing"
          size="large"
          round
          loading-type="spinner"
          loading-text=""
          @click="placeOrder"
        >
          <span>
            {{ isXchTargetBuy ? `${$t('buy')} ${storePairItem.base || ""}` : `${$t('sell')} ${storePairItem.base || ""}` }}
          </span>
        </van-button>
      </div>
    </div>
    <PopUp
      ref="popup"
      title="温馨提醒"
      :hide-btn="true"
    >
      <div>
        <p style="font-size:16px;text-align:center">
          {{ notEnoughCoin }}余额不足，无法完成交易
        </p>
        <van-button
          :class="['img-btn-dark', 'orange-btn', 'mt30']"
          size="large"
          round
          @click="onGoToFiat"
        >
          去购买
        </van-button>
        <van-button
          :class="['img-btn-dark', 'white-btn', 'mt20']"
          size="large"
          round
          @click="onCloseOTCPopup"
        >
          取消
        </van-button>
      </div>
    </PopUp>
  </div>
</template>
<script>
import { DI } from "core"
import { Message, PopUp } from "components"
import { Toast, Dialog } from "vant"
import depth from "../orderbook/depth"
import VueSlider from "vue-slider-component"
import VueScrollTo from "vue-scrollto"
import "vue-slider-component/theme/default.css"

const USER_EXCHANGE_TYPE = "USER_EXCHANGE_TYPE"
const USER_EXCHANGE_METHOD = "USER_EXCHANGE_METHOD"

export default {
  components: {
    VueSlider,
    PopUp
  },
  mixins: [depth],
  props: {
    symbol: {
      type: String
    }
  },
  data() {
    return {
      pairPriceInfo: {},
      amount: "",
      amountPlaceholder: "0.00",
      pricePlaceholder: "0.00",

      xchTarget: DI.get("offlineStorage").get(USER_EXCHANGE_TYPE, 'BUY'),
      percentVal: 0,
      isProcessing: false,

      limitPrice: "",
      xchType: DI.get("offlineStorage").get(USER_EXCHANGE_METHOD, 'MARKET')
    }
  },
  computed: {
    setting() {
      return DI.get("store").state.setting.setting
    },
    serviceFee() {
      // trade_fee * 会员折扣 + exchange fee
      const discount = this.setting[
        `vip_bibi_offer.level_${this.account.credit_vip_level}`
      ]
      if (!discount) return "-"
      return +(
        ((this.storePairItem.trade_fee * discount) / 100 +
          this.storePairItem.exchange_trade_fee) *
        100
      ).toFixed(3)
    },
    account() {
      return DI.get("auth").getUser()
    },
    isAuthenticated() {
      return DI.get("auth").isAuthenticated()
    },
    isXchTargetBuy() {
      return this.xchTarget === "BUY"
    },
    isSupportLimit() {
      return this.storePairItem.support_limit_order
    },
    isLimitType() {
      return this.isSupportLimit && this.xchType === "LIMIT"
    },
    sourceBalance() {
      const availableBalance = this.isXchTargetBuy
        ? this.account.available_balance[this.storePairItem.quote]
        : this.account.available_balance[this.storePairItem.base]
      return availableBalance && !isNaN(availableBalance) ? availableBalance : 0
    },
    buyPrice() {
      if (this.asksData && this.asksData.length && this.asksData[0].length) {
        return this.asksData[0][0]
      }
      return ""
    },
    sellPrice() {
      if (this.bidsData && this.bidsData.length && this.bidsData[0].length) {
        return this.bidsData[0][0]
      }
      return ""
    },
    exchangePrice() {
      return this.isXchTargetBuy ? this.buyPrice : this.sellPrice
    },
    maxAmount() {
      const price = this.isLimitType ? this.limitPrice : this.exchangePrice
      const balance = this.isXchTargetBuy
        ? DI.get("filters").strip(
          this.sourceBalance / ((1 + this.serviceFee / 100) * price),
          this.amountDigits
        )
        : this.sourceBalance

      return balance && !isNaN(balance) ? DI.get("filters").cutNumber(balance || 0, this.amountDigits) : 0
    },
    minTransaction() {
      // strange field: bibi_order_min_volume.btc
      return this.setting[`bibi_order_min_volume.${this.storePairItem.quote.toLowerCase()}`]
    },
    notEnoughCoin() {
      return this.isXchTargetBuy ? this.storePairItem.quote : this.storePairItem.base
    },
    errMsg() {
      if (this.isLimitType && !this.limitPrice) {
        return `请输入${this.isXchTargetBuy ? '买入' : '卖出'}价格`
      }
      if (!this.amount) {
        return `请输入${this.isXchTargetBuy ? '买入' : '卖出'}数量`
      }
      if (!this.sourceBalance || +this.amount > +this.maxAmount ) {
        return `${this.notEnoughCoin}余额不足`
      }
      if (+this.getTransactionAmount < this.minTransaction) {
        return `最低下单: ${this.minTransaction} ${this.storePairItem.quote}`
      }
      // if (+this.getTransactionAmount > +this.storePairItem.max_volume) {
      //   return "超出最大下单限额"
      // }
      return ""
    },
    getTransactionAmount() {
      // 1. 买入的交易额 = 卖1价格*交易量*（1+fee）
      // 2. 卖出的交易额 = orderbook买1价格 * 交易量 *(1-fee)
      let xchPrice
      if (this.isLimitType) {
        xchPrice = this.limitPrice
      } else {
        xchPrice = this.exchangePrice
      }
      if (this.isXchTargetBuy) {
        return this.amount && xchPrice
          ? this.ceilNumber(
            this.amount * xchPrice * (1 + this.serviceFee / 100),
            this.priceDigits
          )
          : "0"
      } else {
        return this.amount && xchPrice
          ? DI.get("filters").cutNumber(
            this.amount * xchPrice * (1 - this.serviceFee / 100),
            this.priceDigits
          )
          : "0"
      }
    },
    maxPricelen() {
      // this.amountDigits
      if (this.limitPrice && this.priceDigits && (this.limitPrice.indexOf(".") > -1)) {
        const priceArr = this.limitPrice.split(".")
        return priceArr[0].length + 1 + this.priceDigits
      }
      return 10
    },
    maxAmountlen() {
      // this.amountDigits
      if (this.amount && this.amountDigits && (this.amount.indexOf(".") > -1)) {
        const amountArr = this.amount.split(".")
        return amountArr[0].length + 1 + this.amountDigits
      }
      return 10
    }
  },
  mounted() {
    DI.get("vue").$on("fill-orderbook-price", (price) => {
      this.limitPrice = price
    })
  },
  methods: {
    clearInput() {
      this.amount = ""
      this.limitPrice = ""
    },
    ceilNumber(number, digits) {
      return (Math.ceil(number * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)
    },
    /**
    showMarketTips() {
      Dialog.alert({
        title: '市价单交易规则',
        messageAlign: "left",
        className: "tipsMessage",
        message: `市价单是指以目前市场可获得的最优价格进行快速买进或卖出的订单。
当市场上最便宜的订单不足以满足您全部的市价单的需求单量，市价单会以次优价格继续成交。
这就是为什么市价单有可能需要支付更高价格来完成设定的交易量。`,
        confirmButtonText: "好的"
      })
    },
    */
    notSupportLimitTips() {
      const symbol = DI.get('utils').getPairFromSymbol(this.symbol)
      Dialog.alert({
        message: `${symbol} 暂不支持限价单`,
        confirmButtonText: "好的"
      })
    },
    onSwitchTargetClick(target) {
      if (this.xchTarget === target) {
        return
      }

      DI.get("offlineStorage").set(USER_EXCHANGE_TYPE, target)
      this.xchTarget = target
      this.$emit('updateTarget', target)
      this.percentVal = 0
      this.amount = ""
    },
    onSwitchTypeClick(type) {
      if (type === "LIMIT" && !this.isSupportLimit) {
        this.notSupportLimitTips()
      }
      if (this.xchType === type) {
        return
      }

      DI.get("offlineStorage").set(USER_EXCHANGE_METHOD, type)
      this.xchType = type
      this.percentVal = 0
      this.amount = ""
    },
    fillAmount(percentVal, full = false) {
      if (full) {
        this.percentVal = percentVal
      }
      if (this.maxAmount) {
        this.amount = String(
          DI.get("filters").getMaxDecimalNum(DI.get("filters").strip(
            (percentVal / 100) * this.maxAmount), this.amountDigits)
        )
      } else {
        this.amount = 0
      }
    },
    placeOrder() {
      if (!this.account.identity) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      if (this.errMsg) {
        if (this.errMsg.indexOf('余额不足') > -1 && ['BTC', 'ETH', 'USDT'].indexOf(this.notEnoughCoin) > -1) {
          this.$refs.popup.onOpen()
          return
        }
        Message(this.errMsg)
        return
      }

      this.isProcessing = true

      VueScrollTo.scrollTo('#order-panel', 600, {
        easing: "ease-in-out",
        offset: -100,
        x: false,
        y: true
      })

      if (this.isLimitType) {
        this.placeLimitOrder()
      } else {
        this.placeExchangeOrder()
      }
    },
    placeLimitOrder() {
      DI.get("pairHttp")
        .placeLimitOrder({
          symbol: this.symbol,
          side: this.xchTarget.toLowerCase(),
          amount: Number(this.amount),
          price: Number(this.limitPrice)
        })
        .then(() => {
          Toast.success("委托成功")
          this.clearInput()
          DI.get('vue').$emit('update-orderlist-polling')
        })
        .catch((message) => {
          Toast.fail(message.message || message)
        })
        .then(() => {
          this.isProcessing = false
        })
    },
    placeExchangeOrder() {
      const orderAmount = this.isXchTargetBuy
        ? Number(this.getTransactionAmount)
        : Number(this.amount)

      DI.get("pairHttp")
        .placeExchangeOrder({
          symbol: this.symbol,
          side: this.xchTarget.toLowerCase(),
          amount: orderAmount
        })
        .then(() => {
          Toast.success("委托成功")
          this.clearInput()
          DI.get('vue').$emit('update-orderlist-polling')
        })
        .catch((message) => {
          Toast.fail(message.message || message)
        })
        .then(() => {
          this.isProcessing = false
        })
    },
    onGoToVIP() {
      this.$router.push({
        name: "vip"
      })
    },
    onCloseOTCPopup() {
      this.$refs.popup.onClose()
    },
    onGoToFiat() {
      this.$router.push({
        name: "buy",
        query: {
          coin: this.notEnoughCoin,
          target: 'BUY'
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
.xch-tab {
  display: flex;
  margin-bottom: 20px;

  & > div {
    width: 50%;
    height: 0;
    position: relative;

    span {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      text-align: center;
      color: #222;
      font-size: 16px;
      height: 38px;
      line-height: 38px;
    }
  }

  .xch-tab-left {
    border-top: 38px solid #f5f5f5;
    border-right: 19px solid transparent;
    span {
      top: -38px;
    }

    &.active {
      border-top-color: @green;
    }
  }
  .xch-tab-right {
    border-bottom: 38px solid #f5f5f5;
    border-left: 19px solid transparent;
    margin-left: -3.5%;
    &.active {
      border-bottom-color: @orange;
    }
  }

  .active span {
    color: #fff;
    font-weight: bold;
  }
}

.xch-form {
  .commend {
    font-size: 12px;
    font-weight: bold;
    background: #fef4e8;
    padding: 1px 5px;
    border-radius: 4px;
    color: #F7931A;
  }

  .bu-input {
    align-items: center;
    .unit {
      display: inline-block;
      min-width: 40px;
      text-align: right;
    }
  }

  .percent-slider{
    padding: 25px 5px 0;
    .custom-tooltip{
      font-size: 12px;
      margin-bottom: -8px;
    }
    .custom-step {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-shadow: 0 0 0 3px #ccc;
      background-color: #fff;
    }
    &.green{
      .custom-tooltip{
        color: @green;
      }
      .custom-step.active {
        box-shadow: 0 0 0 3px @green;
        background-color: @green;
      }
    }
    &.orange{
      .custom-tooltip{
        color: @orange;
      }
      .custom-step.active {
        box-shadow: 0 0 0 3px @orange;
        background-color: @orange;
      }
    }
  }

  .tips-line {
    margin: 10px 0;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(34, 34, 34, 0.3);
  }
  .xch-type-box {
    margin-bottom: 20px;
    .xch-type {
      font-size: 16px;
      background-color: #F1F2F4;
      height: 28px;
      border-radius: 15px;
      color:rgba(34, 34, 34, 0.3);
      padding: 1px;
      position: relative;
      display: flex;
      align-items: center;
      span {
        position: relative;
        z-index: 2;
        padding: 0 12px;
        width: 32px;
      }
      .xch-type-cur {
        color: #222;
        font-weight: 600;
      }
      .bg-cur {
        width: 50%;
        height: 28px;
        position: absolute;
        left: 0;
        top: 1px;
        background-color: #fff;
        border-radius: 15px;
        z-index: 1;
        transition: all .1s ease-in-out;
      }
      img {
        position: absolute;
        right: -18px;
        top: 8px;
      }
    }
  }
  .btn-green,
  .btn-orange {
    border-radius: 5px;
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }
  .btn-green {
    background-color: @green;
  }
  .btn-orange {
    background-color: @orange;
  }
}
</style>
<style lang="less">
.exchange-input {
  line-height: 48px !important;
}
.exchange-input input {
  font-size: 28px !important;
  line-height: 28px !important;
  padding: 0 0;
  color: #222222 !important;
}
.exchange-input input::-webkit-input-placeholder {
  line-height: normal !important;
}
/* placeholder */
.exchange-placeholder-wrapper {
  position: absolute;
  height: 250px;
  z-index: 99;

  .exchange-placeholder {
    width: 363px;
  }
}
</style>
