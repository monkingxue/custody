<template>
  <div class="myAssets">
    <div class="total">
      <div class="flex-left-right">
        <div class="title flex-align">
          <span>
            {{ $t('wallet.estimatedBalance') }}
            ({{ $t('yuan') }})
          </span>
          <span
            class="visibleSet"
            @click.stop="visibleSet"
          >
            <img
              v-if="visible && account.cny_total"
              src="../../assets/images/account-visible.png"
            >
            <img
              v-else
              src="../../assets/images/account-invisible.png"
            >
          </span>
        </div>
        <div
          class="secure-label"
          @click="goSecure"
        >
          <img
            src="../../assets/images/icon-shield.png"
            width="14"
            height="16"
            class="mr5"
          >
          {{ $t('wallet.assetsSecured') }}
        </div>
      </div>
      <div class="flex-left-right">
        <div
          v-if="account.cny_total"
          class="amount"
          style="font-family: helvetica;"
        >
          <div class="btc">
            <span v-if="!account.cny_total">---</span>
            <ScrollNumber
              v-else-if="visible"
              :height="38"
              :width="21"
              class="total-asset-num"
              :number="account.cny_total"
            />
            <span v-else>****</span>
          </div>
          <div class="rmb">
            ≈ {{ `${!account.btc_total ? '---' : visible ? account.btc_total : '****'}` }} BTC
          </div>
        </div>
        <div
          v-else
          class="amount no-login"
          @click="isLogin"
        >
          {{ $t("me.title") }}
        </div>
        <div
          class="pie-chart"
          @click="goAssetAnalysis"
        >
          <img src="../../assets/images/icon-pie-chart.png">
        </div>
      </div>
      <div class="mine-button">
        <div
          class="touch-opacity"
          @click="goWithdraw"
        >
          <img src="../../assets/images/withdraw.png">
          <span>{{ $t('wallet.withdrawl') }}</span>
        </div>
        <div
          class="touch-opacity"
          @click="goDeposit"
        >
          <img src="../../assets/images/deposit.png">
          <span>{{ $t('wallet.deposit') }}</span>
        </div>
        <div
          v-if="false"
          class="touch-opacity"
          @click="onYubibaoClick"
        >
          <span :class="{'yubibaoDot': yubibaoDotInfo}">
            <img
              src="../../assets/images/yubibao.png"
            >
          </span>
          <span>{{ $t('wallet.yubibao') }}</span>
        </div>
      </div>
    </div>
    <div
      class="yubibao touch-opacity"
      @click="goYubibao"
    >
      <div class="flex-all">
        <div class="title">
          余币宝资产估值（元）
        </div>
        <div class="arrow">
          <img
            width="10"
            src="../../assets/images/yubibao/arrow-white.png"
          >
        </div>
      </div>
      <div class="flex-all">
        <div class="total-in din">
          <template v-if="isAuthenticated">
            {{ visible ? (storeYubibaoBalance.balance_cny_total >= 0 ? storeYubibaoBalance.balance_cny_total : '---'): '****' }}
          </template>
          <template v-else>
            ---
          </template>
        </div>
        <div class="yestarday-in">
          <div class="top">
            昨日收益
          </div>
          <div class="bottom din">
            <template v-if="isAuthenticated">
              {{ visible ? (storeYubibaoBalance.yesterday_interest_cny_total>= 0 ? `+${storeYubibaoBalance.yesterday_interest_cny_total}`: '---') : '****' }}
            </template>
            <template v-else>
              ---
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-left-right toolbar">
      <div :class="['hide-small', hideSmallFlag === 'hide' && 'cur']">
        <span
          class="flex"
          @click="hideSmallEvent"
        >
          <span class="check-box" />{{ $t('wallet.hideSmallBalances') }}
        </span>
        <img
          src="../../assets/images/icon18.png"
          width="13"
          @click="showHideSmallTips"
        >
      </div>
      <van-search
        v-model="searchKey"
        :placeholder="searchPlaceholder"
        class="wallet-search-box"
        background="#F1F2F4"
      />
    </div>
    <div
      v-if="initCoinList"
      class="list"
    >
      <ul v-if="BISort.length">
        <li
          v-for="item in displayCoinListArr"
          :key="item"
          @click="() => goToAsset(item)"
        >
          <div
            class="bi-item touch"
          >
            <div class="item-left">
              <img
                v-if="getIconUrl(item)"
                :src="getIconUrl(item)"
              >
              <div class="info title">
                <span>{{ item }}</span>
                <!-- <span>持仓盈亏：-18.7元</span> -->
              </div>
            </div>
            <div class="info amount">
              <span class="din">{{ account.balance[item] | toFixed(4) }}</span>
              <span>{{ account.cny_balance && account.cny_balance[item] }} {{ $t('yuan') }}</span>
            </div>
          </div>
        </li>
        <LoadMore
          v-if="displayPageSize < BISort.length"
          v-element-in-view="loadMoreCoins"
        />
      </ul>
      <ul v-else>
        <li
          v-for="item in Object.keys(BI)"
          :key="item"
          class="bi-item"
          @click="isLogin"
        >
          <div class="item-left">
            <img :src="BI[item]">
            <div class="info title">
              <span>{{ item }}</span>
            </div>
          </div>
          <div class="info amount">
            <span class="din">---</span>
            <span>--- {{ $t('yuan') }}</span>
          </div>
        </li>
      </ul>
    </div>
    <PopUp
      ref="yubibaopopup"
      btn-class="brown-btn"
      btn-text="查看"
      @confirm="onYubibaoPopupConfirm"
      @close="onYubibaoPopupClose"
    >
      <div class="yubibao-popup">
        <div class="title">
          <img src="../../assets/images/yubibao/icon-popup.png">
          <span>{{ $t('wallet.yubibaoPopupTitle') }}</span>
        </div>
        <div
          v-if="yubibaoDotInfo"
          class="body"
        >
          <div class="info">
            <div class="top">
              {{ $t('wallet.yubibaoPopupYesterday') }}
            </div>
            <div class="bottom din">
              {{ yubibaoDotInfo.event_detail.yesterday_interest_cny }}
            </div>
          </div>
          <div class="info">
            <div class="top">
              {{ $t('wallet.yubibaoPopupTotal') }}
            </div>
            <div class="bottom din">
              {{ yubibaoDotInfo.event_detail.interest_cny }}
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  </div>
</template>

<script>
import { DI } from 'core'
import { Dialog } from 'vant'
import { ScrollNumber, LoadMore, PopUp } from 'components'
import BalanceMixin from '../yubibao/balanceMixin'

const USER_ACCOUNT_SHOW = 'USER_ACCOUNT_SHOW'
const BIBI_USER_SELECT_CHONGBI = 'BIBI_USER_SELECT_CHONGBI'
const BIBI_USER_SELECT_TIBI = 'BIBI_USER_SELECT_TIBI'
const HIDE_SMALL_ASSETS = 'HIDE_SMALL_ASSETS'

const DISPLAY_COIN_PAGESIZE = 10

export default {
  components: {
    ScrollNumber,
    PopUp,
    LoadMore
  },
  mixins: [BalanceMixin],
  data() {
    return {
      BI: DI.get('BI_LOCAL_ICON'),
      visible: DI.get("offlineStorage").get(USER_ACCOUNT_SHOW) !== 'invisible',
      hideSmallFlag: DI.get("offlineStorage").get(HIDE_SMALL_ASSETS, 'display'),
      searchKey: "",
      initCoinList: false,
      displayPageSize: DISPLAY_COIN_PAGESIZE,
      yubibaoDotInfo: false
    }
  },
  computed: {
    isAuthenticated() {
      return DI.get('auth').isAuthenticated()
    },
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    account() {
      return DI.get('auth').getUser()
    },
    cnyBalance(){
      return DI.get('auth').getUser().cny_balance
    },
    displayCoinListArr() {
      return this.BISort.slice(0, this.displayPageSize)
    },
    BISort() {
      return this.cnyBalance && this.biInfo
        ? Object.keys(this.biInfo).sort(
          (a, b) => {
            const cnyB = this.cnyBalance[b] ? this.cnyBalance[b] : 0
            const cnyA = this.cnyBalance[a] ? this.cnyBalance[a] : 0
            return cnyB - cnyA
          }
        ).filter((item) => {
          if (this.hideSmallFlag !== 'display') {
            return +this.account.cny_balance[item] >= 70
          }
          if (this.searchKey !== '') {
            return +item.indexOf(this.searchKey.toUpperCase()) > -1
          }
          return item
        })
        : []
    },
    BISortValued(){
      return this.BISort.filter(bi => +this.cnyBalance[bi] > 0)
    },
    isSetPassword() {
      return this.account.set_fund_password
    },
    isSetCardNumber() {
      return this.account.set_card_number
    },
    searchPlaceholder() {
      return this.$t("search.searchTokenPlaceholder")
    },
    storeNotification() {
      return DI.get("store").state.notification.notification
    }
  },
  watch: {
    'storeNotification.yubibao_interest_update': {
      immediate: true,
      handler(val) {
        if (!val) return
        this.yubibaoDotInfo = val[0]
      }
    },
    searchKey() {
      this.displayPageSize = DISPLAY_COIN_PAGESIZE
    }
  },
  mounted() {
    DI.get("auth").syncUser()
    this.$nextTick(() => {
      this.initCoinList = true
    })
  },
  methods: {
    loadMoreCoins() {
      setTimeout(() => {
        this.displayPageSize += DISPLAY_COIN_PAGESIZE
      }, 200)
    },
    getIconUrl(target) {
      return this.biInfo && this.biInfo[target] && !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get('BI_LOCAL_ICON')[target]
    },
    goDeposit() {
      if(!this.confirm(true))return
      const depositItem = DI.get('offlineStorage').get(BIBI_USER_SELECT_CHONGBI, 'BTC')
      this.$router.push({ name: 'deposit',
        query: {
          target: depositItem
        }
      })
    },
    goWithdraw() {
      if(!this.confirm())return
      const withdrawItem = DI.get('offlineStorage').get(BIBI_USER_SELECT_TIBI, 'BTC')
      this.$router.push({ name: 'withdraw',
        query: {
          target: withdrawItem
        }
      })
    },
    goSecure() {
      if (!this.isLogin()) return
      this.$router.push({
        name: 'safeDescription'
      })
    },
    isLogin() {
      if (!this.account.identity && !DI.get("auth").getToken().token) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      return true
    },
    confirm(skipAuthenticated){
      if (!this.isLogin()) return
      if (!skipAuthenticated && !this.isSetCardNumber) {
        Dialog.confirm({
          message: '请先进行身份认证'
        }).then(() => {
          this.$router.push({ name: 'realname' })
        }).catch(() => {})
        return
      }
      if (!this.isSetPassword) {
        Dialog.confirm({
          message: '请先设置资金密码'
        }).then(() => {
          this.$router.push({ name: 'password' })
        }).catch(() => {})
        return
      }
      return true
    },
    visibleSet() {
      this.visible = !this.visible
      DI.get("offlineStorage").set(USER_ACCOUNT_SHOW, this.visible ? 'visible' : 'invisible')
    },
    goToAsset(target) {
      this.$router.push({
        name: 'asset',
        query: {
          target: target
        }
      })
    },
    goAssetAnalysis() {
      if (!this.isLogin()) return
      this.$router.push({
        name: 'assetAnalysis'
      })
    },
    onYubibaoPopupConfirm() {
      this.onYubibaoPopupClose()
      this.goYubibao()
    },
    onYubibaoPopupClose() {
      DI.get('store').dispatch('READ_NOTIFICATION_BY_ID', { id: this.yubibaoDotInfo.message_id })
      this.yubibaoDotInfo = false
    },
    onYubibaoClick() {
      if (this.yubibaoDotInfo) {
        this.$refs.yubibaopopup.onOpen()
        return
      }
      this.goYubibao()
    },
    goYubibao() {
      this.$router.push({
        name: 'yubibao'
      })
    },
    hideSmallEvent() {
      if (!this.isLogin()) return
      this.hideSmallFlag = this.hideSmallFlag === 'hide' ? 'display' : 'hide'
      DI.get("offlineStorage").set(HIDE_SMALL_ASSETS, this.hideSmallFlag)
      this.displayPageSize = DISPLAY_COIN_PAGESIZE
    },
    showHideSmallTips() {
      Dialog.alert({
        message: "小于 0.001 BTC 的币种。",
        confirmButtonText: "知道了"
      })
    }
  }
}
</script>

<style scoped lang="less">
.myAssets {
  min-height: 100vh;
  background-color: #F1F2F4;
  .total {
    background: url(../../assets/images/wallet-header.png) no-repeat left bottom #4140BB;
    background-size: 100%;
    color: #FFF;
    .flex-left-right {
      padding: 0 30px;
      align-items: flex-end;
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      padding-top: 20px;
    }
    .secure-label {
      display: flex;
      align-items: center;
      margin-right: -30px;
      background-color: #fff;
      height: 24px;
      padding: 0 6px 0 10px;
      border-radius: 12px 0 0 12px;
      font-size: 12px;
      color: #222;
      &:active {
        opacity: 0.7;
      }
    }
    .pie-chart {
      font-size: 12px;
      color: rgba(255,255,255,.6);
      text-align: center;
      &:active {
        opacity: 0.7;
      }
      img {
        width: 40px;
        margin: 0 auto 10px;
      }
    }
    .amount {
      font-size: 14px;
    }
    .no-login {
      font-size: 18px;
      min-height: 70px;
      line-height: 70px;
      font-weight: 500;
    }
    .btc {
      font-size: 35px;
      height: 38px;
      font-weight: bold;
      margin: 10px 0;
    }
    .rmb {
      color: rgba(255,255,255,.6)
    }
    .visibleSet {
      position: relative;
      margin-left: 5px;
      img {
        vertical-align: middle;
        width: 19px;
        height: 14px;
        display: inline-block;
      }
    }
    .visibleSet::after {
      content: ' ';
      position: absolute;
      width: 100%;
      height: 100%;
      top: -10px;
      left: -10px;
      padding: 10px;
    }
  }
  .mine-button {
    display: flex;
    margin-top: 20px;
    >div {
      width: 50%;
      display: flex;
      padding: 13px 0;
      justify-content: center;
      border-top: 1px solid #6B78E5;
      font-weight: bold;
    }
    >div {
      border-right: 1px solid #6B78E5;
    }
    img{
      width: 20px;
      height: 20px;
      padding-right: 10px;
      margin-top: 1px;
    }
    .yubibaoDot {
      position: relative;
    }
    .yubibaoDot::after {
      content : '';
      height: 8px;
      width: 8px;
      background: #F7931A;
      border-radius: 10px;
      position: absolute;
      top: 1px;
      right: 8px;
    }
  }

  .toolbar {
    height: 24px;
    padding: 15px 20px 0;

    .hide-small {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: rgba(34, 34, 34, 0.6);
      .flex {
        align-items: center;
      }
      .check-box {
        display: block;
        width: 12px;
        height: 12px;
        border: 1px solid #DCDDDF;
        margin-right: 10px;
        border-radius: 1px;
        position: relative;
      }
      .check-box::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 6px;
        height: 6px;
      }
      img {
        margin-left: 4px;
      }
      &.cur .check-box::after {
        background-color: #00C3D2;
      }
    }
    .wallet-search-box {
      background-color: transparent;
      width: 90px;
      border: 1px solid #DCDDDF;
      padding: 0;
    }
  }

  .list {
    padding: 15px 20px 65px;
    .bi-item {
      background: #FFF;
      border-radius: 5px;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 13px;
      box-shadow: 5px 5px 5px #eee;

      .item-left {
        align-items: center;
        display: flex;
      }
      img {
        width: 35px;
        height: 35px;
      }
      .info{
        span {
          display: block;
        }
        :first-child{
          padding: 2px 0;
          font-size: 18px;
        }
        :last-child{
          font-size: 14px;
          padding: 2px 0;
        }
      }
      .title{
        margin-left: 15px;
        font-weight: bold;
        span {
          font-size: 18px!important;
        }
      }
      .amount{
        text-align: right;
        span:first-of-type {
          font-weight: bold;
        }
        span:last-of-type {
          color: #CFCFCF;
          font-size: 12px;
        }
      }
    }
  }
  .yubibao {
    margin: 10px 20px 0px;
    padding: 12px 20px;
    box-shadow: 0 3px 5px 0 rgba(0,0,0,0.05);
    border-radius: 4px;
    background: url('../../assets/images/yubibao/bg-wallet.png') #D6AF74 no-repeat;
    background-size: 35%;
    background-position: bottom right;
    .title {
      font-size: 12px;
      color: #FFFFFF;
    }
    .total-in {
      font-size: 28px;
      color: #FFFFFF;
    }
    .yestarday-in {
      text-align: right;
      color: #FFFFFF;
      .top {
        font-size: 8px;
      }
      .bottom {
        font-size: 16px;
      }
    }
  }
}
.yubibao-popup {
  .title {
    text-align: center;
    padding-bottom: 20px;
    img {
      width: 50px;
      margin: 0 auto;
      display: block;
      padding-bottom: 10px;
    }
    span {
      font-size: 16px;
      color: #000000;
      text-align: center;
      line-height: 22px;
    }
  }
  .body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px 20px;
    .info {
      text-align: center;
    }
    .top {
      opacity: 0.3;
      font-size: 12px;
      color: #000000;
      text-align: center;
    }
    .bottom {
      margin-top: 6px;
      font-size: 16px;
      color: #000000;
      text-align: center;
    }
  }
}
</style>
<style>
.wallet-search-box .van-search__content {
  background-color: transparent;
  padding-left: 6px;
}
.wallet-search-box .van-cell {
  padding: 0;
  font-size: 12px;
}
.wallet-search-box .van-field__left-icon .van-icon {
  font-size: 12px;
  font-weight: bold;
  color: #222;
  opacity: 0.6;
}
.wallet-search-box .van-field__clear {
  padding-left: 5px;
}
</style>
