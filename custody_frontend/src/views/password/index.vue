<template>
  <div class="password container-white">
    <div class="title">
      <template v-if="isUpdate">
        <template v-if="step === 1">
          为了您的账户安全<br>请先输入原资金密码确认身份
        </template>
        <template v-else-if="step === 2">
          请输入新的资金密码
        </template>
        <template v-else-if="step === 3">
          请再输入一次
        </template>
        <template v-else>
          请最后输入一次
        </template>
      </template>
      <template v-else>
        <template v-if="step === 1">
          请输入资金密码
        </template>
        <template v-else-if="step === 2">
          请再输入一次
        </template>
        <template v-else>
          请最后输入一次
        </template>
      </template>
    </div>
    <PasswordInput
      ref="passInput"
      class="pass-input"
      @onChange="onInputChange"
    />
    <div class="mt40">
      <van-button
        :disabled="!isEnable"
        size="large"
        round
        class="orange-btn"
        @click="onButtonClick"
      >
        下一步
      </van-button>
    </div>
    <div
      v-if="isUpdate && step === 1"
      class="forget"
      @click="goToKf"
    >
      <img src="../../assets/images/icon18.png">
      <span>忘记密码</span>
    </div>
    <template v-else>
      <div class="drawtip graycolor mt15">
        <p>重要提示：</p>
        <template v-if="!isUpdate && step === 1">
          <p>*为了保证您的资金安全，请设置6位资金密码。</p>
          <p>*资金密码是提币时所必须的6位密码，请勿向他人泄漏。</p>
        </template>
        <template v-else>
          <p>*  请牢记您的资金密码，如若丢失将无法自行找回。</p>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { DI } from 'core'
import { Indicator, Message, PasswordInput } from 'components'
import { Dialog } from 'vant'

export default {
  components: {
    PasswordInput
  },
  data() {
    return {
      code: '',
      action: this.$route.params.action || 'set',
      step: 1,
      oldPass: '',
      newPass: '',
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  computed: {
    isEnable() {
      return this.code.length === 6
    },
    isUpdate() {
      return this.action !== 'set'
    },
    title() {
      return this.action !== 'set' ? '修改资金密码' : '资金密码'
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.title)
  },
  methods: {
    onInputChange(val) {
      this.code = val
    },
    resetInput() {
      this.$refs.passInput.clear()
    },
    resetAll() {
      this.resetInput()
      this.step = 1
    },
    checkAndUpdatePass() {
      if (this.newPass === this.code) {
        this.onUpdatePass(this.newPass, this.oldPass)
      } else {
        Message('密码输入不一致，请重试')
        this.resetAll()
      }
    },
    checkPass(step) {
      if (this.newPass === this.code) {
        this.step = step
        this.resetInput()
      } else {
        Message('密码输入不一致，请重试')
        this.resetAll()
      }
    },
    onUpdatePass(newPass, oldPass) {
      Indicator.open(this.$t('loading'))
      DI.get('accountHttp')
        .updateFundPassword({
          action: this.action,
          fund_password: newPass,
          old_fund_password: oldPass
        })
        .then(() => {
          Message(this.isUpdate
            ? '密码修改成功' : '资金密码已设置')
          this.$router.go(-1)
          DI.get('auth').syncUser()
        })
        .catch((err) => {
          Message(err)
          this.resetAll()
        })
        .then(() => {
          Indicator.close()
        })
    },
    goToKf() {
      Dialog.alert({
        message: `请准备好您的手机、身份证件\r\n添加客服微信：${this.customWechat}`
      })
    },
    onButtonClick() {
      if (this.isUpdate) {
        if (this.step === 1) {
          this.oldPass = this.code
          this.resetInput()
          this.step = 2
          return
        }
        if (this.step === 2) {
          this.newPass = this.code
          this.resetInput()
          this.step = 3
          return
        }
        if (this.step === 3) {
          this.checkPass(4)
          return
        }
        if (this.step === 4) {
          this.checkAndUpdatePass()
        }
      } else {
        if (this.step === 1) {
          this.newPass = this.code
          this.resetInput()
          this.step = 2
          return
        }
        if (this.step === 2) {
          this.checkPass(3)
          return
        }
        if (this.step === 3) {
          this.checkAndUpdatePass()
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.password {
  padding: 0 20px 20px;
  .title {
    text-align: center;
    color: #666;
    padding: 40px 0 0;
    font-size: 18px;
  }
  .pass-input {
margin-top: 40px;
  }
  .forget {
    display: flex;
    align-items: center;
    margin-top: 20px;
    width: 100%;
    font-size: 14px;
    flex-direction: row-reverse;
    color: #666;
    img {
      width: 12px;
      height: 12px;
      margin-left: 3px;
    }
  }
}
</style>
