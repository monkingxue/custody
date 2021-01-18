<template>
  <div class="buy">
    <div class="top-tab-label">
      <span class="back top-tap-back">
        <a
          class="top__back"
          @click="onBack"
        />
      </span>
      <scrollTabLabel
        class="bu-top buy-sell-witch"
        :tabs="tabsData"
        :target="switchTarget"
        @change="onSwitchTargetClick"
      />
      <span
        class="top-tap-right img-btn-dark"
        @click="goToOrderListOtc"
      >
        订单
      </span>
    </div>
    <div class="buy-target">
      <div>
        <span class="bi-label blue">{{ $t('mainstream') }}</span>
        <ul ref="el_mainstream_bi_list">
          <li
            v-for="item in mainstreamBi"
            :key="item.name"
            :class="[{active: item.name === buyTarget}, 'img-btn-dark']"
            :style="{ paddingRight: `${biPadding}px` }"
            @click="() => onTargetClick(item)"
          >
            <img
              :src="getIconUrl(item.name)"
              width="36"
            >
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div>
        <span class="bi-label purple">{{ $t('innovation') }}</span>
        <ul ref="el_innovation_bi_list">
          <li
            v-for="item in innovationBi"
            :key="item.name"
            :class="[{active: item.name === buyTarget}, 'img-btn-dark']"
            :style="{ paddingRight: `${biPadding}px` }"
            @click="() => onTargetClick(item)"
          >
            <img
              :src="getIconUrl(item.name)"
              width="36"
            >
            <span>{{ item.name }}</span>
          </li><li
            v-if="isSwitchTargetBuy"
            :style="{ paddingRight: `${biPadding}px` }"
            @click="goMoreBuyMethods"
          >
            <img
              src="../assets/images/icon-more.png"
              width="36"
            >
            <span>More</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bu-body rel">
      <div class="commflex top-block">
        <div>
          <p class="bu-body-info">
            {{ biTargetInfo['cn_name'] }}
          </p>
          <p class="bu-body-info bu-body-info-right din">
            <span>1&nbsp;{{ buyTarget }}&nbsp;≈&nbsp;</span>
            <ScrollNumber :number="buyRate === 1 ? '*' : displayBuyRate" />
            <span>{{ $t('yuan') }}</span>
          </p>
        </div>
        <div class="top-right-block">
          <div
            class="touch-opacity hide"
            @click="onEnterComparePrice"
          >
            <img
              v-if="isSwitchTargetBuy"
              src="../assets/images/icon-compare.png"
            >
            <img
              v-else
              src="../assets/images/icon-compare-sell.png"
            >
            <span>全网价格</span>
          </div>
          <div class="touch-opacity hide">
            <img src="../assets/images/icon-reminder.png">
            <span>设置提醒</span>
          </div>
        </div>
      </div>
      <div class="comm-inputcon bu-input mt20 din">
        <span class="graycolor">{{ $t('amount') }}</span>
        <van-field
          v-model="btcNum"
          type="number"
          :maxlength="btcMaxLength"
          @focus="focusTarget = 'BTC'"
        />
        <span
          class="graycolor"
        >{{ buyTarget }}</span>
        <span
          v-if="!isSwitchTargetBuy"
          class="add-all flex-all"
        >
          <span class="unit">{{ buyTarget }}</span>
          <span
            class="sellAll img-btn-dark"
            @click="onAvaliableSellClick"
          >全部</span>
        </span>
      </div>
      <div class="comm-inputcon bu-input mt20 din">
        <span class="graycolor">{{ $t('sum') }}</span>
        <van-field
          v-model="cnyNum"
          type="number"
          :maxlength="cnyMaxLength"
          @focus="focusTarget = 'CNY'"
        />
        <span class="graycolor laber-for-right">{{ $t('yuan') }}</span>
      </div>
      <div class="mt20">
        <van-button
          :class="['img-btn-dark', isSwitchTargetBuy ? 'orange-btn' : 'yellow-btn']"
          size="large"
          round
          @click="placeOrder"
        >
          <img
            class="btn-lightning"
            src="../assets/images/lightning.png"
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
            {{ $t('availableBalance') }}：{{ targetBalance }} {{ buyTarget }}
          </template>
          <template v-else>
            {{ $t('availableBalance') }}：--
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
          src="../assets/images/icon-paytips.png"
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
        src="../assets/images/icon-close.png"
        width="40"
        @click="() => (payAlertFlag = false)"
      >
    </van-dialog>
  </div>
</template>
<script>
import { DI } from 'core'
import { Dialog, Notify } from 'vant'
import { Message, Indicator, ScrollNumber, scrollTabLabel } from 'components'

const MAX_LENGTH = 8
const BTC = 'BTC'
const CNY = 'CNY'
const DEBUG_CODE = '996996'
export const USER_INPUT_AMOUNT = 'USER_INPUT_AMOUNT'
export const USER_INVITE_CODE = 'USER_INVITE_CODE'
export const USER_SELECT_TARGET = 'USER_SELECT_TARGET'
export const USER_SELECT_BI = 'USER_SELECT_BI'
export const PAYMENT_CONFIRM_DIALOG = 'PAYMENT_CONFIRM_DIALOG'
const winWidth = window.innerWidth
const biWidth = 40
const DEFAULT_MAIN_BI = [
  { name: 'BTC' },
  { name: 'USDT' },
  { name: 'ETH' },
  { name: 'EOS' },
  { name: 'TRX' },
  { name: 'BCH' },
  { name: 'XRP' },
  { name: 'HT' },
  { name: 'LTC' }
]
export default {
  components: {
    ScrollNumber,
    scrollTabLabel
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
      buyTarget: DI.get('offlineStorage').get(USER_SELECT_BI, BTC),
      switchTarget: DI.get('offlineStorage').get(USER_SELECT_TARGET, 'BUY'),
      tabsData: [
        {
          text: '我要买',
          value: 'BUY'
        },
        {
          text: '我要卖',
          value: 'SELL'
        }
      ],
      payAlertFlag: false,
      mainstreamBi: DEFAULT_MAIN_BI,
      innovationBi: [],
      biPadding: (winWidth - 30 - biWidth / 2) / 5 - biWidth
    }
  },
  computed: {
    storeOtcCoinSetting() {
      return DI.get("store").state.setting.otcCoinSetting || []
    },
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    biTargetInfo() {
      return this.biInfo[this.buyTarget] || {}
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
      return (this.marketStore["sell_price"] && this.marketStore["buy_price"])
        ? this.marketStore[this.isSwitchTargetBuy ? "buy_price" : "sell_price"]
        : 1
    },
    displayBuyRate() {
      const cny_price_digits = this.biTargetInfo['cny_price_digits'] || 0
      return this.buyRate.toFixed(cny_price_digits)
    },
    buyFee() {
      return this.marketStore['base_currency_fee'] ? this.marketStore['base_currency_fee'] : 0
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
        return this.buyRate !== 1 && Number(this.btcNum) <= Number(this.account.available_balance[this.buyTarget])
      }
      return this.buyRate !== 1
    }
  },
  watch: {
    storeOtcCoinSetting: {
      immediate: true,
      handler() {
        this.filterOtcCoin()
      }
    },
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
    this.$nextTick(() => {
      DI.get('utils').setBody('bacpurple')
      DI.get('utils').setBackAction(() => {
        this.$router.push({ name: 'home' })
      })
    })
    this.networkErrorTimmerId = setTimeout(() => {
      if (this.buyRate === 1) {
        Notify({
          message: '当前网络不可用，请检查您的网络设置',
          duration: 0
        })
      }
    }, 1000 * 10)
    DI.get("store").dispatch("SYNC_OTC_COIN_SETTING")
    this.checkInviteCode()
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
    const { coin, target } = this.$route.query
    if (coin) {
      this.buyTarget = coin
      const defaultVolume = this.biTargetInfo['otc_buy_default_volume']
      if (defaultVolume) {
        this.focusTarget = BTC
        this.btcNum = defaultVolume
      }
    }
    if (target) {
      this.switchTarget = target
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
    filterOtcCoin() {
      if (this.storeOtcCoinSetting.length) {
        this.mainstreamBi = []
        this.innovationBi = []
        let scrollTargetList = ''
        this.storeOtcCoinSetting.forEach(item => {
          if (item.otc_tag === 'mainstream') {
            this.mainstreamBi.push(item)
            if (item.name === this.buyTarget) {
              scrollTargetList = "mainstream"
            }
          } else {
            this.innovationBi.push(item)
            if (item.name === this.buyTarget) {
              scrollTargetList = "innovation"
            }
          }
        })
        const index = this[`${scrollTargetList}Bi`].findIndex(i => i.name === this.buyTarget)
        if (index > -1) {
          this.$nextTick(() => {
            this.$refs[`el_${scrollTargetList}_bi_list`].scroll(index * (biWidth + this.biPadding), 0)
          })
        } else {
          // 如果本地保存的币 在接口里没有 则 fallback 到 BTC
          DI.get('offlineStorage').remove('USER_SELECT_BI')
          this.buyTarget = BTC
        }
      }
    },
    onBack() {
      const { from } = this.$route.query
      if (from) {
        this.$router.push({
          name: from
        })
        return
      }
      this.$router.go(-1)
    },
    getIconUrl(target) {
      return this.biInfo && this.biInfo[target] && !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get('BI_LOCAL_ICON')[target]
    },
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
      const { otc_buy_min_volume, otc_buy_max_volume, name } = this.biTargetInfo
      const minOrder = otc_buy_min_volume
      const maxOrder = otc_buy_max_volume
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
        const minBi = minOrder
        if (this.btcNum < minBi ) {
          Message(`最低卖出 ${minBi} ${name}`)
          return
        }
        if (!this.placeOrderButtonEnable) {
          Message(`${name} 余额不足`)
          return
        }
        if (this.cnyNum > 50000 ) {
          Message('最高下单 50000 人民币')
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
      const minBi = minOrder
      if (this.btcNum < minBi ) {
        Message(`最低下单 ${minBi} ${name}`)
        return
      }
      const maxBi = maxOrder
      if (maxBi && this.btcNum > maxBi) {
        Message(`最多下单 ${maxBi} ${name}`)
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
    onTargetClick(item) {
      if (!this.storeOtcCoinSetting.length) return
      // save previous btcNum
      this.$set(this.biNum, this.buyTarget, this.btcNum)
      this.buyTarget = item.name
      DI.get('offlineStorage').set(USER_SELECT_BI, item.name)
      if (!this.biNum[this.buyTarget]) {
        this.btcNum = this.biTargetInfo['otc_buy_default_volume']
        return
      }
      this.btcNum = this.biNum[this.buyTarget]
    },
    goToOrderListOtc() {
      this.$router.push({
        name: 'orderListOtc'
      })
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .top-tab-label {
    position: relative;
    display: flex;
    justify-content: center;
    .top-tap-back {
      position: absolute;
      left: 6px;
      top: 6px;
    }
    .top-tap-right {
      position: absolute;
      top: 16px;
      right: 17px;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
  }
  .bu-top {
    padding: 10px 0 0;
    span {
      vertical-align:baseline;
      font-weight:bold;
      color: #fff;
    }
  }
}

.buy-target {
  padding: 10px 0 15px;
  width: 100vw;
  min-height: 180px;
  overflow: hidden;
  .bi-label {
    display: inline-block;
    font-size: 10px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px 0 2px;
    border-radius: 0 9px 9px 0;
    color: #fff;
    &.blue {
      background-color: #2783FF;
    }
    &.purple {
      background-color: #A700FF;
    }
  }
  ul {
    color: rgba(255,255,255,1);
    white-space: nowrap;
    overflow-x: scroll;
    padding-left: 30px;
    li {
      display: inline-block;
      padding: 5px 0;
      text-align: center;
      opacity: .5;
      font-size: 12px;
      img {
        border: 2px solid transparent;
        height: 36px;
        width: 36px;
        display: block;
        margin: 0 auto 8px;
        border-radius: 40px;
      }
      &.active,
      &:active{
        font-weight: bold;
        opacity: 1;
        img {
          border-color: #FFF;
        }
      }
    }
  }
  ul::-webkit-scrollbar {
    display: none;
    -webkit-appearance: none;
  }
}

.bu-body {
	background: #FFF;
	margin: 0 20px;
	padding: 20px;
  z-index: 999;
  border-bottom: 1px solid #FFF;

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

  .bu-body-info {
    color: #222222;
    font-weight: bold;
    font-size: 16px;
    height: 20px;
  }
  // .buy-sell-witch {
  //   font-size: 18px;
  // }
  .bu-body-info-right {
    align-items: center;
    color: #999;
    display: flex;
    font-size: 14px;
    line-height: 14px;
    height: 17px;
    margin-top: 7px;
  }
  .orange-btn,
  .yellow-btn {
    height: 60px;
    line-height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bu-input {
    align-items: center;
    font-weight: bold;
    position: relative;
    .add-all {
      background: #FFF;
      color: #FF9B00;
      font-size: 14px;
      line-height: 14px;
      position: absolute;
      right: 5px;
      .unit {
        color: #666;
        border-right: 1px solid #DDDDDD;
        padding: 3px 10px 4px;
        margin-right: 9px;
      }
    }
  }
  .laber-for-right{
    width: 32px;
    text-align: right;
  }
  .btn-lightning {
    display: inline-block;
    height: 16px;
    margin-right: 2px;
    margin-bottom: -2px;
  }
  .avaliable-sell {
    font-size: 12px;
    margin: 12px auto 0;
    text-align: center;
    color: #666;
  }
  .avaliable-sell-white {
    color: #FFF;
  }
}

.pay-dialog-wrap {
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
  .btn-close {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: -60px;
  }
}
.van-dialog {
  overflow: visible;
}
</style>
<style>
.bu-input {
  line-height: 60px;
}
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
.top-tab-label .buy-sell ul li{
  padding: 5px 15px 10px 15px!important;
}
.top-tab-label .bot {
  margin-left: 15px;
}
</style>
