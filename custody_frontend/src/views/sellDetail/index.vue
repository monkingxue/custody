<template>
  <div
    v-show="detail.status"
    class="container"
  >
    <div
      v-if="isProcessing"
    >
      <div class="orangeclock">
        <img
          src="../../assets/images/icon10.png"
        >
      </div>
      <div class="tc orangecolor mt20 bold font18">
        商家转账中，请稍候
      </div>
    </div>
    <div v-else-if="isSuccess">
      <div class="orangeclock">
        <img
          src="../../assets/images/icon11.png"
        >
      </div>
      <div class="tc greencolor mt20 bold font18">
        商家已放款
      </div>
    </div>
    <div v-else>
      <div class="orangeclock">
        <img
          src="../../assets/images/icon12.png"
        >
      </div>
      <div class="tc mt20 bold font18">
        {{ $t('failedOrder') }}
      </div>
    </div>
    <div class="comm-list">
      <div
        class="comm-listitem spacebetw mt30 "
        style="border-top:1px solid #eee"
      >
        <div>{{ $t('oddnumbers') }}</div>
        <div>
          <CopyButton
            :text="detail.pay_order_id"
          />
        </div>
      </div>
      <div
        class="comm-listitem spacebetw"
      >
        <div>{{ $t('ordertime') }}</div>
        <div>{{ detail.create_time }}</div>
      </div>
      <div
        v-if="!isSuccess"
        class="comm-listitem  spacebetw"
      >
        <div>出售价格</div>
        <div v-if="detail.quote_currency">
          ¥{{ detail.quote_currency.amount }}
        </div>
      </div>
      <div
        v-if="!isSuccess"
        class="comm-listitem  spacebetw"
      >
        <div>{{ $t('amount') }}</div>
        <div>{{ `${detail.base_currency.amount}${detail.base_currency.name}` }}</div>
      </div>
      <div class="mt30 comm-list-with-padding">
        <van-button
          v-if="!isProcessing"
          size="large"
          round
          class="orange-btn"
          @click="goToAccount"
        >
          查看钱包
        </van-button>
      </div>
    </div>
    <div class="drawtips graycolor mt15">
      <template
        v-if="isProcessing"
      >
        <p>{{ $t('notice') }}:</p>
        <p>* 您的订单已经收到；我们正在为您入账。如在交易高峰期，系统需要5-10分钟来处理订单，请您耐心等待。</p>
      </template>
      <template v-else-if="isSuccess">
        <p>{{ $t('notice') }}:</p>
        <p>* 现金到账大约需要1～3分钟。</p>
        <!-- <p>* 若10分钟仍未到账，请联系aBTC客服。微信号：{{ customWechat }}。</p> -->
      </template>
      <template v-else>
        <p>{{ $t('notice') }}:</p>
        <!-- <p>* 如订单取消有误，请联系aBTC客服。微信号：{{ customWechat }}</p> -->
      </template>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Indicator, Message, CopyButton } from 'components'
export default {
  components: {
    CopyButton
  },
  data() {
    return {
      intervalId: null,
      orderId: null,
      detail: {
        base_currency: {},
        quote_currency: {}
      },
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  computed: {
    isProcessing() {
      return ['open'].indexOf(this.detail.status) > -1
    },
    isSuccess() {
      return this.detail.status === 'buy_currency_success'
    }
  },
  mounted() {
    DI.get('utils').setBackAction(() => {
      this.$router.push({ name: 'orderList' })
    })
    DI.get('utils').setTitle('订单详情')
    const { query } = this.$route
    if (!query.id) {
      Message('订单 ID 错误')
      return
    }
    Indicator.open(this.$t('loading'))
    this.orderId = query.id
    this.getOrderDetail()
    this.intervalId = setInterval(() => {
      this.getOrderDetail()
    }, 1000 * 3)
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalId)
    next()
  },
  methods: {
    getOrderDetail() {
      DI.get('orderHttp')
        .getOrderDetailById(this.orderId)
        .then((res) => {
          DI.get('utils').clearPollingToast(res, 'orderDetailById')
          this.detail = res
        })
        .catch((message) => {
          DI.get('utils').pollingToast(message, 'orderDetailById')
        })
        .then(() => {
          Indicator.close()
        })
    },
    goToAccount(){
      this.$router.push({ name: 'wallet' })
    }
  }
}
</script>
<style scoped>

.spacebetw{
  justify-content: space-between;
  align-items: center;
}

.orangeclock{
  width:100px;
  margin:auto;
  margin-top:30px;
}
.drawtips {
  padding: 5px 20px 40px;
}
.drawtips p {
  font-size:13px;
  margin-top:5px;
  line-height:26px
}
.comm-notice {
  text-align: center;
  margin-top:20px
}
</style>
