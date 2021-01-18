<template>
  <div class="buy">
    <div class="top-logo">
      <img src="../../assets/images/cobo/logo.png">
    </div>
    <div class="buy-target">
      <ul
        ref="el_bi_list"
      >
        <li
          v-for="item in avaliableBi"
          :key="item"
          :class="[{active: item === buyTarget}, 'img-btn-dark']"
          @click="() => onTargetClick(item)"
        >
          <img
            :src="BIimgs[BI.indexOf(item)]"
            width="35"
          >
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
    <div class="bu-body rel">
      <div class="commflex top-block">
        <p class="bu-body-info">
          {{ displayBiName }}
        </p>
        <p class="bu-body-info bu-body-info-right din">
          <span>1&nbsp;{{ buyTarget }}&nbsp;≈&nbsp;</span><ScrollNumber
            :number="buyRate === 1
              ? '*' : displayBuyRate"
          /><span>元</span>
        </p>
      </div>
      <div class="comm-inputcon bu-input mt30 din">
        <span class="graycolor">{{ $t('amount') }}</span>
        <van-field
          v-model="btcNum"
          type="number"
          :maxlength="btcMaxLength"
          @focus="focusTarget = 'BTC'"
        />
        <span class="graycolor">{{ buyTarget }}</span>
      </div>
      <div class="comm-inputcon bu-input mt30 din">
        <span class="graycolor">{{ $t('amount') }}</span>
        <van-field
          v-model="cnyNum"
          type="number"
          :maxlength="cnyMaxLength"
          @focus="focusTarget = 'CNY'"
        />
        <span class="graycolor laber-for-right">{{ $t('yuan') }}</span>
      </div>
      <div class="mt30">
        <van-button
          :class="['img-btn-dark',isSwitchTargetBuy ? 'orange-btn' : 'yellow-btn']"
          size="large"
          round
          @click="placeOrder"
        >
          <img
            class="btn-lightning"
            src="../../assets/images/lightning.png"
          >
          <span>{{ isSwitchTargetBuy ? $t('buynow') : '立即出售' }}</span>
        </van-button>
        <!-- <div>
          可用余额：{{ targetBalance }} {{ buyTarget }}
        </div> -->
        <div
          :class="{'avaliable-sell-white': isSwitchTargetBuy}"
          class="avaliable-sell"
          @click="onAvaliableSellClick"
        >
          <template v-if="isAuthenticated">
            可用余额：{{ targetBalance }} {{ buyTarget }}
          </template>
          <template v-else>
            可用余额：--
          </template>
        </div>
      </div>
    </div>
    <van-dialog
      v-model="payAlertFlag"
      class="pay-dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="pay-confirm-dialog">
        <img
          src="../../assets/images/icon-paytips.png"
          width="58"
        >
        <div class="confirm-title">
          付款说明
        </div>
        <ol class="confirm-content">
          <li>付款过程包括<b>转账</b>和<b>付款</b>确认两个环节。</li>
          <li>转账：您需要通过<b>支付宝（推荐）</b>、微信或者网银，向aBTC平台的认证商家<b>转账</b>以完成付款。</li>
          <li>付款确认：转账成功后，务必回到<b>aBTC平台</b>的付款页面，点击<b>&lt;我已付款&gt;</b>，商家在收款后将会第一时间放币。</li>
        </ol>
        <button @click="gotoPay">
          我已知晓
        </button>
      </div>
      <img
        class="btn-close"
        src="../../assets/images/icon-close.png"
        width="40"
        @click="() => (payAlertFlag = false)"
      >
    </van-dialog>
  </div>
</template>
<script>
import { DI } from 'core'
import { Dialog, Notify } from 'vant'
import { Message, Indicator, ScrollNumber } from 'components'

const MAX_LENGTH = 8
const BTC = 'BTC'
const CNY = 'CNY'
const DEBUG_CODE = '996996'
export const USER_INPUT_AMOUNT = 'USER_INPUT_AMOUNT'
export const USER_INVITE_CODE = 'USER_INVITE_CODE'
export const USER_SELECT_TARGET = 'USER_SELECT_TARGET'
export const USER_SELECT_BI = 'USER_SELECT_BI'
export const PAYMENT_CONFIRM_DIALOG = 'PAYMENT_CONFIRM_DIALOG'
const coboEnableBi = ['BTC', 'EOS', 'ETH', 'BCH', 'USDT']

export default {
  components: {
    ScrollNumber
  },
  data() {
    return {
      btcNum: '0.1',
      biNum: {},
      cnyNum: 0,
      btcMaxLength: MAX_LENGTH,
      cnyMaxLength: MAX_LENGTH,
      focusTarget: BTC,
      marketTimmerId: null,
      networkErrorTimmerId: null,
      BI: DI.get('BI_TYPE'),
      BIimgs: DI.get('BI_IMG'),
      buyTarget: DI.get('offlineStorage').get(USER_SELECT_BI, BTC),
      switchTarget: DI.get('offlineStorage').get(USER_SELECT_TARGET, 'BUY'),
      initNum: DI.get('BT_INIT_BUY_NUM'),
      tabsData: [
        {
          text: '购买',
          value: 'BUY'
        },
        {
          text: '出售',
          value: 'SELL'
        }
      ],
      payAlertFlag: false
    }
  },
  computed: {
    avaliableBi() {
      return this.BI.filter(b => coboEnableBi.indexOf(b) > -1)
    },
    displayBiName() {
      return DI.get('BI_NAME')[this.buyTarget]
    },
    isSwitchTargetBuy() {
      return this.switchTarget === 'BUY'
    },
    isAuthenticated() {
      return DI.get('auth').isAuthenticated()
    },
    account() {
      return DI.get('auth').getUser()
    },
    centerStore() {
      return DI.get('store').state.market.market
    },
    marketStore() {
      return this.centerStore[this.buyTarget] || {}
    },
    buyRate() {
      return this.marketStore[
        this.isSwitchTargetBuy ? 'buy_price' : 'sell_price'] || 1
    },
    displayBuyRate() {
      return this.buyRate.toFixed(DI.get('BI_TOFIX_NUMBER')[this.buyTarget])
    },
    buyFee() {
      return this.marketStore.base_currency_fee || 0
    },
    calRate() {
      const rate = this.isSwitchTargetBuy ? 1 + this.buyFee : 1 - this.buyFee
      return this.buyRate * rate
    },
    targetBalance() {
      const targetBalance = this.account.available_balance[this.buyTarget]
      return targetBalance
        ? DI.get("filters").cutNumber(Number(targetBalance).toFixed(9), 4)
        : 0
    },
    placeOrderButtonEnable() {
      if (!this.isSwitchTargetBuy) {
        return this.buyRate !== 1 && this.btcNum <= this.account.available_balance[this.buyTarget]
      }
      return this.buyRate !== 1
    }
  },
  watch: {
    btcNum: {
      immediate: true,
      handler(val, oldVal) {
        this.updateBTCCNYInputLenght(BTC, val, oldVal)
      }
    },
    cnyNum() {
      this.updateBTCCNYInputLenght()
    },
    buyRate: {
      immediate: true,
      handler(val) {
        this.updateBTCCNYInputLenght()
        if (val === 1) {
          Indicator.open(this.$t('loading'))
        } else {
          Notify.clear()
          Indicator.close()
        }
      }
    }
  },
  mounted() {
    this.networkErrorTimmerId = setTimeout(() => {
      if (this.buyRate === 1) {
        Notify({
          message: '当前网络不可用，请检查您的网络设置',
          duration: 0
        })
      }
    }, 1000 * 10)
    this.checkInviteCode()
    this.$nextTick(() => {
      DI.get('utils').setBody('bacpurple')
      this.$refs.el_bi_list.scroll(this.BI.indexOf(this.buyTarget) * 70, 0)
    })
    this.marketTimmerId = setInterval(() => {
      DI.get('store').dispatch('SYNC_MARKET')
    }, 1000 * 3)
    const localUserInput = DI.get('offlineStorage').get(USER_INPUT_AMOUNT)
    if (localUserInput) {
      if (localUserInput.indexOf(BTC) > -1) {
        this.btcNum = localUserInput.replace(BTC, '')
      } else {
        this.focusTarget = CNY
        this.cnyNum = localUserInput.replace(CNY, '')
      }
    }
    this.getAccountStat()
    const redAmount = DI.get('offlineStorage').get('FROM_RED_ENVELOPE')
    if (redAmount) {
      Dialog.alert({
        title: '温馨提示',
        message: `您的好友已经将价值¥${redAmount}的比特币红包存入您的钱包`
      }).then(() => {
        this.$router.push({
          name: 'account'
        })
      })
      DI.get('offlineStorage').remove('FROM_RED_ENVELOPE')
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.marketTimmerId)
    clearTimeout(this.networkErrorTimmerId)
    next()
  },
  methods: {
    getAccountStat() {
      if (!this.isAuthenticated) {
        return
      }
      const confirmDialogLastTime = DI.get("offlineStorage").get(PAYMENT_CONFIRM_DIALOG)
      if(confirmDialogLastTime === "0"){
        return
      }
      DI.get("accountHttp")
        .getAccountStat()
        .then(res => {
          if (res.otc_order_buy_success_count > 0) {
            DI.get("offlineStorage").set(PAYMENT_CONFIRM_DIALOG, "0")
          }
        })
    },
    onAvaliableSellClick() {
      if (this.targetBalance) {
        this.btcNum = this.targetBalance
      }
    },
    updateBTCCNYInputLenght(target, val, oldVal) {
      if (this.focusTarget === BTC) {
        // TODO floating point issue
        this.cnyNum = (this.calRate * this.btcNum).toFixed(2)
        if (oldVal !== undefined && this.btcNum) {
          DI.get('offlineStorage').set(USER_INPUT_AMOUNT, `${BTC}${this.btcNum}`)
        }
      } else {
        this.btcNum = (this.cnyNum / this.calRate).toFixed(4)
        if (this.cnyNum && this.buyTarget === BTC) {
          if (DI.get('utils').isFromApp() && this.cnyNum === DEBUG_CODE) {
            window.location = 'onebtc://debug'
          } else {
            DI.get('offlineStorage').set(USER_INPUT_AMOUNT, `${CNY}${this.cnyNum}`)
          }
        }
      }
      this.updateInputCNYLength()
      this.updateInputBTCLength()
    },
    placeOrder() {
      const minOrder = DI.get('BI_MIN_BUY_AMOUNT')
      const maxOrder = DI.get('BI_MAX_BUY_AMOUNT')
      if (!this.account.identity) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      if (!this.isSwitchTargetBuy) {
        const isSetPassword = this.account.set_fund_password
        if (!isSetPassword) {
          Dialog.alert({
            message: '请先设置资金密码'
          }).then(() => {
            this.$router.push({ name: 'password' })
          })
          return
        }
        const minBi = minOrder[this.buyTarget]
        if (this.btcNum < minBi ) {
          Message(`最低卖出 ${minBi} ${this.buyTarget}`)
          return
        }
        if (!this.placeOrderButtonEnable) {
          Message(`${this.buyTarget} 余额不足`)
          return
        }
        this.$router.push({
          name: 'sellMethod',
          params: {
            price: this.cnyNum,
            symbol: this.buyTarget,
            amount: this.btcNum
          }
        })
        return
      }
      const minBi = minOrder[this.buyTarget]
      if (this.btcNum < minBi ) {
        Message(`最低下单 ${minBi} ${this.buyTarget}`)
        return
      }
      const maxBi = maxOrder[this.buyTarget]
      if (maxBi && this.btcNum > maxBi) {
        Message(`最多下单 ${maxBi} ${this.buyTarget}`)
        return
      }
      if (this.cnyNum > 50000 ) {
        Message('最高下单 50000 人民币')
        return
      }
      this.showPayConfirmDialog()
    },
    showPayConfirmDialog() {
      /**
       * no orders
       * no localstorage
       * localstorage > 1Day
       */
      const confirmDialogLastTime = DI.get("offlineStorage").get(PAYMENT_CONFIRM_DIALOG)
      if(confirmDialogLastTime === '0'){
        this.gotoPay('',true)
        return
      }
      if (!confirmDialogLastTime){
        this.payAlertFlag = true
        return
      } else if(this.$dayjs().diff(this.$dayjs(+confirmDialogLastTime), 'h') > 24) {
        this.payAlertFlag = true
        return
      }
      this.gotoPay()
    },
    gotoPay(ev, skip) {
      if(!skip) {
        DI.get("offlineStorage").set(PAYMENT_CONFIRM_DIALOG, Date.now())
        this.payAlertFlag = false
      }
      this.$router.push({
        name: 'payment',
        params: {
          price: this.cnyNum,
          symbol: this.buyTarget,
          amount: this.btcNum
        }
      })
    },
    onEnterComparePrice() {
      this.$router.push({
        name: 'comparePrice',
        query: {
          target: this.buyTarget,
          switchTarget: this.switchTarget
        }
      })
    },
    onEnterRed() {
      this.$router.push({
        name: 'redEnvelope'
      })
    },
    changeInputLength(input, maxLength, length){
      let str = input.toString()
      if (str.indexOf('.') !== -1) {
        let len = str.split('.')[1].length
        if (len === length) {
          this[maxLength] = str.split('.')[0].length + length + 1
        } else {
          this[maxLength] = MAX_LENGTH
        }
      }
    },
    updateInputBTCLength() {
      this.changeInputLength(this.btcNum, 'btcMaxLength', 4)
    },
    updateInputCNYLength() {
      this.changeInputLength(this.cnyNum, 'cnyMaxLength', 2)
    },
    checkInviteCode() {
      const { inviteCode } = this.$route.query
      if (!inviteCode) return
      this.$router.push({
        name: 'landingA',
        query: {
          inviteCode
        }
      })
    },
    onSwitchTargetClick(target) {
      this.switchTarget = target
      DI.get('offlineStorage').set(USER_SELECT_TARGET, target)
    },
    onTargetClick(target) {
      // save previous btcNum
      this.$set(this.biNum, this.buyTarget, this.btcNum)
      this.buyTarget = target
      DI.get('offlineStorage').set(USER_SELECT_BI, target)
      if (!this.biNum[this.buyTarget]) {
        this.btcNum = this.initNum[this.buyTarget]
        return
      }
      this.btcNum = this.biNum[this.buyTarget]
    },
    goMoreBuyMethods() {
      this.$router.push({
        name: 'moreBuyMethods'
      })
    }
  }
}
</script>

<style scoped lang="less">
.buy {
  min-height: calc(100vh);
  //background-color: #3F46B4;
  background-color: #4140bb;
  background-repeat:no-repeat;
}
.bu-top {
	padding:20px 0 0;
}
.top-logo {
  padding: 40px 30px 0px;
  img {
    width: 40%;
  }
}
.bu-top span {
	vertical-align:baseline;
  font-weight:bold;
  color: #fff;
}
.bu-body-info {
  color: #BCBCBC;
  font-weight: normal;
  font-size: 14px;
  height: 20px;
}
.buy-sell-witch {
  margin-left: 30px;
  font-size: 20px;
}
.bu-body-info-right {
  align-items: center;
  color: #222;
  display: flex;
  font-size: 14px;
  line-height: 14px;
}
.bu-body {
	background: #fff;
	margin: 25px 30px 20px;
	border-radius: 4px;
	padding: 30px 20px 20px;
	z-index: 999;
}
.flexlayone {
	display:flex;
	justify-content:space-between;
	align-items:center;
}
.flexlayone p {
	font-weight:bold;
	font-size:14px;
}

.bu-input {
  align-items: center;
  font-weight: bold;
}

.laber-for-right{
	width: 32px;
	text-align: right;
}
.btn-lightning {
  display: inline-block;
  height: 14px;
  margin-right: 2px;
}
.top-title {
  margin-right: 0;
  font-size: 28px;
}
.top-title-sub {
  font-size: 14px;
  margin-left: -5px;
}

.buy-target ul::-webkit-scrollbar {
  display: none;
  -webkit-appearance: none;
}

.buy-target {
  margin-top: 28px;
  width: 100vw;
  height:72px;
  overflow: hidden;
  ul {
    color: rgba(255,255,255,1);
    font-size: 16px;
    white-space:nowrap;
    overflow-x: scroll;
    li {
      display: inline-block;
      padding: 5px 12px;
      text-align: center;
      opacity: .5;
      &.active,
      &:active{
        font-weight: bold;
        opacity: 1;
        img {
          border-color: #FFF;
          border-radius: 1000px;
        }
      }
      img {
        border: 2px solid transparent;
        height: 36px;
        width: 36px;
        display: block;
        margin: 0 auto 8px;
      }
    }
    li:first-child {
      padding-left: 30px;
    }
    li:last-child {
      padding-right: 30px;
    }
  }
}
.red-enter {
  float: right;
  margin-right: 25px;
  img {
    width: 110px;
  }
  padding-bottom: 120px;
}
.avaliable-sell {
  font-size: 12px;
  margin: 20px auto 0;
  text-align: center;
  color: #666;
}
.avaliable-sell-white {
  color: #FFF;
}
.pay-confirm-dialog {
  padding: 30px 40px;
  img {
    margin: 0 auto;
  }
  ol,
  li {
    list-style-type: decimal;
  }
  .confirm-title {
    text-align: center;
    font-size: 16px;
    color: #000;
    margin-top: 10px;
    font-weight: bold;
  }
  .confirm-content {
    padding: 20px 0 10px;
    font-size: 14px;
    color: #000;
    b {
      color: #F7931A;
    }
    li {
      line-height: 18px;
      margin-bottom: 10px;
    }
  }
  button {
    display: block;
    width: 100%;
    outline: none;
    background-color: #00C3D2;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 5px;
  }
}

.pay-dialog-wrap .btn-close {
  position: absolute;
  left: 50%;
  margin-left: -20px;
  bottom: -60px;
}
.van-dialog {
  overflow: visible;
}
.top-block {
  .top-right-block {
    >div {
      padding-left: 15px;
    }
    display: flex;
    img {
      width: 25px;
      display: block;
      margin: 0 auto;
    }
    span {
      color: #222222;
      font-size: 10px;
      margin-top: 5px;
      height: 12px;
      display: block;
    }
  }
}
</style>
<style>
.bu-input input {
  text-align: center;
  font-size: 25px !important;
  line-height: 25px;
  vertical-align: center;
  color: #222;
  padding: 0 !important;
}
.bu-input .van-cell {
  outline: none !important;
  border-style: solid !important;
  border-width: 6px !important;
  border-color: white !important;
  flex: 1;
  padding:0 15px !important;
}
</style>
