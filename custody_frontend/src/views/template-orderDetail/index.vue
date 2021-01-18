<template>
  <div
    v-show="detail.status"
    class="pl20 pr20 container"
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
        请稍候，订单处理中
      </div>
    </div>
    <div v-else-if="isSuccess">
      <div class="orangeclock">
        <img
          src="../../assets/images/cobo/icon-finish.png"
        >
      </div>
      <div class="tc greencolor mt20 bold font18">
        {{ $t('completeorder2') }}
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
    <div class="comm-list font14">
      <div
        v-if="isSuccess"
        class="comm-notice font16 cobo-notice"
      >
        {{ detail.base_currency.amount }} {{ detail.base_currency.name }} 已转入 COBO 钱包
      </div>
      <div
        class="order-listitem spacebetw mt30 "
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
        class="order-listitem spacebetw"
      >
        <div>{{ $t('ordertime') }}</div>
        <div>{{ detail.create_time }}</div>
      </div>
      <div
        v-if="!isSuccess"
        class="order-listitem spacebetw"
      >
        <div>{{ $t('transferamount') }}</div>
        <div v-if="detail.quote_currency">
          ¥{{ detail.quote_currency.amount }}
        </div>
      </div>
      <div
        v-if="!isSuccess"
        class="order-listitem no-border spacebetw"
      >
        <div>{{ $t('amount') }}</div>
        <div>{{ `${detail.base_currency.amount} ${detail.base_currency.name}` }}</div>
      </div>
      <div
        v-else
        class="cobo-succes-btn"
      >
        <van-button
          :class="['orange-btn']"
          size="large"
          round
          @click="onGoOrderDetail"
        >
          查看订单
        </van-button>
        <span class="cobo-succes-btn-info">
          请在 Cobo 云端钱包资产页查看您的购买资产
        </span>
      </div>
    </div>
    <div class="drawtips graycolor mt15">
      <template
        v-if="isProcessing"
      >
        <p>{{ $t('notice') }}:</p>
        <p>*  您的订单已被托管 aBTC 机器人，我们正在为您入账，如在交易高峰期，系统需要5-10分钟来处理订单，请您耐心等待。</p>
      </template>
      <template v-else-if="isSuccess" />
      <template v-else>
        <p>{{ $t('notice') }}:</p>
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
      // cobo 的特殊逻辑 buy_currency_success 买币成功仍然不算成功 要等下面isSuccess 划转成功才行
      // 当又是buy_currency_success 又划转成功 就不算处理中了 返回 flase
      if (this.detail.status === 'buy_currency_success' && this.isSuccess) return false

      return ['pay_success', 'processing', 'buy_currency_fail', 'buy_currency_success'].indexOf(this.detail.status) > -1
    },
    isSuccess() {
      if (!this.detail.partner_info) return false
      return this.detail.partner_info.transfer_status === 3 &&
        this.detail.partner_info.name === 'cobo'
    },
    calCountDownTime() {
      return this.$dayjs.unix(this.detail.created_at)
        .add(15, 'm')
        .diff(this.$dayjs(), 's')
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
    onGoOrderDetail() {
      // call cobo app method
      window.sendMessage && window.sendMessage(
        JSON.stringify({
          prefix: 'OTC_COIN_BOUGHT',
          payload: this.detail.base_currency.name
        })
      )
      this.$router.push({ name: 'orderList' })
    },
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
  padding: 5px 0 40px;
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
.cobo-notice{
  padding: 5px;
  width: 70%;
  background: #FAFAFA;
  border-radius: 15px;
  margin: 20px auto 0;
  font-size: 12px;
}
.cobo-succes-btn {
  margin-top: 40px;
}
.cobo-succes-btn-info {
  display: block;
  margin-top:40px;
  font-size: 12px;
  color: #666;
  text-align: center;
}
.order-listitem {
  line-height:70px;
  display:flex;
  border-bottom: 1px solid #EEEEEE;
  position: relative;
}
.no-border {
  border: none;
}
</style>
