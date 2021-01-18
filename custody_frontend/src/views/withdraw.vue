<template>
  <div class="withdraw container-white">
    <div
      class="selectBI flex-left-right touch"
      @click="goSelect"
    >
      <div class="selectItem">
        <img
          v-if="iconUrl"
          :src="iconUrl"
          width="28"
        >
        <span>{{ target }}</span>
      </div>
      <div class="rightrow">
        切换币种
      </div>
    </div>
    <div class="select-chain">
      <selectChain
        :chain-info="chainInfo"
        :active="active"
        @select="onSelectChainChange"
      />
    </div>
    <div class="drawcontent">
      <div class="comm-inputcon spacebetw">
        <van-field
          v-model="walletAddress"
          type="textarea"
          :placeholder="walletAddressPlaceholder"
          class="wallat-address"
          rows="1"
          autosize
        />
        <!-- <span class="drawcode" /> -->
        <span
          v-if="isShowPasteBtn()"
          class="paste-code ml5"
          @click="pasteCode"
        >
          粘贴
        </span>
      </div>
      <div
        v-if="storeWalletCoinInfo['address_have_memo']"
        class="comm-inputcon address-field-input mt30"
      >
        <van-field
          v-model="memo"
          :placeholder="`请输入${target}收款标签`"
        />
      </div>
      <div class="comm-inputcon address-field-input mt30">
        <van-field
          v-model="amount"
          placeholder="请输入转账数额"
          maxlength="10"
          type="number"
        />
        <span
          class="paste-code"
          @click="fillAvaliable"
        >
          {{ $t("available") }}: {{ avaliableBalance | maxDecimal(8) }}
        </span>
      </div>
      <div class="commflex mt15 font12 graycolor">
        <div>{{ $t("service") }}: {{ withdrawFee }}</div>
        <div>{{ $t("actual") }}: {{ actualWithdrawAmnout }}</div>
      </div>
      <div class="mt20">
        <van-button
          size="large"
          round
          class="orange-btn btn-withdraw"
          :disabled="!withDrawButtonEnabled"
          :loading="loading"
          @click="showPopup"
        >
          {{ $t("confirmdraw") }}
        </van-button>
      </div>

      <div class="tip-box mt40">
        <div>注意：</div>
        <div
          v-if="target === 'USDT'"
          class="item"
        >
          请勿提币至任何非 {{ active }}_USDT 地址，否则资产将不可找回。
        </div>
        <div class="item">
          {{ $t("tips7") }} {{ storeWalletCoinInfo['withdraw_min_volume'] }} {{ target }}
        </div>
        <div class="item">
          {{ $t("tips6") }}
        </div>
      </div>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
    >
      <div
        v-if="popUpStep === 1"
        class="pd20 withdraw-popup"
      >
        <div class="title">
          提币验证
        </div>
        <div class="info info-top commflex">
          <div class="left">
            提币地址
          </div>
          <div class="right">
            {{ walletAddress }}
          </div>
        </div>
        <div class="info commflex">
          <div class="left">
            提币数量
          </div>
          <div class="right">
            {{ amount }}
          </div>
        </div>
        <div class="top-title">
          <span
            class="top-back"
            @click="hidePopup"
          />
        </div>
        <div class="withdraw-label">
          资金密码
        </div>
        <PasswordInput
          ref="passInput"
          key="passInput"
          :hide-pass="hidePass"
          class="withdraw-pass"
          :auto-focus="false"
          @onChange="onPassChange"
        />
        <van-button
          size="large"
          round
          class="orange-btn withdraw-btn"
          :disabled="!passButtonEnabled"
          :loading="loading"
          @click="onWithdrawStep1"
        >
          {{ `${ needGoogleAuth ? '下一步' : $t("confirmdraw") }` }}
        </van-button>
        <p class="tip">
          请再次核对提币地址，一旦转出将无法撤回
        </p>
      </div>
      <div
        v-if="popUpStep === 2"
        class="pd20 withdraw-popup"
      >
        <div class="title">
          二次验证
        </div>
        <div class="auth-icon">
          <img src="../assets/images/2fa/auth.png">
        </div>
        <div class="top-title">
          <span
            class="top-back"
            @click="hidePopup"
          />
        </div>
        <div class="withdraw-label">
          谷歌验证码
        </div>
        <span
          v-if="showPastePop"
          class="paste-code-pop ml5"
          @click="pasteGoogleToken"
        >
          {{ $t('paste') }}
        </span>
        <PasswordInput
          ref="authInput"
          key="authInput"
          :hide-pass="hidePass"
          class="withdraw-pass"
          :auto-focus="false"
          @onChange="onAuthTokenChange"
        />
        <van-button
          size="large"
          round
          class="orange-btn withdraw-btn"
          :disabled="!authButtonEnabled"
          :loading="loading"
          @click="onWithdraw"
        >
          {{ $t("confirmdraw") }}
        </van-button>
        <p class="tip">
          请从谷歌验证App获取谷歌验证码
        </p>
      </div>
    </van-popup>
    <PopUp
      ref="popup"
      title="温馨提醒"
      :hide-btn="true"
    >
      <div class="google-popup">
        <p>为保证您的资产安全</p>
        <p>建议绑定谷歌验证</p>
        <van-button
          size="large"
          round
          class="orange-btn"
          @click="onConfirmGoogleAuth"
        >
          确认
        </van-button>
        <van-button
          size="large"
          round
          class="white-btn"
          @click="onCloseGoogleAuth"
        >
          下次再说
        </van-button>
      </div>
    </PopUp>
  </div>
</template>
<script>
import { DI } from "core"
import { PasswordInput, Message, PopUp } from "components"
import selectChain from './deposit/selectChain'

const LAST_GOOGLE_AUTH_POPUP = 'LAST_GOOGLE_AUTH_POPUP'

export default {
  components: {
    PasswordInput,
    selectChain,
    PopUp
  },
  data() {
    return {
      show: false,
      walletAddress: "",
      amount: "",
      password: "",
      hidePass: true,
      target: "",
      memo: "",
      loading: false,
      active: 'ERC20',
      needGoogleAuth: false,
      googleToken: '',
      popUpStep: 1,
      showPastePop: false,
      lastGoogleToken: ''
    }
  },
  computed: {
    withdrawFee() {
      if (this.target !== 'USDT') return this.storeWalletCoinInfo['withdraw_fee']
      const feeObj = this.chainInfo.find(_ => _.chain_name === this.active) || {}
      return feeObj.withdraw_fee
    },
    chainInfo() {
      if (this.target !== 'USDT') return []
      return this.storeWalletCoinInfo.multiple_chains || []
    },
    storeWalletCoinInfo() {
      return DI.get("store").state.setting.walletCoinInfo[this.target] || {}
    },
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    biTargetInfo() {
      return this.biInfo[this.target] || {}
    },
    iconUrl() {
      return DI.get('utils')
        .getCoinIconUrlFromSetting(this.target, this.biTargetInfo)
    },
    walletAddressPlaceholder() {
      return `请输入${this.target}收款地址`
    },
    minWithdraw() {
      return this.storeWalletCoinInfo['withdraw_min_volume']
    },
    avaliableBalance() {
      return this.account.available_balance[this.target] || 0
    },
    actualWithdrawAmnout() {
      return this.amount > this.withdrawFee
        ? (this.amount - this.withdrawFee).toFixed(4)
        : 0
    },
    withDrawButtonEnabled() {
      return (
        this.walletAddress &&
        this.amount &&
        Number(this.amount) <= Number(this.avaliableBalance)
      )
    },
    passButtonEnabled() {
      return this.password.length === 6
    },
    authButtonEnabled() {
      return this.googleToken.length === 6
    },
    account() {
      return DI.get("auth").getUser()
    },
    isFromApp() {
      return DI.get("utils").isFromApp()
    }
  },
  watch: {
    account: {
      immediate: true,
      handler(val) {
        if (val.set_google_auth === false) {
          this.initGoogleAuthPopup()
        }
        if (val.set_google_auth) {
          this.needGoogleAuth = true
        }
      }
    }
  },
  mounted() {
    const { query } = this.$route
    this.target = query.target || "BTC"
    DI.get("utils").setTitle(this.$t("withdraw"))
    this.checkWalletCoinInfo()

    if (this.isFromApp) {
      setInterval(() => {
        DI.get("utils")
          .appPaste()
          .then(str => {
            this.showPastePop = (str.length === 6 && this.lastGoogleToken != str)
          })
      }, 1000)
    }
  },
  methods: {
    checkWalletCoinInfo() {
      if (this.storeWalletCoinInfo.name) return
      DI.get('store').dispatch('SYNC_WALLET_COIN_SETTING',
        { coin: this.target })
    },
    pasteGoogleToken() {
      DI.get('utils')
        .appPaste()
        .then(clipText => {
          this.lastGoogleToken = clipText
          this.$refs.authInput.code = clipText
          this.googleToken = clipText
        })
    },
    isShowPasteBtn() {
      // ios || web:clipboard
      return (this.isFromApp && window.paste) ||
        (navigator.clipboard && navigator.clipboard.readText)
        ? true
        : false
    },
    goSelect() {
      this.$router.replace({
        name: "selectBI",
        query: {
          target: "withdraw",
          item: this.target
        }
      })
    },
    fillAvaliable() {
      this.amount = this.avaliableBalance
    },
    onWithdrawStep1() {
      if (this.needGoogleAuth) {
        this.popUpStep = 2
      } else {
        this.onWithdraw()
      }
    },
    onWithdraw() {
      const withdrawObject = {
        currency: this.target,
        amount: Number(this.amount),
        wallet_address: this.walletAddress,
        fund_password: this.password
      }
      if (this.needGoogleAuth) {
        withdrawObject.google_auth_token = this.googleToken
      }
      if (this.storeWalletCoinInfo['address_have_memo']) {
        withdrawObject.wallet_address = `${this.walletAddress}|${this.memo}`
      }

      this.loading = true
      DI.get("orderHttp")
        .createWithdraw(withdrawObject)
        .then(() => {
          this.$router.push({
            name: 'asset',
            query: {
              target: this.target || 'BTC'
            },
            params: {
              from: 'withdrawPending'
            }
          })
        })
        .catch(Message)
        .then(() => {
          this.loading = false
          this.$refs.passInput && this.$refs.passInput.clear()
          this.$refs.authInput && this.$refs.authInput.clear()
        })
    },
    onPassChange(val) {
      this.password = val
    },
    onAuthTokenChange(val) {
      this.googleToken = val
    },
    showPopup() {
      if (this.amount < this.minWithdraw) {
        Message(`最小提现数量为 ${this.minWithdraw}`)
        return
      }
      if (this.checkUSDTChain()) {
        Message(`请输入有效的${this.active}地址`)
        return
      }
      this.show = true
    },
    checkUSDTChain() {
      if (this.target !== 'USDT') return false
      const one = this.walletAddress[0]
      const two = this.walletAddress[1]
      if (this.active === 'TRON' && one === 'T') return false
      if (this.active === 'ERC20' && one === '0' && two === 'x') return false
      if (this.active === 'OMNI' && ['1', '3'].indexOf(one) > -1) return false
      return true
    },
    hidePopup() {
      this.show = false
      this.popUpStep = 1
    },
    goToWithdrawPending() {
      this.$router.push({ name: "drawbi2" })
    },
    pasteCode() {
      if (this.isFromApp) {
        DI.get('utils')
          .appPaste()
          .then(clipText => (this.walletAddress = clipText))
      } else if (navigator.clipboard) {
        navigator.clipboard
          .readText()
          .then(clipText => (this.walletAddress = clipText))
      }
    },
    onSelectChainChange(item) {
      this.active = item.chain_name
    },
    onCloseGoogleAuth() {
      this.$refs.popup.onClose()
    },
    onConfirmGoogleAuth() {
      this.$router.push({ name: "2faSetting" })
    },
    initGoogleAuthPopup() {
      const lastTime = +DI.get('offlineStorage').get(LAST_GOOGLE_AUTH_POPUP)
      if (lastTime && this.$dayjs().diff(this.$dayjs(lastTime), 'day') < 30) return
      DI.get('offlineStorage').set(LAST_GOOGLE_AUTH_POPUP, this.$dayjs().valueOf())
      this.$nextTick(() => {
        this.$refs.popup.onOpen()
      })
    }
  }
}
</script>
<style scoped lang="less">
@labelColor: rgba(34, 34, 34, 0.6);
@textColor: #222;
.selectBI {
  background: #f1f2f4;
  padding: 0 30px;
  align-items: center;
  height: 66px;
  .selectItem {
    height: 28px;
    img {
      margin-right: 10px;
    }
    display: flex;
    align-items: center;
    color: @textColor;
  }
  .rightrow {
    color: @labelColor;
    font-size: 12px;
    padding-right: 15px;
    background-position: right 0 bottom 50% !important;
  }
}
.select-chain {
  padding: 0 30px;
}
.drawcontent {
  padding: 30px;

  .tip-box {
    font-size: 12px;
    color: @labelColor;
    line-height: 24px;
    .item {
      position: relative;
      padding-left: 12px;
      &::before {
        content: "*";
        font-size: 16px;
        position: absolute;
        left: 0;
        top: 3px;
      }
    }
  }
  .btn-withdraw {
    height: 60px;
    line-height: 60px;
  }
  .wallat-address {
    padding: 18px 0 !important;
    font-size: 16px !important;
  }
  .address-field-input{
    display: flex;
    align-items: center;
  }
}

.drawcode {
  display: inline-block;
  width: 25px;
  height: 50px;
  background: url("../assets/images/icon08.png") no-repeat center;
  background-size: 100%;
  vertical-align: middle;
}
.paste-code {
  font-size: 14px;
  font-weight: bold;
  vertical-align: middle;
  color: #00c3d2;
}
.paste-code-pop {
  font-size: 14px;
  vertical-align: top;
  color: white;
  background-color: #333;
  border-radius: 10px;
  padding: 10px 15px;
  position: absolute;
  z-index: 99;
  margin-top: -50px;
  margin-left: -30px;
}
.paste-code-pop:after, .paste-code-pop:before {
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}

.paste-code-pop:after {
	border-color: rgba(0, 0, 0, 0);
	border-top-color: #333;
	border-width: 5px;
	margin-left: -5px;
}
.paste-code-pop:before {
	border-color: rgba(0, 0, 0, 0);
	border-top-color: #333;
	border-width: 5px;
	margin-left: -5px;
}
.withdraw-popup {
  height: calc(100vh - 40px);
  text-align: center;
  .title {
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    padding: 40px 0 10px;
  }
  .info {
    align-items: center;
    margin: 10px 0 10px;
    border-bottom: 1px solid #eee;
    padding: 15px 0;
    .left {
      width: 40%;
      text-align: left;
      opacity: 0.6;
      color: #222222;
    }
    .right {
      margin-left: 20px;
      word-break: break-all;
      text-align: right;
    }
  }
  .info-top {
    margin: 10px 0 10px
  }
  .top-title{
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  .top-back {
    display: block;
    position: absolute;
    left: 20px;
    top: 20px;
    width: 10px;
    height: 16px;
    background: url(../assets/images/back-black.png) no-repeat;
    background-size: 10px 16px;
  }
  .withdraw-label {
    text-align: left;
    padding-top: 20px;
    padding-bottom: 20px;
    opacity: 0.6;
    color: #222222;
  }
  .withdraw-pass {
    padding: 0 0 30px;
  }
  .tip {
    margin-top: 20px;
    font-size: 12px;
  }
  .withdraw-cancel-btn {
    background: #999 !important;
    box-shadow: none;
    opacity: 0.6;
    margin-top: 15px;
  }
  .auth-icon {
    padding: 20px 0 40px;
    img {
      width: 70px;
      display: block;
      margin: 0 auto;
    }
  }
}
.withdraw {
  /deep/ .van-popup--bottom {
  width: 100.5%;
}
}
.google-popup {
  p {
    padding-bottom: 10px;
    text-align: center;
    font-size: 14px;
    color: #999;
  }
  button {
    margin: 5px 0;
  }
}
</style>
<style>
.address-field-input input {
  font-size: 16px !important;
  padding: 18px 0 !important;
}
</style>
