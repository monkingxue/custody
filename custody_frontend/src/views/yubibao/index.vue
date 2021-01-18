<template>
  <div class="vip-detail">
    <div class="top-block">
      <div class="flex-left-right top-text">
        <div class="left">
          <div class="title flex-align">
            <span>昨日收益（元）</span>
            <img
              v-if="visible"
              src="../../assets/images/account-visible.png"
              @click.stop="visibleSet"
            >
            <img
              v-else
              src="../../assets/images/account-invisible.png"
              @click.stop="visibleSet"
            >
          </div>
          <div class="yestarday din">
            {{ visible ? storeYubibaoBalance.yesterday_interest_cny_total : '****' }}
          </div>
        </div>
        <div class="right">
          <img src="../../assets/images/yubibao/icon-main.png">
        </div>
      </div>
      <div class="flex-left-right top-text">
        <div class="total">
          累计收益: {{ visible ? storeYubibaoBalance.interest_cny_total : '****' }}
        </div>
        <div class="total-balance">
          理财总资产: {{ visible ? storeYubibaoBalance.balance_cny_total : '****' }}
        </div>
      </div>
    </div>
    <div
      v-if="displayProject.my.length"
      class="content"
    >
      <div class="list-title flex-all">
        <div class="main-title">
          我的理财
        </div>
      </div>
      <div class="list">
        <div
          v-for="item in displayProject.my"
          :key="item.key"
          @click="() => {onClickCoin(item)}"
        >
          <YbbItem
            :item="item"
            :visible="visible"
          />
        </div>
      </div>
    </div>
    <div class="content">
      <div class="list-title flex-all">
        <div class="main-title">
          理财产品
        </div>
        <div
          class="flex-all touch"
          @click="onTipClick"
        >
          <span>什么是余币宝</span>
          <img
            src="../../assets/images/icon18.png"
            width="12"
            height="12"
          >
        </div>
      </div>
      <div class="list">
        <div
          v-for="item in displayProject.avaliable"
          :key="item.key"
          @click="() => {onClickCoin(item)}"
        >
          <YbbItem
            :item="item"
            :visible="visible"
          />
        </div>
      </div>
    </div>
    <div class="more">
      <div class="content1">
        <span>敬请期待更多产品</span>
      </div>
    </div>
    <PopUp
      ref="yubibaopopup"
      btn-class="brown-btn"
      title="余币宝说明"
    >
      <div style="padding: 0 0 10px">
        余币宝是 aBTC 推出的一款具备低风险、收益稳定、随存随取等特点的币币增值产品。利息随平台收益动态调整，百分百保本。
      </div>
    </PopUp>
    <PopUp
      ref="yubibaoVipPopup"
      btn-class="brown-btn"
      title="VIP用户专享"
    >
      <div style="padding: 0 0 10px">
        持有等值 0.01 BTC 数字资产的用户，即可成为平台 VIP，开通「余币宝」功能。
      </div>
    </PopUp>
    <HeaderRightShare />
  </div>
</template>
<script>
import { DI } from "core"
import { PopUp, HeaderRightShare } from 'components'
import BalanceMixin from './balanceMixin'
import YbbItem from './item'

const USER_ACCOUNT_SHOW = 'USER_ACCOUNT_SHOW'

export default {
  components: {
    PopUp,
    HeaderRightShare,
    YbbItem
  },
  mixins: [BalanceMixin],
  data() {
    return {
      visible: DI.get("offlineStorage").get(USER_ACCOUNT_SHOW) !== 'invisible'
    }
  },
  computed: {
    storeAccount() {
      return DI.get('auth').getUser()
    },
    isYubibaoOpen() {
      return this.storeAccount.credit_vip_level > 0
    },
    displayProject() {
      const projects = {
        my: [],
        avaliable: []
      }
      if (this.storeYubibaoSetting.length && this.storeYubibaoBalance.interest_cny_total &&
      this.storeYubibaoContract.vip_settings) {
        this.storeYubibaoSetting.map(((each) => ({
          key: `H-${each.coin_name}`,
          projectType: 'H',
          ...each,
          ...this.storeYubibaoBalance.current.find(_ => each.coin_name === _.currency)
        }))).forEach((each) => {
          if (each.balance > 0) {
            projects.my.push({
              displayType: 'my',
              ...each
            })
          } else {
            projects.avaliable.push({
              displayType: 'avaliable',
              ...each
            })
          }
        })
        this.storeYubibaoBalance.contract.map((each) => ({
          projectType: 'D',
          key: `D-${each.currency}-${each.contract_id}`,
          ...this.storeYubibaoSetting.find(_ => _.coin_name === each.currency),
          ...this.storeYubibaoContract.contract_templates.find(_ => each.contract_template_id === _.id),
          ...each
        })).forEach((each) => {
          projects.my.push({
            displayType: 'my',
            ...each
          })
        })
        this.storeYubibaoContract.contract_templates.map((each) => ({
          projectType: 'D',
          key: `D-${each.currency}-${each.id}`,
          ...this.storeYubibaoBalance.contract.find(_ => each.id === _.contract_template_id),
          ...this.storeYubibaoSetting.find(_ => _.coin_name === each.currency),
          ...each
        })).forEach((each) => {
          projects.avaliable.push({
            displayType: 'avaliable',
            ...each
          })
        })
      }
      return projects
    }
  },
  mounted() {
    DI.get('utils').setBody('bacgray')
    DI.get("utils").setTitle("")
  },
  methods: {
    visibleSet() {
      this.visible = !this.visible
      DI.get("offlineStorage").set(USER_ACCOUNT_SHOW, this.visible ? 'visible' : 'invisible')
    },
    onClickCoin(item) {
      if (!this.isYubibaoOpen) {
        this.$refs.yubibaoVipPopup.onOpen()
        return
      }
      const isContract = item.projectType === 'D'
      if (!isContract && item.use_before) {
        this.$router.push({ name: 'yubibaoOperation', query: {
          coin: item.coin_name,
          id: item.id
        } })
        return
      }
      if (isContract && item.contract_id && item.displayType !== "avaliable") {
        this.$router.push({ name: 'yubibaoOperationContractDetail', query: {
          coin: item.coin_name,
          id: item.contract_id
        } })
        return
      }
      if (item.projectType === 'H') {
        this.$router.push({ name: 'yubibaoIntro', query: {
          coin: item.coin_name
        } })
        return
      }
      this.$router.push({ name: 'yubibaoIntro', query: {
        coin: item.coin_name,
        id: item.id,
        type: item.projectType
      } })
    },
    onTipClick() {
      this.$refs.yubibaopopup.onOpen()
    },
    getIconUrl(name, setting) {
      return DI.get('utils')
        .getCoinIconUrlFromSetting(name, setting)
    }
  }
}
</script>
<style scoped lang="less">
.vip-detail {
  .top-block {
    padding: 30px 20px;
    color: #FFF;
    background: url('../../assets/images/yubibao/bg.png') #D7AE79 no-repeat;
    background-size:100%;
    background-position: bottom;
    .top-text {
      padding: 0 10px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .right {
      img {
        width: 60px;
        padding-top: 20px;
      }
    }
    .title {
      display: flex;
      align-items: center;
      img {
        vertical-align: text-top;
        width: 19px;
        height: 14px;
        display: inline-block;
      }
    }
    .yestarday {
      font-size: 38px;
      margin-top: 10px;
    }
    .total {
      font-size: 12px;
      margin-top: 6px;
    }
    .total-balance {
      margin-top: 6px;
      font-size: 12px;
    }
  }
  .content {
    padding: 0 20px 20px;
    font-size: 14px;
    color: #222222;
    .main-title {
      font-weight: bold;
    }
    .list-title {
      font-size: 14px;
      padding: 15px 0;
      span {
        opacity: 0.6;
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
  .more {
    position: relative;
    padding-bottom: 10px;
    .content1 {
      position: relative;
      text-align: center;
    }
    span{
      position: relative;
      font-size: 12px;
      line-height: 12px;
      color: #cacaca;
      background: #f1f2f4;
      padding: 0 10px;
      z-index: 10;
    }
    &::before {
      z-index: 4;
      content: "";
      position: absolute;
      left: 40px;
      right: 40px;
      top: 8px;
      background: #cacaca;
      height: 1px;
      bottom: 0;
    }
  }
}
</style>
