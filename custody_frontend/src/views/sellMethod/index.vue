<template>
  <div class="comm-list payment">
    <div
      class="comm-listitem rightrow"
      @click="(() => {makePayment('ALIPAY', isSetAlipay)})"
    >
      <i class="payalipay" />
      <div class="flex-left-right sell-right">
        <div>
          {{ $t('alipay') }}收款
          &nbsp;
          <span class="commend orangecolor">{{ $t('recommend') }}</span>
        </div>
        <span
          v-if="hasReceipt"
          class="comm-list-right"
        >{{ isSetAlipay? '已设置' : '未设置' }}</span>
      </div>
    </div>
    <div
      class="comm-listitem rightrow"
      @click="(() => {makePayment('WEIXINPAY', isSetWechat)})"
    >
      <i class="paywx" />
      <div class="flex-left-right sell-right">
        <div>
          微信收款
          &nbsp;
          <span class="extra-fee">需 0.1% 转账手续费</span>
        </div>
        <span
          v-if="hasReceipt"
          class="comm-list-right"
        >{{ isSetWechat? '已设置' : '未设置' }}</span>
      </div>
    </div>
    <div
      class="comm-listitem rightrow noborder"
      @click="(() => {makePayment('CARD', isSetBank)})"
    >
      <i class="paybank" />
      <div class="flex-left-right sell-right">
        <div>
          银行卡收款
        </div>
        <span
          v-if="hasReceipt"
          class="comm-list-right"
        >{{ isSetBank? '已设置' : '未设置' }}</span>
      </div>
    </div>
    <van-popup
      v-model="visible"
      position="bottom"
    >
      <div class="pd20 withdraw-popup">
        <div class="title">
          <span>收款方式</span>
          <i
            v-if="type === 'ALIPAY'"
            class="payalipay"
          />
          <i
            v-if="type === 'WEIXINPAY'"
            class="paywx"
          />
          <i
            v-if="type === 'CARD'"
            class="paybank"
          />
        </div>
        <div class="info commflex">
          <div class="left">
            数量
          </div>
          <div class="right">
            {{ amount }} {{ symbol }}
          </div>
        </div>
        <div class="info commflex">
          <div class="left">
            出售价格
          </div>
          <div class="right">
            ¥{{ price }} 元
          </div>
        </div>
        <PasswordInput
          ref="passInput"
          :hide-pass="true"
          class="withdraw-pass"
          :auto-focus="false"
          @onChange="onPassChange"
        />
        <van-button
          size="large"
          round
          class="orange-btn withdraw-btn"
          :disabled="!passButtonEnabled"
          @click="onWithdraw"
        >
          卖出{{ symbol }}
        </van-button>
        <van-button
          size="large"
          round
          class="orange-btn withdraw-cancel-btn"
          @click="hidePopup"
        >
          取消
        </van-button>
        <div class="drawtip graycolor mt15">
          <p>{{ $t('notice') }}:</p>
          <p>
            * 人民币到账数目以
            <router-link
              to="/legalActuallPrice"
              replace
            >
              实际交割价格
            </router-link>
            为准。
          </p>
          <!-- <p>* 如需帮助，请联系aBTC客服，微信:{{ customWechat }}</p> -->
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { DI } from 'core'
import { Message, Indicator, PasswordInput } from 'components'

const PAYMENT_TYPE = {
  ALIPAY: 1,
  WEIXINPAY: 2,
  CARD: 3
}

export default {
  components: {
    PasswordInput
  },
  data() {
    return {
      receipts: [],
      amount: 0,
      price: 0,
      symbol: 'BTC',
      visible: false,
      type: '',
      password: '',
      isManage: false,
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  computed: {
    hasReceipt() {
      return this.receipts.length > 0
    },
    isSetAlipay() {
      return this.receipts.find((r) => r.receipt_type === 1).set
    },
    isSetWechat() {
      return this.receipts.find((r) => r.receipt_type === 2).set
    },
    isSetBank() {
      return this.receipts.find((r) => r.receipt_type === 3).set
    },
    passButtonEnabled() {
      return this.password && this.password.length === 6
    }
  },
  mounted() {
    DI.get('utils').setTitle('选择收款方式')
    this.getSellMethods()
    const { amount, price, symbol } = this.$route.params
    if (!price || !amount || !symbol) {
      this.isManage = true
      return
    }
    this.amount = amount
    this.price = price
    this.symbol = symbol
  },
  methods: {
    resetInput() {
      this.$refs.passInput.clear()
    },
    onWithdraw() {
      Indicator.open(this.$t('loading'))
      DI.get('orderHttp')
        .placeOrder({
          pay_type: PAYMENT_TYPE[this.type],
          side: 'sell',
          price: Number(this.price),
          symbol: `${this.symbol}_CNY`,
          amount: Number(this.amount),
          pay_channel: 'exinone',
          fund_password: this.password
        })
        .then((res) => {
          const params = res
          this.$router.replace({
            name: 'sellDetail',
            params,
            query: { id: params.order_id }
          })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    onPassChange(val) {
      this.password = val
    },
    showPopup() {
      DI.get('utils').setTitle('订单确认')
      this.visible = true
    },
    hidePopup() {
      this.resetInput()
      this.visible = false
    },
    getSellMethods() {
      Indicator.open(this.$t('loading'))
      DI.get('receiptHttp')
        .getReceiptInfo()
        .then((res) => {
          this.receipts = res.receipts
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    makePayment(type, isSet) {
      this.type = type
      if (isSet && !this.isManage) {
        this.showPopup()
        return
      }
      this.$router[this.isManage ? 'push' : 'replace']({
        name: 'sellMethodForm',
        query: {
          type
        },
        params: {
          config: this.receipts.find((r) => r.receipt_type === PAYMENT_TYPE[type]) || {}
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.payment {
  background: #FFF;
}
.payalipay {
  background:url("../../assets/images/alipay.png")no-repeat  center;
  background-size:100%;
}
.paywx {
  background:url("../../assets/images/wx.png")no-repeat  center;
  background-size:100%;
}
.paybank {
  background:url("../../assets/images/bank.png")no-repeat  center;
  background-size:100%;
}
.commend{
    font-size:12px;
    font-weight:bold;
    background: #fef4e8;
    padding:2px 5px;
    border-radius:4px;
}
.sell-right {
  width: 80%;
}
.comm-list-right {
  font-size: 12px;
  color: #999;
}
.withdraw-popup {
  height: calc(100vh - 40px);
  .title {
    font-size: 18px;
    font-weight: bold;
    padding: 15px 0 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    i {
      width: 20px;
    }
  }
  .info {
    padding: 15px 0 0;
    font-size: 16px;
    color: #636363;
  }
.withdraw-pass{
  padding: 40px 0;
}
.withdraw-cancel-btn {
  background: #999!important;
  box-shadow: none;
  opacity: .6;
  margin-top: 15px;
}
}
.extra-fee {
  background: #FE7355;
  font-weight:bold;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  height: 20px;
  vertical-align: top;
  border-radius: 10px;
}
</style>
