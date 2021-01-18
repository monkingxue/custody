<template>
  <div class="container container-white">
    <div class="tobepay bold">
      <img
        src="../assets/images/icon-timer.png"
        width="16"
      >
      {{ $t("tobepayment") }}&nbsp;
      <CountDownMinute :time="calCountDownTime" />
    </div>

    <div class="alipay-alert">
      <i
        v-if="isAlipay || isAlipayToBank"
        class="i-bg ipayalipay"
      />
      <i
        v-if="isWeixin"
        class="i-bg ipaywx"
      />
      <i
        v-if="isBank && !isAlipayToBank"
        class="i-bg ipaybank"
      />
      <span>
        请自行{{ paymentMethodName }}向以下商家转账
        <b>{{ detail.quote_currency.amount }}</b> 元
      </span>
    </div>

    <div class="comm-list font14">
      <div class="comm-listitem payee-info">
        <div class="flex-left-right">
          <div class="secondaryColor">
            {{ $t("payee") }}
          </div>
          <CopyButton :text="detail.name" />
        </div>
        <div class="flex-left-right subLine">
          <span>
            <img
              src="../assets/images/icon26.png"
              width="18"
            >
            aBTC认证交易员
          </span>
          <span>{{ detail.trader_order_amount }}单&nbsp; | &nbsp;成交率98%</span>
        </div>
      </div>
      <div class="comm-listitem spacebetw">
        <div class="secondaryColor">
          收款账户
        </div>
        <CopyButton
          :text="detail.pay_account"
          :display-text="displayPayAccount"
        />
      </div>
      <div
        v-if="isBank"
        class="comm-listitem spacebetw"
      >
        <div class="secondaryColor bank-name">
          收款银行
        </div>
        <CopyButton
          class="bank-name-title"
          :text="detail.bank"
        />
      </div>
      <div class="comm-listitem spacebetw">
        <div class="secondaryColor">
          收款金额
        </div>
        <div>￥<CopyButton :text="detail.quote_currency.amount" /></div>
      </div>
      <div
        v-if="isWeixin"
        class="comm-listitem spacebetw"
      >
        <div class="graycolor">
          收款二维码
        </div>
        <div class="qrcodButt">
          <span @click="goToAlipay">
            点击展开
            <span class="icon-qrcode copy-item" />
          </span>
        </div>
      </div>

      <div
        v-if="!isAlipayToBank"
        class="tips-line"
      >
        <div
          class="flex-align"
          @click="() => displaySwitchDialog(true)"
        >
          转账遇到问题
          <span class="icon-help" />
        </div>
      </div>
      <div
        v-else
        class="tips-line"
      >
        <div
          class="flex-align"
          @click="onGoToAlipayBankTutorial"
        >
          支付宝转银行卡教程
          <span class="icon-help" />
        </div>
      </div>

      <div class="btn-bottom">
        <van-button
          size="large"
          class="orange-btn bold mt30"
          @click="onProcessOrder"
        >
          {{ $t("donePay") }}
        </van-button>
        <van-button
          size="large"
          class="plain-btn mt20"
          @click="cancelOrder"
        >
          {{ $t("cancle") }}
        </van-button>
      </div>
      <div
        v-if="isAlipayToBank"
        class="tips-line tips-line-center"
      >
        <div
          class="flex-all"
          @click="() => displaySwitchDialog(true)"
        >
          转账遇到问题
          <span class="icon-help" />
        </div>
      </div>
    </div>

    <van-dialog
      v-model="payTipsFlag"
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
          <li v-if="account.name">
            请打开支付宝，使用
            <b>{{ account.name[0] }}**</b> 的支付宝账户向商家付款。
          </li>
          <li>转账完成后，回到此页面点击<b>&lt;我已付款&gt;</b>。</li>
          <!-- <li>
            所有商家已通过平台认证，aBTC平台会保障您的资金安全。如需帮助，请添加客服微信：{{ customWechat }}。
          </li> -->
        </ol>
        <button @click="() => dispayPayTipsDialog(false)">
          关闭
        </button>
      </div>
      <img
        class="btn-close"
        src="../assets/images/icon-close.png"
        width="40"
        @click="() => dispayPayTipsDialog(false)"
      >
    </van-dialog>

    <van-dialog
      v-model="switchDialogFlag"
      class="pay-dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="pay-confirm-dialog">
        <img
          src="../assets/images/icon-paytips.png"
          width="58"
        >
        <div class="confirm-title">
          切换承兑商
        </div>
        <div class="confirm-content mb10">
          如果转账被屏蔽或者拦截，可以切换其他承兑商。
        </div>
        <button @click="switchAcceptor">
          换一个承兑商
        </button>
      </div>
      <img
        class="btn-close"
        src="../assets/images/icon-close.png"
        width="40"
        @click="() => displaySwitchDialog(false)"
      >
    </van-dialog>

    <div
      v-show="maskVisible"
      class="mask"
      @click="onMaskClick"
    >
      <div
        ref="imgElmPos"
        class="mask-img"
      />
      <pay-mask />
    </div>
    <PopUp
      ref="alipayPopup"
      title="温馨提示"
      :hide-btn="true"
    >
      <div class="alipay-bank-pupup">
        <div class="title">
          转账或者加好友时，请不要备注任何信息，否则您的支付宝账号可能被支付宝冻结，商家也可能不退款不放币。
        </div>
        <van-button
          size="large"
          round
          class="orange-btn btn"
          @click="onPupupAlipayClick"
        >
          好的
        </van-button>
        <div class="check">
          <van-checkbox
            v-model="pupUpHideAlipayNext"
            checked-color="#00C3D2"
          >
            下次不再提醒
          </van-checkbox>
        </div>
      </div>
    </PopUp>
    <PopUp
      ref="maxAmountPopup"
      title="关于银行转账"
      :hide-btn="true"
    >
      <div class="alipay-bank-pupup">
        <div class="title">
          同一商家可能有多张卡，转账时请仔细核对商家银行卡号，如果转账卡号错误，商家可能无法放币。
        </div>
        <van-button
          size="large"
          round
          class="orange-btn btn"
          @click="onPupupMaxAmountClick"
        >
          好的
        </van-button>
        <div class="check">
          <van-checkbox
            v-model="pupUpHideMaxAmountNext"
            checked-color="#00C3D2"
          >
            下次不再提醒
          </van-checkbox>
        </div>
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
          @click="onPupupAlipayBankClick"
        >
          好的
        </van-button>
      </div>
    </PopUp>
  </div>
</template>
<script>
import { DI } from "core"
import { Dialog } from "vant"
import {
  CopyButton,
  CountDownMinute,
  Message,
  Indicator,
  Mask,
  PopUp
} from "components"
import { loadImage } from "@kpi/poster"

const SKIP_POPUP_ALIPAY_COMMENT = 'SKIP_POPUP_ALIPAY_COMMENT'
const SKIP_POPUP_MAX_AMOUNT = 'SKIP_POPUP_MAX_AMOUNT'

export default {
  components: {
    "pay-mask": Mask,
    CopyButton,
    CountDownMinute,
    PopUp
  },
  data() {
    return {
      maskVisible: false,
      detail: {
        base_currency: {},
        quote_currency: {}
      },
      imgElm: null,
      payTipsFlag: false,
      switchDialogFlag: false,
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT"),
      pupUpHideAlipayNext: false,
      pupUpHideMaxAmountNext: false
    }
  },
  computed: {
    storeSetting() {
      return DI.get("store").state.setting.setting
    },
    isAlipayToBank() {
      return this.isBank && this.detail.alipay_convert_to_card
    },
    displayPayAccount() {
      const account = this.detail.pay_account
      if (this.isBank && account) {
        return account.replace(/\s/g, "").replace(/(.{4})/g, "$1 ")
      }
      return null
    },
    isBank() {
      return this.detail.pay_type === 3
    },
    isAlipay() {
      return this.detail.pay_type === 1
    },
    isWeixin() {
      return this.detail.pay_type === 2
    },
    paymentMethodName() {
      if (this.isAlipayToBank) {
        return "打开支付宝"
      }
      return {
        1: "打开支付宝",
        2: "打开微信",
        3: ""
      }[this.detail.pay_type]
    },
    paymentTypeName() {
      return {
        1: "支付宝",
        2: "微信",
        3: "银行卡"
      }[this.detail.pay_type]
    },
    account() {
      return DI.get("auth").getUser()
    },
    calCountDownTime() {
      const date = this.detail.created_at
        ? this.$dayjs.unix(this.detail.created_at)
        : this.$dayjs()
      return date.add(15, "m").diff(this.$dayjs(), "s")
    }
  },
  watch: {
    detail: {
      immediate: true,
      handler(val) {
        if (val.qr) this.loadQrImg(val.qr)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      DI.get("utils").setBody("bacgray")
    })
    const { params, query } = this.$route
    DI.get("utils").setBackAction(() => {
      if (query.from) {
        // if from orderList page then go back
        this.$router.go(-1)
      } else {
        this.$router.push("/")
      }
    })
    DI.get("utils").setTitle(this.$t("orderdetail"))
    if (!params.order_id) {
      this.getOrderById(query.id)
      return
    }
    this.detail = params
    this.checkPopUp()
  },
  methods: {
    checkPopUp() {
      this.checkMaxAmountPopUp()
      this.checkAlipayCommentPopup()
    },
    checkMaxAmountPopUp() {
      if (this.isWeixin) return
      if (this.isAlipay && Number(this.detail.quote_currency.amount) < Number(this.storeSetting.otc_alipay_max_volume)) {
        return
      }
      if (DI.get('offlineStorage').get(SKIP_POPUP_MAX_AMOUNT)) {
        return
      }
      this.$refs.maxAmountPopup.onOpen()
    },
    checkAlipayCommentPopup() {
      if (!this.isAlipay && !this.isAlipayToBank) return
      if (DI.get('offlineStorage').get(SKIP_POPUP_ALIPAY_COMMENT)) {
        return
      }
      this.$refs.alipayPopup.onOpen()
    },
    onPupupMaxAmountClick() {
      if (this.pupUpHideMaxAmountNext) {
        DI.get('offlineStorage').set(SKIP_POPUP_MAX_AMOUNT, 1)
      }
      this.$refs.maxAmountPopup.onClose()
    },
    onPupupAlipayClick() {
      if (this.pupUpHideAlipayNext) {
        DI.get('offlineStorage').set(SKIP_POPUP_ALIPAY_COMMENT, 1)
      }
      this.$refs.alipayPopup.onClose()
    },
    dispayPayTipsDialog(payTipsFlag) {
      this.payTipsFlag = payTipsFlag
    },
    loadQrImg(imgSrc) {
      loadImage(imgSrc).then(imgElm => {
        this.imgElm = imgElm
        this.$refs.imgElmPos.appendChild(imgElm)
        Indicator.close()
      })
    },
    cancelOrder() {
      Dialog.confirm({
        title: "取消提示",
        message:
          "如果您已向卖家付款，请千万不要取消订单。"
      })
        .then(() => {
          Indicator.open(this.$t("loading"))
          DI.get("orderHttp")
            .cancelOrder({
              order_id: this.detail.order_id
            })
            .then(() => {
              Message("取消订单成功")
              this.$router.push({
                name: "buy",
                query: { from: 'home' }
              })
            })
            .catch(Message)
            .then(() => {
              Indicator.close()
            })
        })
        .catch(() => {})
    },
    getOrderById(id) {
      Indicator.open(this.$t("loading"))
      DI.get("orderHttp")
        .getOrderDetailById(id)
        .then(res => {
          this.detail = res
          this.checkPopUp()
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    goToAlipay() {
      if (!this.detail.qr) {
        Dialog.alert({
          message: `当前商家没有上传二维码\r\n${
            this.isAlipay ? "请用支付宝加好友转账" : "请加微信好友后转账"
          }`
        })
        return
      }
      this.maskVisible = true
      if (!this.imgElm) {
        Indicator.open(this.$t("loading"))
      }
    },
    onProcessOrder() {
      Dialog.confirm({
        title: "付款确认",
        message:
          `您已经通过「${this.paymentTypeName}」完成付款？`
      }).then(() => {
        Indicator.open(this.$t("loading"))
        DI.get("orderHttp")
          .processOrder({
            order_id: this.detail.order_id
          })
          .then(() => {
            this.goToOrderDetail()
          })
          .catch(Message)
          .then(() => {
            Indicator.close()
          })
      })
    },
    onMaskClick() {
      this.maskVisible = false
    },
    goToOrderDetail() {
      this.$router.push({
        name: "orderDetail",
        query: { id: this.detail.order_id }
      })
    },
    backToHome() {
      this.$router.push({ name: "buy" })
    },
    onGoToAlipayBankTutorial() {
      this.$refs.confirmPopup.onOpen()
      // window.location = "https://abtc.zendesk.com/hc/zh-cn/articles/360041013434"
    },
    onPupupAlipayBankClick() {
      this.$refs.confirmPopup.onClose()
    },
    displaySwitchDialog(flag) {
      this.switchDialogFlag = flag
    },
    switchAcceptor() {
      this.switchDialogFlag = false
      Indicator.open(this.$t("loading"))
      DI.get("orderHttp")
        .otcChangeMerchant({
          order_id: this.detail.order_id
        })
        .then(() => {
          this.getOrderById(this.detail.order_id)
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    }
  }
}
</script>
<style scope lang="less">
@maincolor: #222;
@secondaryColor: rgba(34, 34, 34, 0.6);
@grayColor: rgba(34, 34, 34, 0.3);

.container {
  min-height: calc(100vh - 44px);
}
.secondaryColor {
  color: @secondaryColor;
}

.tobepay {
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 20px;
  img {
    margin-right: 10px;
  }
}
.pl25 {
  padding-left: 25px;
}
.copy-item {
  display: inline-block;
}
.copy-item:after {
  content: " ";
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  width: 100%;
}
.drawtips {
  padding: 5px 20px 40px 20px;
  a {
    color: #f5a623;
    text-decoration: underline;
  }
}
.drawtips p {
  font-size: 13px;
  margin-top: 5px;
  line-height: 26px;
}
.alipay-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: 14px;
  color: #222;
  background: #fef4e8;

  b {
    color: #f7931a;
  }

  .ipayalipay {
    background: url("../assets/images/alipay02.png") no-repeat;
  }
  .ipaywx {
    background: url("../assets/images/wx02.png") no-repeat;
  }
  .ipaybank {
    background: url("../assets/images/bank02.png") no-repeat;
  }
  .i-bg {
    background-size: 100%;
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }
}
.mask {
  .mask-img {
    top: 15%;
    left: 0;
    right: 0;
    padding: 20px;
    position: fixed;
    z-index: 3000;
  }
}

.comm-list {
  .comm-listitem {
    padding: 0 30px;
  }
  .comm-listitem::after {
    left: 30px;
    right: 30px;
  }
  .bank-name {
    min-width: 100px;
  }
  .bank-name-title {
    line-height: 24px;
    text-align: right;
  }
  .payee-info {
    flex-direction: column;
    padding: 20px 30px;
    line-height: 22px;
  }
  .tips-line {
    padding: 12px 30px 0;
    font-size: 12px;
    color: rgba(34, 34, 34, 0.6);
    display: flex;
    justify-content: flex-end;
  }
  .tips-line-center {
    justify-content: center;
  }
  .subLine {
    color: @grayColor;
    font-size: 10px;
    span:first-child {
      display: flex;
      align-items: center;
    }
    img {
      margin-right: 5px;
    }
  }
}

.btn-bottom{
  padding: 30px 30px 10px;
  .plain-btn {
    border: 2px solid #eee;
    border-radius: 4px;
    height:46px!important;
  }
  .tips {
    margin-top: 20px;
    color: @secondaryColor;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
      color: #f7931a;
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
    background-color: #00c3d2;
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
.alipay-bank-pupup {
  .title {
    font-size: 14px;
    color: #000000;
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
