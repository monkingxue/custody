<template>
  <div class="account">
    <div
      class="account-top"
    >
      <div
        class="account-info commflex"
        @click="goToMy"
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
              src="../assets/images/avatar-guest.png"
              class="avatar"
            >
          </div>
          <div class="ml20 profile img-btn-dark">
            <div
              v-if="account.identity && !isSetNickName"
              class="mobile"
            >
              {{ formatedMobile }}
            </div>
            <div v-else>
              <span class="mobile">
                <template v-if="isAuthenticated">
                  <span>{{ account.nickname }}</span>
                </template>
                <template v-else-if="userLocalIdentity">
                  <span>
                    {{ userLocalNickname ? userLocalNickname : userLocalIdentity }}
                  </span>
                </template>
                <template v-else>
                  {{ $t('me.title') }}
                </template>
              </span>
              <span class="font12 number">
                {{
                  isAuthenticated ? formatedMobile : (userLocalNickname && userLocalIdentity ? userLocalIdentity : "")
                }}
              </span>
            </div>
          </div>
        </div>
        <span
          class="go-asset arrow img-btn-dark"
        >
          <img
            src="../assets/images/arrow03.png"
          >
        </span>
      </div>
      <div
        class="vip-banner img-btn-dark"
        @click="goToVIP"
      >
        <img
          v-if="account.credit_vip_level > 0"
          :src="vipImageBlank[$i18n.locale] || vipImageBlank['zh-CN']"
        >
        <img
          v-else-if="!account.credit_vip_level"
          :src="vipImage[$i18n.locale] || vipImage['zh-CN']"
        >
        <div
          v-if="account.credit_vip_level > 0"
          class="vip-detail"
        >
          <div class="level">
            VIP {{ account.credit_vip_level }}
          </div>
          <div class="info">
            {{ vipInfo }}
          </div>
        </div>
      </div>
    </div>
    <div class="comm-list comm-lists">
      <div
        v-show="!hideInvite"
        class="comm-listitem rightrow"
        @click="invite"
      >
        <i :class="['iconinvitelist', isAccountRedDot && 'reddot']" />
        <div>{{ $t('me.inviteFriend') }}</div>
      </div>
      <!-- <div
        v-show="!hideInvite"
        class="comm-listitem rightrow comm-listitem-end"
        @click="onEnterRed"
      >
        <i class="iconRed" />
        <div>{{ $t('redEnvelopes') }}</div>
      </div> -->
      <div
        class="comm-listitem rightrow comm-listitem-end"
        @click="goToOrderList"
      >
        <i class="iconOrder" />
        <div>{{ $t('me.myOrders') }}</div>
      </div>
      <div
        class="comm-listitem rightrow comm-listitem-end security-line"
        @click="goToSecurity"
      >
        <div class="flex">
          <i class="iconsecurity" />
          <span>{{ $t('me.securityCenter') }}</span>
        </div>
        <div
          v-if="isAuthenticated"
          class="security-text"
        >
          <img :src="displaySecurityLevel.img">
          {{ $t('me.securityLevel') }}：
          {{ displaySecurityLevel.text }}
        </div>
      </div>
      <div
        v-if="!isFromApp"
        class="comm-listitem rightrow"
        @click="goToDownload"
      >
        <i class="icondownload" />
        <div>{{ $t('me.downloadApp') }}</div>
      </div>
      <div
        class="comm-listitem rightrow "
        @click="goToJoinWx"
      >
        <i class="iconWx" />
        <div>{{ $t('me.joinSNS') }}</div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="goToAbout"
      >
        <i class="iconAbout" />
        <div>{{ $t('me.aboutUs') }}</div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="goToHelpCenter"
      >
        <i class="iconHelp" />
        <div>{{ $t('me.helpCenter') }}</div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="otherset"
      >
        <i class="iconsetting" />
        <div>{{ $t('me.preferences') }}</div>
      </div>
    </div>
    <div class="mine-version">
      {{ version }}
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Dialog } from 'vant'

export const BIBI_USER_SELECT_TIBI = 'BIBI_USER_SELECT_TIBI'
export const BIBI_USER_SELECT_CHONGBI = 'BIBI_USER_SELECT_CHONGBI'
export const USER_ACCOUNT_SHOW = "USER_ACCOUNT_SHOW"
import AvatarCache from './avatarCache'
import RedDot from './myInvite/reddot'

import vipImageZHCN from '../assets/images/vip/vip.png'
import vipImageZHHK from '../assets/images/vip/vip_zhhk.png'
import vipImageBlankZHCN from '../assets/images/vip/vip_blank.png'
import vipImageBlankZHHK from '../assets/images/vip/vip_blank_zhhk.png'
// import vipImageBlankENUS from '../assets/images/vip/vip_blank_enus.png'

export default {
  mixins: [AvatarCache, RedDot],
  data() {
    return {
      intervalId: null,
      visible: DI.get("offlineStorage").get(USER_ACCOUNT_SHOW) !== 'invisible',
      air: DI.get('VIP_AIR'),
      vipImage: {
        'zh-CN': vipImageZHCN,
        'zh-HK': vipImageZHHK
      },
      vipImageBlank: {
        'zh-CN': vipImageBlankZHCN,
        'zh-HK': vipImageBlankZHHK
      }
    }
  },
  computed: {
    vipInfo() {
      let info = `${this.$t('fee')}：${this.serviceFee} % `
      // if (this.coinVipSetting.extra_interest_rate > 1) {
      //   info += ` / 余币宝利息加成 ${((this.coinVipSetting.extra_interest_rate - 1) * 100).toFixed(0)}%`
      // }
      return info
    },
    hideInvite() {
      // apple app store 审核账户 隐藏邀请好友
      if (this.account.identity
        && this.account.identity === '86-11011011011') return true
      return false
    },
    setting() {
      return DI.get("store").state.setting.setting
    },
    storePairBasic() {
      return DI.get("store").state.pair.pairBasic
    },
    pairInfo() {
      return this.storePairBasic['BTC_USDT'] || {}
    },
    serviceFee() {
      const discount = this.setting[`vip_bibi_offer.level_${this.account.credit_vip_level}`]
      if (!discount) return '-'
      return this.pairInfo.trade_fee
        ? +(
          ((this.pairInfo.trade_fee * discount) / 100 +
              this.pairInfo.exchange_trade_fee) *
            100
        ).toFixed(3)
        : ""
    },
    userLocalNickname() {
      const cacheToken = DI.get('auth').getToken().token
      const cacheNickname = DI.get("offlineStorage").get("USER_NICKNAME")
      return cacheToken && cacheNickname ? cacheNickname : ""
    },
    userLocalIdentity() {
      const cacheToken = DI.get('auth').getToken().token
      const cacheUserIdentity = DI.get("offlineStorage").get("USER_IDENTITY")
      return cacheToken && cacheUserIdentity
        ? DI.get('filters').formatMobile(cacheUserIdentity.split('-')[1])
        : ""
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
    },
    displaySecurityLevel() {
      return DI.get('auth').getUserSecurityLevel()
    },
    storeYubibaoSetting() {
      return DI.get("store").state.yubibao.setting
    },
    coinSetting() {
      if (!this.storeYubibaoSetting.length) return {}
      return this.storeYubibaoSetting.find(_ => _.coin_name === 'BTC')
    },
    coinVipSetting() {
      if (!this.account.credit_vip_level || !this.storeYubibaoSetting.length) return {}
      return this.storeYubibaoSetting.find(_ => _.coin_name === 'BTC').vip_settings.find(_ => _.vip_level === this.account.credit_vip_level)
    },
    isFromApp() {
      return DI.get('utils').isFromApp()
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
    DI.get('store').dispatch('SYNC_YUBIBAO_SETTING')
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
      this.setAccountTipsLocal()
      this.$router.push({ name: 'myInvite' })
    },
    onEnterRed() {
      this.$router.push({
        name: 'redEnvelope'
      })
    },
    goToDownload() {
      this.$router.push({ name: 'download' })
    },
    otherset() {
      this.$router.push({ name: 'otherset' })
    },
    goToAbout() {
      // window.location = "https://abtc.zendesk.com/hc/zh-cn/articles/360023125573"
      this.$router.push({ name: 'aboutUs' })
    },
    goToJoinWx() {
      this.$router.push({ name: 'weixin' })
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
          message: this.$t('account.kycIsRequiredMessage')
        }).then(() => {
          this.$router.push({ name: 'realname' })
        }).catch(() => {})
        return
      }
      if (!this.isSetPassword) {
        Dialog.confirm({
          message: this.$t('account.assetPasswordIsRequiredMessage')
        }).then(() => {
          this.$router.push({ name: 'password' })
        }).catch(() => {})
        return
      }
      return true
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
  padding: 0 20px 10px;
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
.mine-top-left img {
  width: 20px;
  height: 16px;
}
.iconOrder {
  background:url("../assets/images/icon01.png") no-repeat center;
  background-size:100%;
}
.iconinvite {
  background:url("../assets/images/icon03.png") no-repeat center;
  background-size:100%;
}
.iconinvitelist {
  background:url("../assets/images/icon30.png") no-repeat center;
  background-size:100%;
}
.iconinvitelist::after {
  top: 22px;
}
.iconRed {
  background:url("../assets/images/icon-red.png") no-repeat center;
  background-size: 98%;
}
.iconsetting {
  background:url("../assets/images/icon04.png") no-repeat center;
  background-size:100%;
}
.iconAbout{
background:url("../assets/images/icon19.png") no-repeat center;
  background-size:100%;
}
.icondownload {
  background:url("../assets/images/icon15.png")no-repeat  center;
  background-size:100%;
}
.iconWx{
background:url("../assets/images/icon21.png") no-repeat center;
  background-size:100%;
}
.iconHelp{
background:url("../assets/images/icon29.png") no-repeat center;
  background-size:100%;
}
.iconsecurity{
  background:url("../assets/images/icon28.png") no-repeat center;
  background-size:100%;
}
.iconYbb{
  background:url("../assets/images/yubibao/icon-tab.png") no-repeat center;
  background-size:100%;
}
.iconYbb-active{
  background:url("../assets/images/yubibao/icon-tab-o.png") no-repeat center;
  background-size:100%;
}
.vip-banner {
  height: 0;
  padding-bottom: 26%;
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
  border: 1.5px solid #FFF;
}
.circularActive{
  filter: brightness(0.8);
}

.security-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px!important;
  .security-text {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: rgba(34, 34, 34, 0.6);
    img {
      width: 22px;
      height: 22px;
      margin-right: 5px;
    }
  }
}
</style>
