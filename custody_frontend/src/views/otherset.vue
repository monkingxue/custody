<template>
  <div class="otherset container-white">
    <div class="comm-list">
      <div
        class="comm-listitem rightrow"
        @click="toidentity"
      >
        <i class="iconidentity" />
        <div class="flex-left-right flex-1 comm-list-main">
          <span>{{ $t('me.KYC') }}</span>
          <span class="comm-list-right">
            {{
              isSetCardNumber
                ? $t('authorized')
                : $t('unauthorized')
            }}
          </span>
        </div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="goToSellMethod"
      >
        <i class="iconSell" />
        <div>{{ $t('me.receiveMethods') }}</div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="goToLanguage"
      >
        <i class="iconLanguage" />
        <div class="flex-left-right flex-1 comm-list-main">
          <span>{{ $t('me.language') }}</span>
          <span class="comm-list-right">{{ language }}</span>
        </div>
      </div>
      <div
        class="comm-listitem rightrow noborder"
        @click="quit"
      >
        <i class="quitlogin" />
        <div>{{ $t('logout') }}</div>
      </div>
    </div>
    <van-dialog
      v-model="certifyAlertFlag"
      class="certify-dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="certify-confirm-dialog">
        <img
          src="../assets/images/icon-idcard-success.png"
          width="58"
        >
        <div class="confirm-title">
          {{ $t('authorized') }}
        </div>
        <div class="confirm-content">
          <div class="commflex">
            <span>{{ $t('account.countryOrLocation') }}:</span><span>{{ account.card_country }}</span>
          </div>
          <div class="commflex">
            <span>{{ $t('account.idType') }}:</span><span>{{ cardType }}</span>
          </div>
          <div class="commflex">
            <span>{{ $t('account.name') }}:</span><span>{{ account.name }}</span>
          </div>
          <div class="commflex">
            <span>{{ $t('account.idNumber') }}:</span><span>{{ account.card_number }}</span>
          </div>
        </div>
        <div class="font12 graycolor">
          若认证信息有误，请联系微信：{{ customWechat }}
        </div>
        <button
          class="mt20"
          @click="() => (certifyAlertFlag = false)"
        >
          {{ $t('close') }}
        </button>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { DI } from 'core'
import { Dialog } from 'vant'

export default {
  data() {
    return {
      certifyAlertFlag: false,
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  computed: {
    isSetCardNumber() {
      return this.account.set_card_number
    },
    cardType(){
      return this.account.card_type === 'idcard' ? "身份证" : this.account.card_type
    },
    account() {
      return DI.get('auth').getUser()
    },
    language() {
      return {
        // "en-US": "English",
        "zh-CN": "简体中文",
        "zh-HK": "繁体中文"
      }[this.$i18n.locale] || "简体中文"
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('me.preferences'))
  },
  methods: {
    toidentity(){
      if (this.isSetCardNumber) {
        // Dialog.alert({
        //   title: '身份验证成功',
        //  message: `${this.account.name} ${this.account.card_number} \r\n如身份信息登记有误，请联系客服微信：${this.customWechat}`
        // })
        // return
        this.certifyAlertFlag = true
        return
      }
      this.$router.push({ name: 'realname' })
    },
    goToSellMethod() {
      this.$router.push({ name: 'sellMethod' })
    },
    goToLanguage() {
      this.$router.push({ name: 'languages' })
    },
    quit(){
      Dialog.confirm({
        message: this.$t('me.confirmLogout')
      }).then(() => {
        this.$router.push({ name: 'login' })
        DI.get('auth').logout()
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
.otherset {
  min-height: 95vh;
}
.quitlogin {
  background:url("../assets/images/icon06.png")no-repeat  center;
  background-size:100%;
}
.faceid {
  background:url("../assets/images/icon23.png")no-repeat  center;
  background-size:100%;
}
.touchid {
  background:url("../assets/images/icon22.png")no-repeat  center;
  background-size:100%;
}
.iconLanguage {
  background:url("../assets/images/icon_language.png")no-repeat  center;
  background-size:100%;
}
.iconSell{
  background:url("../assets/images/icon25.png")no-repeat  center;
  background-size:100%;
}
.iconidentity {
	background:url("../assets/images/icon02.png")no-repeat  center;
	background-size:100%;
  }
.comm-list-main {
  padding-right: 20px;
}
.comm-list-right {
  font-size: 12px;
  color: #999;
}
</style>

<style lang="less">
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
    background-color: #00C3D2;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 5px;
  }
  .cancel-btn{
      background-color: #fff;
      color: #00C3D2;
      border: 2px solid #DDDDDD;
      border-radius: 5px;
  }
}
.van-dialog {
    overflow: visible!important;
}
</style>
