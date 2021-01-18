<template>
  <div class="container">
    <div class="lgcontent">
      <div class="lg-title">
        <img
          class="logo"
          src="static/icon-72x72.png"
        >
        <div>
          <img
            class="logo-text"
            src="../assets/images/logo-text.svg"
          >
          <span>{{ $t('login.slogan') }}</span>
        </div>
      </div>
      <div class="login-inputcon mt30">
        <span
          class="bold lgnum label"
          @click="showSelect = true"
        >
          +{{ zone }}
        </span>
        <span
          v-if="!mobile.length"
          class="placeholder"
          @click="onInputPlaceholderClick"
        >
          {{ $t('login.phoneNumberPlaceholder') }}
        </span>
        <van-field
          ref="mobileInput"
          v-model="mobile"
          class="num-input din"
          maxlength="11"
          type="number"
        />
        <span
          class="icon-close"
          @click="mobile=''"
        >
          x
        </span>
      </div>
      <div
        class="login-inputcon mt30"
        @click="onInputOutsideClick"
      >
        <span class="bold label">{{ $t('login.validationCode') }}</span>
        <span
          v-if="!code.length"
          class="placeholder"
        >
          {{ $t('login.validationCodePlaceholder') }}
        </span>
        <van-field
          ref="smsInput"
          v-model="code"
          class="num-input din"
          type="number"
          maxlength="6"
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
          class="orange-btn btn-login"
          @click="loginBySmsCode"
        >
          {{ $t("login.loginButton") }}
        </van-button>
      </div>
      <div
        class="tc mt15 font12"
        @click="goToAgreement"
      >
        <span class="graycolor">{{ $t("tips12") }}</span>
        <span class="graycolor">《aBTC{{ $t("tips13") }}》</span>
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
        @confirm="onSelectConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import { DI } from "core"
import { Message, Indicator, CountDown } from "components"
import { zoneCode } from "./landingA/zoneCode.js"

export const USER_SELECT_SMS_ZONE = "USER_SELECT_SMS_ZONE"

export default {
  components: {
    CountDown
  },

  data() {
    return {
      mobile: "",
      code: "",
      zone: DI.get("offlineStorage").get(USER_SELECT_SMS_ZONE, "86"),
      zoneCode: zoneCode,
      showSelect: false
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
    Indicator.close()
    this.$nextTick(() => {
      DI.get("utils").setTitle()
    })
  },

  methods: {
    onSelectConfirm(value) {
      this.showSelect = false
      if (value && value.key) {
        this.updateZone(value.key)
      }
    },
    onSelectChange(picker, value) {
      this.updateZone(value.key)
    },
    updateZone(value) {
      this.zone = value
      DI.get("offlineStorage").set(USER_SELECT_SMS_ZONE, value)
    },
    sendSmsCode() {
      Indicator.open(this.$t("sendingSms"))
      DI.get("authHttp")
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
    onInputPlaceholderClick() {
      this.$refs.mobileInput.focus()
    },
    onInputOutsideClick() {
      this.$refs.smsInput.focus()
    },
    initInviteTips() {
      DI.get('store').dispatch('SYNC_INVITE')
      DI.get('store').dispatch('SYNC_REBATE')
    },
    loginBySmsCode() {
      Indicator.open(this.$t("logining"))
      const loginData = {
        zone: this.zone,
        phone: this.mobile,
        code: this.code
      }
      DI.get("authHttp")
        .loginBySmsCode(loginData)
        .then(res => {
          DI.get("auth").setToken(res.customer_id, res.access_token)
          DI.get("auth").syncUser()
          this.initInviteTips()
          this.$router.push({ name: "home" })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    goToAgreement() {
      this.$router.push({ name: "agreement" })
    }
  }
}
</script>
<style scoped>
.lg-title {
  display: flex;
  align-items: center;
  align-content: center;
}
.lg-title span {
  display: block;
  font-size: 8px;
  color: rgba(34, 34, 34, 0.3);
  margin-top: 4px;
}
.lg-title .logo {
  width: 38px;
  border-radius: 10px;
  margin-right: 10px;
}
.login-inputcon {
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #dddddd;
  padding: 0 10px;
  font-size: 14px;
  position: relative;
}
.login-inputcon .num-input {
  font-size: 20px;
  font-weight: bold;
}
.login-inputcon .placeholder {
  position: absolute;
  left: 73px;
  top: 0;
  min-width: 85px;
  z-index: 1;
  font-size: 14px;
  color: #999;
}
.login-inputcon .icon-close {
  display: block;
  background-color: #ddd;
  font-size: 10px;
  color: #fff;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 12px;
  border-radius: 7px;
  font-weight: bold;
}
.login-inputcon .label {
  width: 50px;
}
.login-inputcon .lgnum::after {
  content: "";
  display: inline-block;
  transform: rotate(45deg);
  padding: 2px;
  border-style: solid;
  border-color: #222;
  border-image: initial;
  cursor: pointer;
  margin-bottom: 2px;
  border-width: 0px 2px 2px 0px;
}
.lgcontent {
  padding: 70px 40px 40px 40px;
}
.drawcontent input {
  font-size: 16px;
}
.btn-login {
  background: #00C3D2;
}
.btn-login:disabled {
  opacity: 1;
  background: #DDDDDD !important;
  box-shadow: none;
}
</style>
<style>
.login-inputcon .van-cell {
  flex: 1;
  padding: 0 0 0 10px !important;
}
.login-inputcon span.graycolor{
  color: rgba(34, 34, 34, 0.3);
}
.login-inputcon span.orangecolor{
  color: #00C3D2;
}
</style>
