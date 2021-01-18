<template>
  <div class="portfolio">
    <div class="top-field">
      <div class="field flex-all">
        <div class="name">
          投资时间
        </div>
        <div
          class="content flex-all"
          :class="{active: !isInvest}"
          @click="onClickRange"
        >
          <span>{{ rangePickerDisplayValue }}</span>
          <img
            v-if="!isInvest"
            src="../../assets/images/portfolio/more.png"
          >
        </div>
      </div>
    </div>
    <div class="mid-field">
      <div class="title flex-all">
        <div class="main">
          投资总额：{{ investTotalAmount }}元
        </div>
        <div
          v-show="!isInvest"
          class="add flex-all touch-opacity"
          @click="onAddClick"
        >
          <img src="../../assets/images/portfolio/add.png">
          <span>编辑币种</span>
        </div>
      </div>
      <div class="coin-list">
        <div
          v-for="item in coinArr"
          :key="item.currency"
          class="item flex-all"
        >
          <div class="left flex-all">
            <div class="icon">
              <img :src="getIconUrl(item.currency)">
            </div>
            <div class="name">
              <div class="top">
                {{ item.currency }}
              </div>
              <div class="bottom">
                {{ getCoinNameCn(item.currency) }}
              </div>
            </div>
          </div>
          <div class="right">
            <AmountInput
              :display-only="isInvest"
              :amount="item.amount"
              @change="(e) => onAmountInputChange(e, item)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mid-chart">
      <WalletPie
        v-if="indicator.plan && chart.amount"
        :original-mode="true"
        :labels="chart.labels"
        :balance="chart.balance"
        :total="chart.amount"
        :animation="true"
        title="配仓分布"
      />
    </div>
    <div class="operation">
      <div class="action flex-all">
        <template v-if="type === 'new'">
          <van-button
            size="large"
            round
            class="blue-btn-o"
            @click="onGoToGuide"
          >
            新手定投指南
          </van-button>
          <van-button
            size="large"
            round
            class="blue-btn gap"
            @click="onBtnCreatePlan"
          >
            开启定投
          </van-button>
        </template>
        <template v-if="type === 'invest'">
          <van-button
            size="large"
            round
            class="blue-btn-o"
            @click="onBtnCancelPlan"
          >
            取消计划
          </van-button>
          <van-button
            size="large"
            round
            class="blue-btn-o gap"
            @click="onBtnUpdatePlan"
          >
            修改计划
          </van-button>
          <van-button
            size="large"
            round
            class="blue-btn gap"
            @click="onBtnPay"
          >
            立即买入
          </van-button>
        </template>
        <template v-if="type === 'update'">
          <van-button
            size="large"
            round
            class="blue-btn-o"
            @click="onBtnCancelUpdate"
          >
            放弃修改
          </van-button>
          <van-button
            size="large"
            round
            class="blue-btn gap"
            @click="onBtnConfirmUpdate"
          >
            确认修改
          </van-button>
        </template>
      </div>
    </div>
    <RangePicker
      ref="rangePicker"
      :pick-value="rangePickerValue"
      @change="onRangePickerChange"
    />
    <CoinPicker
      ref="coinPicker"
      :coin-selection="coinArr"
      @change="onCoinPickerChange"
      @ready="onCoinPickerReady"
    />
    <PopUp
      ref="cancelPopup"
      title="计划取消"
      :hide-btn="true"
    >
      <div class="cancel-popup">
        <p style="marginBottom: 10px">
          计划取消后，系统将不再定期提醒您
        </p>
        <van-button
          size="large"
          round
          class="blue-btn"
          @click="omBtnCancelPlanConfirm"
        >
          确认取消
        </van-button>
        <van-button
          size="large"
          round
          class="blue-btn-o"
          @click="omBtnCancelPlanPopupCancel"
        >
          我再想想
        </van-button>
      </div>
    </PopUp>
    <PopUp
      ref="confirmPopup"
      title="定投确认"
      :hide-btn="true"
    >
      <div class="cancel-popup">
        <p>系统将会{{ rangePickerDisplayValue }}</p>
        <p style="marginBottom: 10px">
          发送短信提醒
        </p>
        <van-button
          size="large"
          round
          class="blue-btn"
          @click="omBtnCreatePlanConfirm"
        >
          确认定投
        </van-button>
        <van-button
          size="large"
          round
          class="blue-btn-o"
          @click="omBtnCreatePlanPopupCancel"
        >
          取消
        </van-button>
      </div>
    </PopUp>
    <HeaderRightShare />
  </div>
</template>

<script>
import { DI } from 'core'
import { Toast } from 'vant'
import { Message, Indicator, PopUp, HeaderRightShare } from 'components'
import WalletPie from "../walletPie"
import AmountInput from "./amountInput"
import RangePicker from "./rangePicker"
import CoinPicker from "./coinPicker"
import debounce from '@kpi/u/debounce'

const initCoinAmount = 500
export default {
  components: {
    WalletPie,
    RangePicker,
    CoinPicker,
    AmountInput,
    PopUp,
    HeaderRightShare
  },
  data() {
    return {
      rangePickerValue: [],
      rangePickerDisplayValue: '',
      coinArr: [],
      chart: {},
      indicator: {},
      type: ''
    }
  },
  computed: {
    investTotalAmount() {
      return this.coinArr.reduce(((a, b) => a + b.amount), 0)
    },
    storeOtcCoinSetting() {
      return DI.get("store").state.setting.otcCoinSetting || []
    },
    isInvest() {
      return this.type === 'invest'
    }
  },
  watch: {
    coinArr: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length) {
          this.debounceOnCoinArrChange()
        }
      }
    },
    type: {
      immediate: true,
      handler(val) {
        if (val === 'invest') {
          DI.get("utils").setTitle("定投计划")
        } else {
          DI.get("utils").setTitle("定投设置")
        }
        if (val === 'update') {
          DI.get('utils').setBackAction(() => {
            this.onBtnCancelUpdate()
          })
        } else {
          DI.get('utils').revertBackAction()
        }
      }
    }
  },
  mounted() {
    this.getPlan()
  },
  created () {
    this.debounceOnCoinArrChange = debounce(this.onCoinArrChange, 200)
  },
  methods: {
    onCoinArrChange() {
      this.$set(this.chart, 'amount', 0)
      this.$nextTick(() => {
        const labels = []
        const balance = {}
        let amount = 0
        this.coinArr.forEach((i) => {
          if (i.amount) {
            labels.push(i.currency)
            balance[i.currency] = i.amount
            amount += i.amount
          }
        })
        this.$set(this.chart, 'amount', amount)
        this.$set(this.chart, 'labels', labels)
        this.$set(this.chart, 'balance', balance)
      })
    },
    setPlanValue() {
      this.coinArr = JSON.parse(JSON.stringify(this.plan.profolio))
      this.$refs.rangePicker.setValue(
        this.plan.period_type,
        this.plan.period_interval,
        this.plan.period_num
      )
    },
    getPlan() {
      Indicator.open(this.$t("loading"))
      DI.get('portfolioHttp')
        .getPlan()
        .then((res) => {
          this.plan = res.plans[0] || {}
          this.type = this.plan.id ? 'invest' : 'new'
          if (this.plan.id) {
            this.setPlanValue()
          } else {
            this.setInitValue()
          }
        })
        .catch(Message)
        .then(() => {
          this.closeIndicator('plan')
        })
    },
    makeInvestData() {
      const data = {
        period_type: this.rangePickerValue[0].v,
        period_interval: this.rangePickerValue[1].v,
        profolio: this.coinArr
      }
      if (this.rangePickerValue[2]) {
        data.period_num = this.rangePickerValue[2].v
      }
      return data
    },
    createPlan() {
      Indicator.open('提交中')
      const data = this.makeInvestData()
      DI.get('portfolioHttp')
        .createPlan(data)
        .then((res) => {
          Toast.success('定投提醒设置成功')
          window.scroll(0, 0)
          this.plan.id = res.plan_id
          this.type = 'invest'
          this.coinArr = this.coinArr.filter(i => i.amount > 0)
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    updatePlan() {
      Indicator.open('提交中')
      const data = this.makeInvestData()
      data.plan_id = this.plan.id
      DI.get('portfolioHttp')
        .updatePlan(data)
        .then(() => {
          Message('更新成功')
          this.type = 'invest'
          this.coinArr = this.coinArr.filter(i => i.amount > 0)
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    cancelPlan() {
      Indicator.open('提交中')
      DI.get('portfolioHttp')
        .cancelPlan({
          plan_id: this.plan.id
        })
        .then(() => {
          Message('取消成功')
          this.type = 'new'
          this.setInitValue(true)
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    closeIndicator(item) {
      this.$set(this.indicator, item, true)
      if (this.indicator.plan && this.indicator.coin) {
        Indicator.close()
      }
    },
    setInitValue(isClear = false) {
      this.$refs.rangePicker.setValue(2,1,1)
      if (isClear) {
        this.coinArr = []
        this.$nextTick(() => {
          this.$refs.coinPicker.setInitValue()
        })
      }
    },
    getCoinSetting(name) {
      if (!this.storeOtcCoinSetting) return {}
      return this.storeOtcCoinSetting.find(i => i.name === name) || {}
    },
    getCoinNameCn(name) {
      return this.getCoinSetting(name).cn_name
    },
    getIconUrl(name) {
      return DI.get('utils')
        .getCoinIconUrlFromSetting(name, this.getCoinSetting(name))
    },
    onAddClick() {
      this.$refs.coinPicker.onOpen()
    },
    onClickRange() {
      if (this.isInvest) return
      this.$refs.rangePicker.onOpen()
    },
    onRangePickerChange(val) {
      this.rangePickerValue = val.value
      this.rangePickerDisplayValue = val.display
    },
    onCoinPickerReady() {
      this.closeIndicator('coin')
    },
    onCoinPickerChange(e, item) {
      if (e) { //add
        if (this.coinArr.length >= 8) {
          Message('最多同时配仓8个币种')
          return
        }
        this.coinArr.push({
          currency: item.name,
          amount: initCoinAmount
        })
      } else { // remove
        const nextCoinArr = this.coinArr.filter(i => i.currency !== item.name)
        if (!nextCoinArr.length) {
          Message('请至少选择一个币种')
          return
        }
        this.coinArr = nextCoinArr
      }
    },
    onAmountInputChange(e, item) {
      this.coinArr.find(i => i.currency === item.currency).amount = e
    },
    planCheck() {
      if (this.investTotalAmount < 100) {
        Message('单笔投资金额不能小于 100')
        return false
      }
      if (this.investTotalAmount > 50000) {
        Message('单笔投资金额不能大于 50000')
        return false
      }
      return true
    },
    onBtnCreatePlan() {
      this.$refs.confirmPopup.onOpen()
    },
    omBtnCreatePlanPopupCancel() {
      this.$refs.confirmPopup.onClose()
    },
    omBtnCreatePlanConfirm() {
      if (this.planCheck()) {
        this.createPlan()
        this.omBtnCreatePlanPopupCancel()
      }
    },
    onBtnCancelPlan() {
      this.$refs.cancelPopup.onOpen()
    },
    omBtnCancelPlanPopupCancel() {
      this.$refs.cancelPopup.onClose()
    },
    omBtnCancelPlanConfirm() {
      this.cancelPlan()
      this.omBtnCancelPlanPopupCancel()
    },
    onBtnUpdatePlan() {
      this.type = 'update'
    },
    onBtnCancelUpdate() {
      this.type = 'invest'
      this.setPlanValue()
    },
    onBtnConfirmUpdate() {
      if (this.planCheck()) {
        this.updatePlan()
      }
    },
    onGoToGuide() {
      this.$router.push({
        name: 'guidePortfolio',
        query: {
          fromRoute: 'portfolio'
        }
      })
    },
    onBtnPay() {
      this.$router.push({
        name: 'payment',
        params: {
          price: this.investTotalAmount,
          planId: this.plan.id,
          coinArr: this.coinArr
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.portfolio {
  padding: 10px 30px;
  .top-field {
    .field {
      padding: 20px 0;
      border-bottom: 1px solid #EEEEEE;
      .name {
        opacity: 0.6;
        font-size: 14px;
        color: #222222;
      }
      .content {
        opacity: 0.6;
        font-size: 16px;
        color: #222222;
        img {
          display: inline-block;
          width: 8px;
          margin-left: 5px;
        }
      }
      .active {
        opacity: 1;
      }
    }
  }
  .mid-field {
    margin-top: 20px;
    .title {
      margin-bottom: 10px;
      .main {
        opacity: 0.6;
        font-size: 14px;
        color: #222222;
      }
      .add {
        font-size: 14px;
        color: #4691F9;
        img {
          width: 15px;
          height: 15px;
          padding-right: 3px;
        }
      }
    }
    .coin-list {
      .item {
        padding: 13px 0;
        border-bottom: 1px solid #EEEEEE;
        .icon {
          img {
            height: 28px;
            width: 28px;
          }
        }
        .name {
          margin-left: 10px;
          .top{
            font-size: 16px;
            color: #222222;
          }
          .bottom{
            opacity: 0.3;
            font-size: 10px;
            color: #000000;
          }
        }
        .right {
          margin-left: 10px;
          .input {
            font-size: 18px;
            color: #222222;
          }
        }
      }
    }
  }
  .mid-chart {
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .operation {
    background: #FFF;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .action {
      margin: 20px;
      .gap {
        margin-left: 20px;
      }
    }
  }
  .cancel-popup {
    padding: 0px 10px;
    margin-bottom: -20px;
    p {
      opacity: 0.6;
      font-size: 14px;
      color: #000000;
      text-align: center;
      padding-bottom: 5px;
    }
    button {
      margin: 10px 0;
    }
  }
}
</style>
