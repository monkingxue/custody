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
          src="../assets/images/icon10.png"
        >
      </div>
      <div class="tc orangecolor mt20 bold font18">
        请稍候，订单处理中
      </div>
    </div>
    <div v-else-if="isSuccess">
      <div class="orangeclock">
        <img
          src="../assets/images/icon11.png"
        >
      </div>
      <div class="tc greencolor mt20 bold font18">
        {{ $t('completeorder2') }}
      </div>
    </div>
    <div v-else>
      <div class="orangeclock">
        <img
          src="../assets/images/icon12.png"
        >
      </div>
      <div class="tc mt20 bold font18">
        {{ $t('failedOrder') }}
      </div>
    </div>
    <div class="comm-list font14">
      <div
        v-if="isSuccess"
        class="comm-notice font16 success-notice"
      >
        <template v-if="isRegularInvest">
          您已成功定投 {{ detail.quote_currency.amount }} 元
        </template>
        <template v-else>
          成功支付 {{ detail.quote_currency.amount }} 元，{{ detail.base_currency.amount }} {{ detail.base_currency.name }} 已转入钱包
        </template>
      </div>
      <template v-if="isRegularInvest && isSuccess">
        <div
          class="order-listitem spacebetw mt30 "
        >
          <div>订单明细</div>
        </div>
        <div class="coin-list">
          <div
            v-for="coin in detail.profolio"
            :key="coin.currency"
            class="flex-all coin-list-item"
          >
            <div>{{ coin.amount }} {{ coin.currency }}</div>
            <div>{{ coin.cny_amount }} 元</div>
          </div>
        </div>
        <div
          class="order-listitem spacebetw"
        />
      </template>
      <div
        class="order-listitem spacebetw"
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
        v-if="!isSuccess && !isRegularInvest"
        class="order-listitem no-border spacebetw"
      >
        <div>{{ $t('amount') }}</div>
        <div>{{ `${detail.base_currency.amount} ${detail.base_currency.name}` }}</div>
      </div>
      <div
        v-else
        class="succes-btn"
      >
        <van-button
          :class="['orange-btn']"
          size="large"
          round
          @click="onGoAsset"
        >
          查看资产
        </van-button>
      </div>
    </div>
    <div class="drawtips graycolor mt15">
      <template
        v-if="isProcessing"
      >
        <p>{{ $t('notice') }}:</p>
        <p>* 您的订单已收到；我们正在为您入账。如在交易高峰期，系统需要5-10分钟来处理订单，请您耐心等待。</p>
      </template>
      <template v-else-if="isSuccess" />
      <template v-else>
        <!-- <p>{{ $t('notice') }}:</p> -->
        <!-- <p>* 如订单取消有误，请联系aBTC客服，微信号：{{ customWechat }}</p> -->
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
      return ['pay_success', 'processing', 'buy_currency_fail'].indexOf(this.detail.status) > -1
    },
    isSuccess() {
      return this.detail.status === 'buy_currency_success'
    },
    calCountDownTime() {
      return this.$dayjs.unix(this.detail.created_at)
        .add(15, 'm')
        .diff(this.$dayjs(), 's')
    },
    isRegularInvest() {
      return this.detail.tag === "regular_investing"
    }
  },
  mounted() {
    DI.get('utils').setTitle('订单详情')
    const { query } = this.$route
    if (!query.id) {
      Message('订单 ID 错误')
      return
    }
    DI.get('utils').setBackAction(() => {
      if (query.from === 'orderListOtc') {
        this.$router.go(-1)
        return
      }
      this.$router.push({ name: 'orderList' })
    })
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
    onGoAsset() {
      this.$router.push({ name: 'wallet' })
    },
    getOrderDetail() {
      DI.get('orderHttp')
        .getOrderDetailById(this.orderId)
        .then((res) => {
          DI.get('utils').clearPollingToast(res, 'orderDetail')
          this.detail = res
        })
        .catch((message) => {
          DI.get('utils').pollingToast(message, 'orderDetail')
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
.order-listitem {
  line-height:70px;
  display:flex;
  position: relative;
  border-bottom: 1px solid #EEEEEE;
}
.no-border {
  border: none;
}
.success-notice{
  padding: 5px;
  width: 70%;
  background: #FAFAFA;
  border-radius: 15px;
  margin: 20px auto 0;
  font-size: 12px;
}
.succes-btn {
  margin-top: 40px;
}
.coin-list {
  padding: 10px 0;
}
.coin-list-item {
  font-size: 12px;
  color: #666;
  padding: 4px 0;
}
</style>
