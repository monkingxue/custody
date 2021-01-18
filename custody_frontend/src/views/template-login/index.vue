<template>
  <div
    v-show="visible"
    class="container"
  >
    <div class="top">
      <img src="../../assets/images/cobo/landing.png">
      <div class="title">
        <div class="solgan">
          立即体验加密货币一键投资
        </div>
      </div>
    </div>
    <div class="lgcontent">
      <div class="comm-inputcon mt30">
        <span
          class="bold lgnum"
        >
          +{{ zone }} &nbsp;<span class="font12">▼</span>
        </span>
        <van-field
          v-model="mobile"
          class="mobile-input"
          maxlength="11"
          type="number"
          disabled
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
          :disabled="!isSmsButtonEnable"
          @click="sendSmsCode"
        />
      </div>
      <div class="mt40">
        <van-button
          size="large"
          round
          :disabled="!isLoginButtonEnable"
          class="orange-btn"
          @click="loginBySmsCode"
        >
          进入OTC交易
        </van-button>
      </div>
      <div
        class="tc mt15 font12"
        @click="goToAgreement"
      >
        <span class="graycolor">进入OTC即表示同意</span>
        <span class="orangecolor">《 aBTC.one 用户协议 》</span>
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
      visible: false
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
    const { phone, source, key } = this.$route.query
    if (!key || !phone || !source) {
      return
    }
    this.mobile = phone.split('-')[1]
    this.src = source
    this.cobo_key = key
    if (DI.get('auth').getToken().token) {
      // 如果已经登录 就发一个更新请求
      DI.get('accountHttp').updateOtcPartnerInfo({
        src: source,
        key
      })
        .then()
        .catch(Message)
      this.$router.push({ name: 'home' })
    }
    this.visible = true
  },

  methods: {
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
        src: this.src,
        cobo_key: this.cobo_key
      }
      DI.get('authHttp')
        .loginBySmsCode(loginData)
        .then((res) => {
          DI.get('auth').setToken(res.customer_id, res.access_token)
          DI.get('auth').syncUser()
          this.$router.push({ name: 'home' })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    goToAgreement () {
      this.$router.push({ name: 'agreement' })
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
  .title {
    position: absolute;
    bottom: 0;
    text-align: center;
    left: 0;
    right: 0;
  }
  .solgan {
    font-weight: bold;
    font-size: 20px;
  }
  .invite {
    color: #FFD255
  }
  .sub {
    margin-top: 10px;
  }
}
</style>
