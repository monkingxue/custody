<template>
  <div class="container">
    <div
      v-if="redTarget"
      class="top"
    >
      <img
        v-if="redTarget === 'roman'"
        src="../../assets/images/landing-red-romance.png"
      >
      <img
        v-if="redTarget === 'birth'"
        src="../../assets/images/landing-red-birth.png"
      >
      <img
        v-if="redTarget === 'facai'"
        src="../../assets/images/landing-red-facai.png"
      >
      <img
        v-if="redTarget === 'zhongqiu'"
        src="../../assets/images/landing-red-zhongqiu.png"
      >
    </div>
    <div class="lgcontent">
      <div class="comm-inputcon mt30">
        <span
          class="bold lgnum"
          @click="showSelect = true"
        >
          +{{ zone }} &nbsp;<span class="font12">▼</span>
        </span>
        <van-field
          v-model="mobile"
          class="mobile-input"
          maxlength="11"
          type="number"
          :placeholder="$t('login.phoneNumberPlaceholder')"
        />
      </div>
      <div
        class="comm-inputcon mt30"
        @click="onInputOutsideClick"
      >
        <van-field
          ref="smsInput"
          v-model="code"
          class="pl40"
          type="number"
          maxlength="6"
          :placeholder="$t('login.validationCodePlaceholder')"
          @input="onSmsChange"
        />
        <count-down
          :red-active="true"
          :disabled="!isSmsButtonEnable"
          @click="sendSmsCode"
        />
      </div>
      <div class="mt40">
        <van-button
          size="large"
          round
          :disabled="!isLoginButtonEnable"
          class="red-btn"
          @click="loginBySmsCode"
        >
          接受心意
        </van-button>
      </div>
      <div class="red-amount">
        来自好友的¥{{ amount }}红包
      </div>
      <div
        v-if="redInfo.status !== 1"
        class="red-nothing"
      >
        红包已领完
      </div>
    </div>
    <van-popup
      v-model="showSelect"
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="zoneCode"
        value-key="valueCN"
        @change="onSelectChange"
        @cancel="showSelect = false"
        @confirm="showSelect = false"
      />
    </van-popup>
  </div>
</template>
<script>
import { DI } from 'core'
import { Message, Indicator, CountDown } from 'components'
import { zoneCode } from '../landingA/zoneCode.js'

export default {

  components: {
    CountDown
  },

  data() {
    return {
      mobile: '',
      code: '',
      zone: '86',
      zoneCode: zoneCode,
      showSelect: false,
      amount: '',
      redTarget: '',
      inviteCode: '',
      identifier: '',
      redInfo: {
        status: 1
      }
    }
  },

  computed: {
    isLoginButtonEnable() {
      return this.isSmsButtonEnable && this.code.length === 6
    },
    isSmsButtonEnable() {
      return this.mobile.length >= 3
    }
  },
  mounted() {
    const { redCode, target, amount, inviteCode } = this.$route.query
    if (redCode) {
      this.redTarget = target
      this.identifier = redCode
      this.inviteCode = inviteCode
      this.amount = amount
      this.getRedPacketById()
    }
  },

  methods: {
    getRedPacketById() {
      DI.get('marketHttp')
        .getRedPacketById(this.identifier)
        .then((res) => {
          this.redInfo = res
        })
        .catch(Message)
    },
    onSelectChange(picker, value) {
      this.zone = value.key
    },
    sendSmsCode() {
      Indicator.open(this.$t('sendingSms'))
      DI.get('authHttp')
        .getSmsCode({
          zone: this.zone,
          phone: this.mobile
        })
        .then()
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    onSmsChange(e) {
      if (this.mobile && e && e.length === 6) {
        this.loginBySmsCode()
        this.$refs.smsInput.blur()
      }
    },
    onInputOutsideClick() {
      this.$refs.smsInput.focus()
    },
    loginBySmsCode() {
      Indicator.open(this.$t('logining'))
      const loginData = {
        zone: this.zone,
        phone: this.mobile,
        code: this.code,
        invite_code: this.inviteCode,
        red_packet_id: this.identifier
      }
      DI.get('authHttp')
        .loginBySmsCode(loginData)
        .then((res) => {
          DI.get('auth').setToken(res.customer_id, res.access_token)
          if (this.redInfo.status === 1) {
            DI.get('offlineStorage').set('FROM_RED_ENVELOPE', this.amount)
          }
          DI.get('auth').syncUser()
          this.$router.push({ name: 'home' })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    }
  }
}
</script>
<style scoped lang="less">
.lgnum{
  border-right:1px solid #eee;
  padding-right:10px;
  position: absolute;
}
.lgcontent .van-cell{
  padding-left:10px!important;
}
.lgcontent .mobile-input {
  margin-left: 60px;
}
.purplecolor{
  color:#3f46b4;
}
.lgcontent{
  padding:0 40px 40px 40px;
}
.drawcontent input{font-size: 16px}
.top {
  position: relative;
  img {
    width: 100%;
  }
}
.red-nothing {
  width: 100%;
  color: #EC4A4A;
  text-align: center;
  margin: 30px 0;
}
.red-amount {
  width: 100%;
  color: #666;
  text-align: center;
  margin: 15px 0;
}
</style>
