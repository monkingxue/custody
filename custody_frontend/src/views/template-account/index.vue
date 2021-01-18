<template>
  <div class="account">
    <div
      class="account-top"
    >
      <div
        class="account-info commflex"
      >
        <div class="item-left">
          <div
            v-if="isAuthenticated"
            class="circular img-btn-dark"
          >
            <img
              v-if="isSetAvatar"
              :src="account.small_avatar"
              class="avatar"
            >
            <img
              v-else
              src="../../assets/images/avatar-guest.png"
              class="avatar"
            >
          </div>
          <div class="ml20 profile img-btn-dark">
            <div
              v-if="!isSetNickName"
              class="mobile"
            >
              {{ formatedMobile }}
            </div>
            <div v-else>
              <span class="mobile">
                <template v-if="isAuthenticated">
                  <span>{{ account.nickname }}</span>
                </template>
                <template v-else>
                  请登录
                </template>
              </span>
              <span class="font12 number">{{ isAuthenticated?formatedMobile:'' }}</span>
            </div>
            <!-- <span class="mobile">
              {{ isAuthenticated ? (isSetNickName?formatedMobile:formatedMobile) : '请登录' }}
            </span>
            <span class="font12 number">{{ isAuthenticated?formatedMobile:'' }}</span> -->
          </div>
        </div>
      </div>
    </div>
    <div class="comm-list comm-lists">
      <div
        class="comm-listitem rightrow"
        @click="goToOrderList"
      >
        <i class="iconOrder" />
        <div>我的订单</div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="toidentity"
      >
        <i class="iconidentity" />
        <div class="flex-left-right flex-1 comm-list-main">
          <span>{{ $t("me.KYC") }}</span>
          <span
            v-if="isSetCardNumber"
            class="comm-list-right"
          >
            已认证
          </span>
          <span
            v-else
            class="comm-list-right red-dot"
          >
            未认证
          </span>
        </div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="goToAbout"
      >
        <i class="iconAbout" />
        <div>关于我们</div>
      </div>
      <div
        class="comm-listitem rightrow "
        @click="goToKefu"
      >
        <i class="iconContactus" />
        <div>联系客服</div>
      </div>
    </div>
    <div class="mine-version">
      {{ version }}
    </div>
    <van-dialog
      v-model="certifyAlertFlag"
      class="certify-dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="certify-confirm-dialog">
        <img
          src="../../assets/images/icon-idcard-success.png"
          width="58"
        >
        <div class="confirm-title">
          已认证
        </div>
        <div class="confirm-content">
          <div class="commflex">
            <span>国家或地区:</span><span>{{ account.card_country }}</span>
          </div>
          <div class="commflex">
            <span>证件类型:</span><span>{{ cardType }}</span>
          </div>
          <div class="commflex">
            <span>姓名:</span><span>{{ account.name }}</span>
          </div>
          <div class="commflex">
            <span>证件号码:</span><span>{{ account.card_number }}</span>
          </div>
        </div>
        <div class="font12 graycolor">
          若认证信息有误，请联系微信：{{ customWechat }}
        </div>
        <button
          class="mt20"
          @click="() => (certifyAlertFlag = false)"
        >
          关闭
        </button>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { DI } from 'core'
import { Dialog } from 'vant'

export const USER_HAS_WALLET = 'USER_HAS_WALLET'
export const BIBI_USER_SELECT_TIBI = 'BIBI_USER_SELECT_TIBI'
export const BIBI_USER_SELECT_CHONGBI = 'BIBI_USER_SELECT_CHONGBI'
export const USER_ACCOUNT_SHOW = "USER_ACCOUNT_SHOW"

export default {
  data() {
    return {
      intervalId: null,
      visible: DI.get("offlineStorage").get(USER_ACCOUNT_SHOW) !== 'invisible',
      air: DI.get('VIP_AIR'),
      certifyAlertFlag: false,
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  computed: {
    cardType() {
      return this.account.card_type === "idcard"
        ? "身份证"
        : this.account.card_type
    },
    setting() {
      return DI.get("store").state.setting.setting
    },
    hasWallet() {
      return DI.get('offlineStorage').get(USER_HAS_WALLET) || this.account.init_wallet
    },
    isSetPassword() {
      return this.account.set_fund_password
    },
    isSetCardNumber() {
      return this.account.set_card_number
    },
    formatedMobile() {
      return DI.get('filters')
        .formatMobile(this.account.identity.split('-')[1])
    },
    account() {
      return DI.get('auth').getUser()
    },
    isSetAvatar() {
      return this.account.small_avatar !== ""
    },
    isSetNickName() {
      return this.account.nickname !== ""
    },
    isAuthenticated() {
      return DI.get('auth').isAuthenticated()
    },
    version() {
      return window.version
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalId)
    next()
  },
  mounted() {
    this.$nextTick(() => {
      DI.get('utils').setBody('bacgray')
    })
  },
  methods: {
    visibleSet() {
      this.visible = !this.visible
      DI.get("offlineStorage").set(USER_ACCOUNT_SHOW, this.visible ? 'visible' : 'invisible')
    },
    goToLogin() {
      // if (this.isAuthenticated) return
      this.$router.push({ name: 'login' })
    },
    goToMy() {
      // if (this.isAuthenticated) return
      this.$router.push({ name: 'my' })
    },
    goToOrderList() {
      this.$router.push({ name: 'orderList' })
    },
    invite() {
      this.$router.push({ name: 'myInvite' })
    },
    otherset() {
      this.$router.push({ name: 'otherset' })
    },
    goAsset() {
      this.$router.push({ name: 'myAssets' })
    },
    goToAbout() {
      // window.location = "https://abtc.zendesk.com/hc/zh-cn/articles/360023125573"
      this.$router.push({ name: 'aboutUs' })
    },
    goToKefu() {
      this.$router.push({ name: 'contactkf' })
    },
    goToVIP() {
      this.$router.push({ name: 'vip' })
    },
    goToSecurity() {
      this.$router.push({ name: 'security' })
    },
    goToHelpCenter() {
      this.$router.push({ name: 'helpCenter' })
    },
    confirm(skipAuthenticated) {
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
    toidentity() {
      if (this.isSetCardNumber) {
        this.certifyAlertFlag = true
        return
      }
      this.$router.push({ name: "realname" })
    },
    goDeposit() {
      if(!this.confirm(true))return
      var depositItem = DI.get('offlineStorage').get(BIBI_USER_SELECT_CHONGBI, 'BTC')
      this.$router.push({ name: 'deposit',
        query: {
          target: depositItem
        }
      })
    },
    goWithdraw() {
      if(!this.confirm())return
      var withdrawItem = DI.get('offlineStorage').get(BIBI_USER_SELECT_TIBI, 'BTC')
      this.$router.push({ name: 'withdraw',
        query: {
          target: withdrawItem
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.account-top {
  background: #4140bb;
  padding-top: 18px;
  color: #FFF;
}
.account {
  background: none;
}
.account-info {
  padding: 0 20px 18px;
  align-items: center;
}
.account-info .item-left{
  display: flex;
  align-items: center;
}
.account-info .mobile{
  font-weight: bold;
  font-size: 16px;
  >span, img {
    display: inline;
  }
  .vip-label {
    padding-left: 5px;
    padding-top: 5px;
    height: 16px;
    vertical-align: text-bottom;
  }
}
.profile{
  .number{
    color:#8B8ED2;
  }
  span{
    display: block;
    padding-top: 5px;
  }
}
.mine {
  padding: 18px;
  background: linear-gradient( #4140bb 50%, #f1f2f4 50%);
}
.minecontainer{
  background-image:
    linear-gradient(
      to right,#656B8B,  #1F2447
    );
  border-radius: 10px;
}
.total-asset-num {
  z-index: 1;
  font-weight: bold;
  display: flex!important;
}
.total-asset-hide {
  height: 38px;
}
.mine-top {
  display:flex;
  padding:30px 20px 30px;
  top:24%;
  left:0;
  right:0;
  justify-content:space-between;
  position: relative;
  .round {
    position: absolute;
    top: 0;
    right:0;
    height: 90%;
    z-index: 0;
  }
  .total-asset {
    height:38px;
    span:last-child {
      font-size: 10px;
      margin-left: 10px;
    }
  }
  .rises  {
  color: #03E23A
  }
  .falls {
    color :red
  }
}
.visibleSet {
  position: relative;
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
.mine-version {
  display: block;
  text-align: center;
  opacity: 0.15;
  text-justify: auto;
  margin-top: 25px;
  width: 100%;
  word-break: break-all;
  font-size: 80%;
  padding-bottom: 100px;
}
.comm-lists {
  background-color: transparent;
}
.comm-lists .comm-listitem {
  background-color: #FFF;
}
.comm-listitem-end {
  margin-bottom: 10px;
}
.comm-listitem-end:after {
  content: none
}
.mine-top-left {
  z-index: 1
}
.mine-top-left .font20 {
  font-size:38px;
  line-height: 38px;
  font-weight: bold;
}
.comm-list-main {
  padding-right: 20px;
}
.comm-list-right {
  font-size: 12px;
  color: rgba(34, 34, 34, 0.3);
}
.red-dot {
  display: flex;
  align-items: center;
  &::before {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background-color: #ff654c;
    border-radius: 3px;
    margin-right: 5px;
  }
}
.mine-top-left img {
  width: 20px;
  height: 16px;
}
.iconOrder {
  background:url("../../assets/images/icon01.png")no-repeat  center;
  background-size:100%;
}
.iconinvite {
  background:url("../../assets/images/icon03.png")no-repeat  center;
  background-size:100%;
}
.iconinvitelist {
  background:url("../../assets/images/icon30.png")no-repeat  center;
  background-size:100%;
}
.iconsetting {
  background:url("../../assets/images/icon04.png")no-repeat  center;
  background-size:100%;
}
.iconidentity {
  background: url("../../assets/images/icon02.png") no-repeat center;
  background-size: 100%;
}
.iconAbout{
background:url("../../assets/images/icon19.png")no-repeat  center;
  background-size:100%;
}
.iconWx{
background:url("../../assets/images/icon21.png")no-repeat  center;
  background-size:100%;
}
.iconHelp{
background:url("../../assets/images/icon29.png")no-repeat  center;
  background-size:100%;
}
.iconsecurity{
  background:url("../../assets/images/icon28.png")no-repeat  center;
  background-size:100%;
}
.iconYbb{
  background:url("../../assets/images/icon31.png")no-repeat  center;
  background-size:100%;
}
.iconContactus {
  background:url("../../assets/images/icon05.png")no-repeat  center;
  background-size:100%;
}
.vip-banner {
  min-height: 80px;
  position: relative;
  .vip-detail {
    .level {
      position: absolute;
      top: 41.5%;
      left: 42%;
      color: #FFF;
      font-size: 16px;
    }
    .info {
      position: absolute;
      bottom: 20%;
      left: 12%;
      color: #FFF;
      font-size: 10px;
    }
  }
  img {
    width: 95%;
    margin: 0 auto;
  }
}
.small-btn {
  font-weight:normal;
  height:36px!important;
  line-height:36px!important;
  padding:0 20px;
  font-size:15px;
}
.go-asset {
  padding-top:2px;
  color: #FFF;
  z-index: 1;
  img {
    width: 10px;
    height: 17px;
    padding: 4px 0 0 5px;
  }
}
.btc-cny-title {
  font-size: 10px!important;
  color: rgba(255,255,255,0.6);
  margin-top: 10px;
}
.invite {
  background: #FFF;
  padding: 10px 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  img {
    width: 45px;
    height: 45px;
    padding-left: 20px;
  }
  .left-invite {
    align-items: center;
    span {
      margin-left: 15px;
      font-size: 16px;
    }
  }
  .btn {
    font-size: 14px;
    padding: 6px 10px;
    background: #00C3D2;
    color: #FFF;
    border-radius: 30px;
    margin-right: 20px;
  }
}
.invite:active {
  background-color: #E5E5E5!important;
}
.mine .invite{
  border-radius: 5px;
  margin-bottom: 0;
  img{
    padding-left: 10px;
  }
  span {
    margin-left: 10px;
  }
  .btn{
    margin-right: 10px;
  }
}
.btns{
  width: 50%;
  background:#5C6383;
  color:#fff;
  border: none;
  border-top: 0.5px solid #fff;
}
.mine-button{
  display: flex;
  .van-button__text{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img{
    border: 0!important;
    border-radius: 0!important;
    width: 20px;
    height: 20px;
    padding-right: 5px;
  }
}
.mine-button :first-child{
  border-radius: 0 0 0 10px;
  border-right: 0.5px solid #fff;
}
.mine-button :last-child{
  border-radius: 0 0 10px 0;
}
.mine-button span{
  border: none!important;
}
.circular{
  width: 45px;
  height: 45px;
}
.certify-confirm-dialog {
  padding: 30px;
  img {
    margin: 0 auto;
  }
  .confirm-title {
    text-align: center;
    font-size: 16px;
    color: #000;
    margin-top: 10px;
    font-weight: bold;
  }
  .confirm-content {
    padding: 20px 0;
    font-size: 14px;
    color: #000;
    line-height: 25px;
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
  .cancel-btn {
    background-color: #fff;
    color: #00c3d2;
    border: 2px solid #dddddd;
    border-radius: 5px;
  }
}
</style>
