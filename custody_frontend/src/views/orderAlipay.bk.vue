<template>
  <div class="container">
    <div class="comm-list">
      <div class="comm-listitem spacebetw ">
        <div>{{ $t('payee') }}</div>
        <div>{{ detail.name }}</div>
      </div>
      <div class="comm-listitem  spacebetw ">
        <div>{{ $t('transferamount') }}</div>
        <div>¥{{ detail.base_currency.amount }}</div>
      </div>
      <div class="comm-listitem  spacebetw ">
        <div>{{ $t('amount') }}</div>
        <div v-if="detail.quote_currency.amount">
          {{ `${detail.quote_currency.amount}${detail.quote_currency.name}` }}
        </div>
      </div>
      <div class="comm-listitem spacebetw ">
        <div>{{ $t('oddnumbers') }}</div>
        <CopyButton
          :text="detail.pay_order_id"
        />
      </div>
      <div class="alipay-alert">
        <p>请用本人实名的支付宝进行付款</p>
        <p>不要备注任何信息，否则不予放币</p>
      </div>
      <div class="comm-list-with-padding">
        <van-button
          size="large"
          round
          class="orange-btn mt30"
          @click="goToAlipay"
        >
          {{ $t('topay') }}
        </van-button>
        <van-button
          size="large"
          round
          class="green-btn bold mt30"
          @click="onProcessOrder"
        >
          {{ $t('donePay') }}
        </van-button>
        <div class="tc font13 mt10 graycolor">
          <CountDownMinute
            :time="calCountDownTime"
          /> {{ $t('after') }} {{ $t("cancelorder") }}
        </div>
      </div>
      <div class="drawtips graycolor mt15">
        <p>{{ $t('notice') }}:</p>
        <p>
          * 比特币到账数目以
          <router-link to="/legalActuallPrice">
            实际交割价格
          </router-link>
          为准。
        </p>
        <!-- <p>* 如需帮助，请联系aBTC客服，微信:{{ customWechat }}</p> -->
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Dialog } from 'vant'
import { CopyButton, CountDownMinute, Message, Indicator } from 'components'
export default {
  components: {
    CopyButton,
    CountDownMinute
  },
  data() {
    return {
      detail: {
        base_currency: {},
        quote_currency: {}
      },
      orderTimmerId: '',
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  computed: {
    calCountDownTime() {
      const date = this.detail.created_at ? this.$dayjs.unix(this.detail.created_at) : this.$dayjs()
      return date
        .add(15, 'm')
        .diff(this.$dayjs(), 's')
    }
  },
  mounted() {
    const { params, query } = this.$route
    DI.get('utils').setBackAction(() => {
      if (query.from) { // if from orderList page then go back
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    })
    DI.get('utils').setTitle(this.$t('orderdetail'))
    DI.get('vue').$emit('set-header-right', {
      text: '取消订单',
      action: this.cancelOrder
    })
    if (!params.order_id) {
      this.getOrderById(query.id)
      return
    }
    this.detail = params
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.orderTimmerId)
    next()
  },
  methods: {
    cancelOrder() {
      Dialog.confirm({
        title: '取消提示',
        message: '如果您已向卖家付款，请千万不要取消订单。（如果您当日取消订单达3笔，当日将无法使用购买功能）'
      }).then(() => {
        Indicator.open(this.$t('loading'))
        DI.get('orderHttp')
          .cancelOrder({
            order_id: this.detail.order_id
          })
          .then(() => {
            Message('取消订单成功')
            this.$router.push('/')
          })
          .catch(Message)
          .then(() => {
            Indicator.close()
          })
      }).catch(() => {})
    },
    getOrderById(id, isInterval = false) {
      if (!isInterval) Indicator.open(this.$t('loading'))
      DI.get('orderHttp')
        .getOrderDetailById(id)
        .then((res) => {
          this.detail = res
          if (isInterval) {
            if (res.status === 'buy_currency_success') {
              this.goToOrderDetail()
            }
          }
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    goToAlipay() {
      this.orderTimmerId = setInterval(() => {
        this.getOrderById(this.detail.order_id, true)
      }, 1000 * 3)
      window.open(this.detail.url, '_blank')
    },
    onProcessOrder() {
      Dialog.confirm({
        title: '付款确认',
        message: '\n请确认您已向卖方付款\r\n\n（恶意点击将会影响您账户的信用等级）'
      }).then(() => {
        Indicator.open(this.$t('loading'))
        DI.get('orderHttp')
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
    goToOrderDetail() {
      this.$router.push({
        name: 'orderDetail',
        query: { id: this.detail.order_id }
      })
    },
    backToHome () {
      this.$router.push({ name: 'buy' })
    }
  }
}
</script>
<style scope lang="less">
.drawtips {
  padding: 5px 20px 40px 20px;
  a {
    color: #f5a623;
    text-decoration: underline;
  }
}
.drawtips p {
  font-size:13px;
  margin-top:5px;
  line-height:26px
}
.alipay-alert {
  text-align: center;
  padding-top: 18px;
  font-size: 16px;
  font-weight: bold;
  color: red;
  p {
    padding: 5px 0;
  }
}
</style>
