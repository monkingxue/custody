<template>
  <div class="otherset">
    <div class="comm-list">
      <div
        class="comm-listitem rightrow comm-listitem-end"
        @click="goToSafeDescription"
      >
        <i class="iconWallet" />
        <div>{{ $t('me.walletSecurityDescription') }}</div>
      </div>

      <div class="comm-listitem comm-listitem-end">
        <i class="iconSecurity" />
        <div class="flex-left-right flex-1">
          <span>{{ $t('me.securityLevel') }}</span>
          <div class="level-box">
            <span>{{ $t('me.securityLevel') }}：{{ displaySecurityLevel.text }} </span>
            <div class="level-progress">
              <span :class="`level${displaySecurityLevel.level}`" />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showTouchid"
        class="comm-listitem rightrow"
        @click="onTouchId"
      >
        <i class="touchid" />
        <div class="flex-left-right flex-1 comm-list-main">
          <span>{{ $t('me.touchId') }}</span>
          <span
            v-if="isTouchFaceid !== '' && isTouchFaceid"
            class="comm-list-right"
          >
            已设置
          </span>
          <span
            v-if="isTouchFaceid !== '' && !isTouchFaceid"
            class="comm-list-right red-dot"
          >
            未设置
          </span>
        </div>
      </div>
      <div
        v-if="showFaceid"
        class="comm-listitem rightrow"
        @click="onFaceId"
      >
        <i class="faceid" />
        <div class="flex-left-right flex-1 comm-list-main">
          <span>{{ $t('me.faceId') }}</span>
          <span
            v-if="isTouchFaceid"
            class="comm-list-right"
          >
            已设置
          </span>
          <span
            v-else
            class="comm-list-right red-dot"
          >
            未设置
          </span>
        </div>
      </div>
      <div
        class="comm-listitem rightrow"
        @click="goToPassword"
      >
        <i class="iconPassword" />
        <div class="flex-left-right flex-1 comm-list-main">
          <span>{{ $t('me.assetPassword') }}</span>
          <span
            v-if="isSetPassword"
            class="comm-list-right"
          >
            已设置
          </span>
          <span
            v-else
            class="comm-list-right red-dot"
          >
            未设置
          </span>
        </div>
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
        @click="to2fa"
      >
        <i class="icon2fa" />
        <div class="flex-left-right flex-1 comm-list-main">
          <span>谷歌验证</span>
          <span
            v-if="isSetGoogleAuth"
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
    </div>
    <div class="tip-box">
      <p>请至少选择「手机 + 资金密码」的安全策略组合，</p>
      <p>开启三种安全设置可达最高安全等级。</p>
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
import { DI } from "core"

export default {
  data() {
    return {
      showTouchid: false,
      showFaceid: false,
      certifyAlertFlag: false,
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT"),
      isTouchFaceid: ""
    }
  },
  computed: {
    isFromApp() {
      return DI.get("utils").isFromApp()
    },
    cardType() {
      return this.account.card_type === "idcard"
        ? "身份证"
        : this.account.card_type
    },
    displaySecurityLevel() {
      return DI.get("auth").getUserSecurityLevel()
    },
    isSetCardNumber() {
      return this.account.set_card_number
    },
    isSetPassword() {
      return this.account.set_fund_password
    },
    isSetGoogleAuth() {
      return this.account.set_google_auth
    },
    account() {
      return DI.get("auth").getUser()
    }
  },
  mounted() {
    DI.get("utils").setTitle(this.$t('me.securityCenter'))
    if (this.isFromApp) {
      const type = window.biometryType()
      if (type === "Touch ID") {
        this.showTouchid = true
      }
      if (type === "Face ID") {
        this.showFaceid = true
      }
      if (type === "指纹识别") {
        this.showTouchid = true
      }
      this.isTouchFaceid = window.biometryEnabled
      this.docVisibilityChange()
    }

    this.$nextTick(() => {
      DI.get("utils").setBody("bacgray")
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.isFromApp) {
      document.removeEventListener("visibilitychange", this.getISTouchFaceid, false)
    }
    next()
  },
  methods: {
    docVisibilityChange() {
      document.addEventListener("visibilitychange", this.getISTouchFaceid)
    },
    getISTouchFaceid() {
      if (!document.hidden) {
        setTimeout(() => {
          this.isTouchFaceid = window.biometryEnabled
        }, 500)
      }
    },
    goToPassword() {
      this.$router.push({
        name: "password",
        params: {
          action: this.isSetPassword ? "update" : "set"
        }
      })
    },
    toidentity() {
      if (this.isSetCardNumber) {
        // Dialog.alert({
        //   title: '身份验证成功',
        //  message: `${this.account.name} ${this.account.card_number} \r\n如身份信息登记有误，请联系客服微信：${this.customWechat}`
        // })
        // return
        this.certifyAlertFlag = true
        return
      }
      this.$router.push({ name: "realname" })
    },
    goToSellMethod() {
      this.$router.push({ name: "sellMethod" })
    },
    onTouchId() {
      window.location = "onebtc://auth"
    },
    onFaceId() {
      window.location = "onebtc://auth"
    },
    goToSafeDescription() {
      this.$router.push({ name: "safeDescription" })
    },
    to2fa() {
      this.$router.push({ name: "2faSetting" })
    }
  }
}
</script>
<style scoped lang="less">
.otherset {
  .comm-list {
    background: transparent;
  }
  .comm-listitem {
    height: 66px;
    line-height: 66px;
    background-color: #fff;

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
    .flex-left-right {
      align-items: center;
    }
  }
  .level-box {
    display: flex;
    font-size: 12px;
    color: rgba(34, 34, 34, 0.6);
    flex-direction: column;
    line-height: 18px;

    .level-progress {
      margin-top: 5px;
      width: 72px;
      background-color: #d8d8d8;
      height: 4px;
      border-radius: 2px;
      span {
        display: block;
        height: 4px;
        border-radius: 2px 0 0 2px;
      }
      span.level0 {
        width: 33%;
        background-color: #ff654c;
      }
      span.level1 {
        width: 66%;
        background-color: #f7931a;
      }
      span.level2 {
        border-radius: 2px;
        background-color: #36d58f;
      }
    }
  }
}
.faceid {
  background: url("../../assets/images/icon23.png") no-repeat center;
  background-size: 110%;
}
.touchid {
  background: url("../../assets/images/icon22.png") no-repeat center;
  background-size: 100%;
}
.iconWallet {
  background: url("../../assets/images/icon-account-wallet.png") no-repeat
    center;
  background-size: 100%;
}
.iconSecurity {
  background: url("../../assets/images/icon-account-security.png") no-repeat
    center;
  background-size: 95%;
}
.iconidentity {
  background: url("../../assets/images/icon02.png") no-repeat center;
  background-size: 100%;
}
.icon2fa {
  background: url("../../assets/images/2fa/icon.png") no-repeat center;
  background-size: 100%;
}
.tip-box {
  text-align: center;
  font-size: 12px;
  color: rgba(34, 34, 34, 0.6);
  margin-top: 15px;
  line-height: 24px;
}
.comm-listitem-end {
  margin-bottom: 10px;
}
.comm-listitem-end:after {
  content: none;
}

.iconPassword {
  background: url("../../assets/images/icon17.png") no-repeat center;
  background-size: 95%;
}
.iconSell {
  background: url("../../assets/images/icon25.png") no-repeat center;
  background-size: 100%;
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
.van-dialog {
  overflow: visible !important;
}
</style>
