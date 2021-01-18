<template>
  <div class="container container-white">
    <van-radio-group
      v-model="payMethod"
    >
      <div
        v-for="item in paymentData"
        :key="item.type"
        class="pay-item"
      >
        <div
          class="pay-line touch"
          @click="() => switchPayMethod(item)"
        >
          <div class="flex-left-right">
            <i :class="item.icon" />
            {{ item.name }}
            &nbsp;
            <span
              v-if="item.recommend"
              class="commend orangecolor"
            >
              推荐
            </span>
          </div>
          <van-radio
            :name="item.type"
            checked-color="#00C3D2"
          />
        </div>
        <ul
          :class="[
            'order-detail',
            payMethod === item.type && 'order-detail-show'
          ]"
        >
          <li>
            <div class="secondaryColor flex-left-right">
              订单金额&nbsp;
              <span @click="showOrderTotalTips">
                <img
                  src="../assets/images/icon18.png"
                  width="13"
                >
              </span>
            </div>
            <span>{{ price }} 元</span>
          </li>
          <li
            v-if="planId"
            class="portfolio-list"
          >
            <div
              v-for="coin in coinArr"
              :key="coin.currency"
              class="flex-all secondaryColor"
            >
              <div>{{ coin.currency }}</div>
              <div>{{ coin.amount }} 元</div>
            </div>
          </li>
          <li v-if="!planId">
            <span class="secondaryColor">数量</span>
            <span v-if="item.type === 'WEIXINPAY'">
              <span class="extra-fee">
                需 0.1% 转账手续费
              </span>
              <!-- 详情问一帆 前端展示订单金额不扣手续费 只左边多加一个提示标记 -->
              {{ amount }} {{ symbol }}
            </span>
            <span v-else>{{ amount }} {{ symbol }}</span>
          </li>
          <li v-if="planId && item.type === 'WEIXINPAY'">
            <span class="secondaryColor" />
            <span
              class="extra-fee"
              style="margin-right: 0"
            >
              需 0.1% 转账手续费
            </span>
          </li>
          <li>
            <span class="secondaryColor" />
            <span>
              请使用<b>{{ account.name && `${account.name[0]}**` }}</b>{{ item.payName }}付款，不要备注信息
            </span>
          </li>
        </ul>
      </div>
    </van-radio-group>
    <van-button
      block
      size="large"
      type="primary"
      class="btn-pay"
      @click="makePayment"
    >
      去支付 {{ price }} 元
    </van-button>
    <div class="tipContainer graycolor">
      <p>
        1. OTC交易服务时间为北京时间早上7点到凌晨1点
      </p>
      <p>
        2. 所有商家均已通过 aBTC 认证并抵押保证金，请放心兑换
      </p>
      <p>
        <span>3. 如有大额交易需求，请联系客服: {{ customWechat }}</span>
        <img
          src="../assets/images/qr-code.png"
          width="10"
          class="ml5"
          @click="onKefuClick"
        >
      </p>
    </div>
    <PopUp
      ref="kefuPopup"
      title="客服微信"
      :hide-btn="true"
    >
      <div class="alipay-bank-pupup">
        <img
          class="dialogImg"
          :src="kefuImgStr"
        >
        <van-button
          size="large"
          round
          class="orange-btn mt30"
          @click="saveImg"
        >
          {{ $t('me.saveQRCode') }}
        </van-button>
      </div>
    </PopUp>
    <PopUp
      ref="confirmPopup"
      title="温馨提示"
      :hide-btn="true"
    >
      <div class="alipay-bank-pupup">
        <div class="title">
          当前金额选择支付宝付款时，需要您转账到商家银行卡。
        </div>
        <div class="list">
          <div class="flex-align">
            <img src="../assets/images/payment/icon01.png">
            <div>1. 打开“支付宝首页” - 选择 「转账」</div>
          </div>
          <div class="flex-align">
            <img src="../assets/images/payment/icon02.png">
            <div>2. 然后选择「转到银行卡」</div>
          </div>
          <div class="flex-align">
            <img src="../assets/images/payment/icon03.png">
            <div>3. 填写商家银行卡信息进行转账</div>
          </div>
        </div>
        <van-button
          size="large"
          round
          class="orange-btn btn"
          :disabled="pupupBtnText.length !== 2"
          @click="onPupupAlipayBankClick"
        >
          {{ pupupBtnText }}
        </van-button>
        <div class="check">
          <van-checkbox
            v-model="pupUpHideNext"
            checked-color="#00C3D2"
          >
            下次不再提醒
          </van-checkbox>
        </div>
      </div>
    </PopUp>
  </div>
</template>
<script>
import { DI } from "core"
import { Message, Indicator, PopUp } from "components"
import { Toast, Dialog } from "vant"

const PAYMENT_DATA = [
  {
    name: "支付宝",
    icon: "payalipay",
    type: "ALIPAY",
    payName: "支付宝",
    recommend: true
  },
  {
    name: "银行转账",
    icon: "paybank",
    payName: "银行卡",
    type: "CARD",
    recommend: false
  },
  {
    name: "微信支付",
    icon: "paywx",
    type: "WEIXINPAY",
    payName: "微信"
  }
]
const PAYMENT_TYPE = {
  ALIPAY: 1,
  WEIXINPAY: 2,
  CARD: 3
}
const SKIP_ALIPAY_BANK_POPUP = 'SKIP_ALIPAY_BANK_POPUP'

export default {
  components: {
    PopUp
  },
  data() {
    return {
      paymentData: PAYMENT_DATA,
      amount: 0,
      price: 0,
      symbol: "BTC",
      unitPrice: 0,
      payMethod: "ALIPAY",
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT"),
      dialogTitle: "",
      cancelButtonText: "好的",
      kefuImgStr: DI.get("CUSTOMER_SERVICE_WECHAT_QRCODE"),
      coinArr: [],
      planId: null,
      pupUpHideNext: false,
      pupupBtnText: ''
    }
  },
  computed: {
    account() {
      return DI.get("auth").getUser()
    },
    isSetCardNumber() {
      return this.account.set_card_number
    }
  },
  mounted() {
    DI.get("utils").setTitle(this.$t("chose"))
    const { params } = this.$route
    const { amount, price, symbol, planId, coinArr } = params
    if (!planId) {
      if (!price || !amount || !symbol) {
        Toast("Bad request")
        return
      }
    } else {
      if (!price || !coinArr) {
        Toast("Bad request")
        return
      }
      this.planId = planId
      this.coinArr = coinArr
    }
    this.amount = amount
    this.price = Math.ceil(price)
    this.symbol = symbol
    this.unitPrice = DI.get('filters').cutNumber(this.price / this.amount, 2)
  },
  methods: {
    onKefuClick() {
      this.$refs.kefuPopup.onOpen()
    },
    saveImg() {
      if (DI.get('utils').isFromApp()) {
        DI.get('utils').appSaveImg(this.kefuImgStr)
      } else {
        this.$router.push({
          name: 'imgPreview',
          params: {
            img: this.kefuImgStr
          }
        })
      }
    },
    onPupupAlipayBankClick() {
      if (this.pupUpHideNext) {
        DI.get('offlineStorage').set(SKIP_ALIPAY_BANK_POPUP, 1)
      }
      this.goToOrderPage()
    },
    showPopupAlipayBank() {
      if (DI.get('offlineStorage').get(SKIP_ALIPAY_BANK_POPUP)) {
        this.goToOrderPage()
        return
      }
      this.$refs.confirmPopup.onOpen()
      let i = 3
      this.pupupBtnText = `好的 (${i}s)`
      const id = setInterval(() => {
        i -= 1
        if (i === 0) {
          clearInterval(id)
          this.pupupBtnText = '好的'
          return
        }
        this.pupupBtnText = `好的 (${i}s)`
      }, 1000)
    },
    goKyc() {
      this.$router.replace({
        name: 'realname',
        query: 'payment'
      })
    },
    switchPayMethod(item) {
      this.payMethod = item.type
    },
    showOrderTotalTips() {
      Dialog.alert({
        title: "订单金额说明",
        message: "为便于您的转账，订单金额已取整，平台会以该整数金额进行购币结算",
        confirmButtonText: "好的"
      })
    },
    goToOrderPage() {
      this.$router.replace({
        name: "orderAlipay",
        params: this.orderParams,
        query: { id: this.orderParams.order_id }
      })
    },
    makePayment() {
      Indicator.open(this.$t("loading"))
      let data
      if (!this.planId) {
        data = {
          pay_type: PAYMENT_TYPE[this.payMethod],
          side: "buy",
          quote_currency_amount: Number(this.price),
          symbol: `${this.symbol}_CNY`,
          amount: Number(this.amount),
          pay_channel: "exinone"
        }
      } else {
        data = {
          pay_type: PAYMENT_TYPE[this.payMethod],
          side: "buy",
          symbol: 'USDT_CNY',
          tag: 'regular_investing',
          invest_plan_id: this.planId,
          quote_currency_amount: this.coinArr.reduce((a, b) => (a + b.amount), 0),
          pay_channel: "exinone"
        }
      }
      DI.get("orderHttp")
        .placeOrder(data)
        .then(res => {
          this.orderParams = res
          if (res.alipay_convert_to_card) {
            this.showPopupAlipayBank()
          } else {
            this.goToOrderPage()
          }
        })
        .catch((e) => {
          if (e && e.code) {
            const { code } = e
            if (code === "20045") {
              Dialog.confirm({
                title: '请先完成实名认证',
                messageAlign: 'left',
                message: '为符合反洗钱相关法规，未实名用户单笔交易不能超过200元，累计不超过1000元。如需购买更多，请完成实名认证。'
              }).then(() => {
                this.$router.replace({
                  name: 'realname'
                })
              })
              return
            }
            if (code === "10047") { // cobo add coin
              Dialog.confirm({
                title: '温馨提示',
                message: `请先添加 ${this.symbol} 币种才能购买噢`
              }).then(() => {
                window.sendMessage && window.sendMessage(
                  JSON.stringify({
                    prefix: 'OTC_COIN_NO_ADDR',
                    payload: this.symbol
                  })
                )
              })
              return
            }
          }
          Message(e)
        })
        .then(() => {
          Indicator.close()
        })
    }
  }
}
</script>
<style scoped lang="less">
.secondaryColor{
  color: rgba(34, 34, 34, 0.6);
}
.pay-item {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 30px;
    right: 30px;
    background: #eeeeee;
    height: 1px;
    bottom: 0;
  }
}

.pay-line {
  height: 66px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  i {
    width: 20px;
    margin-right: 13px;
  }

  .payalipay {
    background: url("../assets/images/alipay.png") no-repeat center;
    background-size: 100%;
  }
  .paywx {
    background: url("../assets/images/wx.png") no-repeat center;
    background-size: 100%;
  }
  .paybank {
    background: url("../assets/images/bank.png") no-repeat center;
    background-size: 100%;
  }
}

.order-detail {
  background-color: #fafafa;
  height: 0;
  padding: 0px 30px;
  overflow: hidden;
  transition: height 0.1s ease-in-out;
  will-change: height;
  li {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #222;
    font-size: 12px;
  }
  .portfolio-list {
    display: block;
    height: auto;
    border-top: 1px solid #EEEEEE;
    border-bottom: 1px solid #EEEEEE;
    > div {
      margin: 5px 0;
    }
  }
  .label {
    color: rgba(34, 34, 34, 0.6);
  }
  b {
    color: #f7931a;
  }
  .flex-left-right {
    align-items: center;
  }
}
.order-detail-show{
  height: 100%;
  padding: 10px 30px;
}

.commend {
  font-size: 12px;
  font-weight: bold;
  background: #fef4e8;
  padding: 2px 5px;
  border-radius: 4px;
}
.extra-fee {
  background: #fe7355;
  font-weight: bold;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  height: 20px;
  vertical-align: top;
  border-radius: 10px;
  margin-right: 20px;
}
.btn-pay {
  margin: 30px auto;
  width: calc(100% - 60px);
  border: none;
  font-weight: bold;
  background-color: #00c3d2;
  height: 60px;
  border-radius: 4px;
  box-shadow: 0 10px 10px rgba(0, 195, 210, 0.25);
}
.tipContainer {
  padding:0 30px;
  p {
    font-size: 13px;
    margin-top: 5px;
    line-height: 26px;
    align-items: center;
    .textColor {
      color: #00C3D2;
    }
    img {
      display: inline-block;
    }
  }
}
.van-dialog p {
  padding: 10px 0;
  text-align:justify;
}
/deep/ .certify-confirm-dialog {
  padding-top: 10px!important;
  padding-bottom: 40px!important;
}
.alipay-bank-pupup {
  .title {
    font-size: 14px;
    color: #000000;
  }
  .list {
    margin-top: 20px;
    font-size: 12px;
    color: #000000;
    img {
      width: 25px;
      padding-right: 10px;
    }
    >div {
      padding: 10px 0;
      > div {
        opacity: 0.6;
      }
    }
  }
  .btn {
    margin-top: 30px;
  }
  .check {
    padding-top: 10px;
    display: flex;
    justify-content: center;
    margin-bottom: -20px;
    font-size: 12px;
    color: #222222;
    /deep/ span {
      opacity: 0.6;
    }
  }
}
</style>
