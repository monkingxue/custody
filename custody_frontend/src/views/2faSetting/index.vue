<template>
  <div class="setting">
    <div v-if="step === 1">
      <div class="top">
        <img src="../../assets/images/2fa/2fa.png">
      </div>
      <div class="notice">
        <p>请将16位密钥记录起来，并保存在安全的地方。</p>
        <p>如遇手机丢失，您可通过该密钥恢复谷歌验证。</p>
      </div>
      <div class="copy">
        <div>
          {{ secret }}
          <CopyButton
            :text="secret"
            :hide-text="true"
          />
        </div>
      </div>
      <div class="bottom">
        <div
          class="mt20 tip-fa flex-align touch-opacity"
          @click="onShowTips"
        >
          <span>如何使用谷歌验证</span>
          <img
            src="../../assets/images/icon18.png"
            width="14"
            height="14"
          >
        </div>
        <van-button
          size="large"
          round
          class="orange-btn"
          @click="onGoBind"
        >
          下一步
        </van-button>
      </div>
    </div>
    <div v-if="step === 2">
      <div>
        <div
          class="comm-inputcon"
        >
          <van-field
            ref="smsInput"
            v-model="code"
            class="pl40"
            type="number"
            maxlength="6"
            placeholder="请输入短信验证码"
          />
          <count-down
            :disabled="false"
            @click="sendSmsCode"
          />
        </div>
        <div
          class="comm-inputcon mt30"
        >
          <van-field
            ref="smsInput"
            v-model="token"
            class="pl40"
            type="number"
            maxlength="6"
            placeholder="请输入谷歌验证码"
          />
          <span class="font14 bold">
            <span
              v-if="isShowPasteBtn"
              class="orangecolor touch-opacity"
              @click="pasteCode"
            >
              粘贴
            </span>
          </span>
        </div>
        <div class="bottom">
          <div
            v-if="isUnbind"
            class="tip"
          >
            <p>
              为了您的资产安全
            </p>
            <p>
              谷歌验证解除后24小时以内不允许提币
            </p>
          </div>
          <van-button
            size="large"
            round
            class="orange-btn"
            :disabled="isBindBtnDisable"
            @click="onBind"
          >
            {{ `${!isUnbind ? '确认绑定' : '确认解绑'}` }}
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DI } from 'core'
import { CopyButton, CountDown, Message, Indicator } from "components"

export default {
  components: {
    CopyButton,
    CountDown
  },
  data() {
    return {
      step: 0,
      secret: '',
      code: '',
      token: '',
      isUnbind: false,
      init: false
    }
  },
  computed: {
    account() {
      return DI.get('auth').getUser()
    },
    isBindBtnDisable() {
      return this.code.length !== 6 || this.token.length !== 6
    },
    isFromApp() {
      return DI.get("utils").isFromApp()
    },
    isShowPasteBtn() {
      // ios || web:clipboard
      return (this.isFromApp && window.paste) ||
        (navigator.clipboard && navigator.clipboard.readText)
        ? true
        : false
    }
  },
  watch: {
    account: {
      immediate: true,
      handler(val) {
        if (!val || !val.identity || this.init) return
        this.init = true
        if (val.set_google_auth) {
          DI.get("utils").setTitle('解绑谷歌二次验证')
          this.step = 2
          this.isUnbind = true
        } else {
          this.setAuthStart()
        }
      }
    }
  },
  methods: {
    pasteCode() {
      if (this.isFromApp) {
        DI.get('utils')
          .appPaste()
          .then(clipText => (this.token = clipText))
      } else if (navigator.clipboard) {
        navigator.clipboard
          .readText()
          .then(clipText => (this.token = clipText))
      }
    },
    setAuthStart() {
      if (this.step === 1) return
      this.step = 1
      DI.get("utils").setTitle('绑定谷歌验证')
      this.getAuthInfo()
    },
    onGoBind() {
      this.step = 2
      DI.get("utils").setTitle('绑定谷歌二次验证')
    },
    onShowTips() {
      this.$router.push({ name: "2faIntro" })
    },
    getAuthInfo() {
      Indicator.open(this.$t("loading"))
      DI.get('accountHttp')
        .getGoogleAuthInfo()
        .then((res) => {
          this.secret = res.secret
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    sendSmsCode() {
      Indicator.open(this.$t('login.sendingSms'))
      DI.get('accountHttp')
        .sendGoogleAuthSms({
          sms_type: this.isUnbind ? 'unbind' : 'bind'
        })
        .then()
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    onBind() {
      Indicator.open(this.$t("loading"))
      let mathod = 'bindGoogleAuth'
      if (this.isUnbind) mathod = 'unbindGoogleAuth'
      DI.get('accountHttp')[mathod]({
        code: this.code,
        token: this.token
      })
        .then(() => {
          Message(this.isUnbind ? '解绑成功' : '绑定成功')
          this.$router.go(-1)
          DI.get('auth').syncUser()
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
.setting {
  padding: 30px;
  .top {
    img {
      display: block;
      margin: 0 auto;
      width: 180px;
    }
  }
  .notice {
    font-size: 14px;
    color: #222222;
    text-align: center;
    padding: 40px 0 20px;
    p {
      padding: 2px 0;
    }
  }
  .copy {
    background: #F1F2F4;
    border-radius: 24px;
    padding: 15px;
    text-align: center;
    position: relative;
  }
  .bottom {
    position: fixed;
    bottom: 40px;
    left: 30px;
    right: 30px;
    .tip {
      opacity: 0.6;
      font-size: 12px;
      color: #222222;
      padding-bottom: 5px;
      p {
        padding-bottom: 5px;
        text-align: center;
      }
    }
  }
  /deep/.comm-inputcon span.orangecolor {
    color: #00C3D2;
  }
  .tip-fa {
    justify-content: center;
    opacity: 0.6;
    font-size: 12px;
    margin-bottom: 10px;
    color: #2E2E2E;
    img {
      margin-left: 5px;
    }
  }
}
</style>
