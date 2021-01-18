<template>
  <div class="deposit container-white">
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
    <div class="content">
      <selectChain
        :chain-info="chainInfo"
        :active="active"
        @select="onSelectChainChange"
      />
      <div class="qr-code">
        <img
          v-if="qrCode"
          :src="qrCode"
        >
      </div>

      <div class="address-line">
        <div class="input-label">
          {{ target }} 充币地址
        </div>
        <div class="comm-textarea">
          <img
            src="../../assets/images/icon-shield.png"
            width="16"
            class="mr15"
          >
          <van-field
            :class="[
              'address-field',
              info.address && info.address.length > 18 && 'small-size'
            ]"
            :value="info.address"
            :readonly="true"
            type="textarea"
            rows="1"
          />
          <CopyButton
            :text="info.address"
            :hide-text="true"
          />
        </div>
      </div>
      <div
        v-if="info.addressTag"
        class="address-line"
      >
        <div class="input-label">
          充币标签
        </div>
        <div class="comm-textarea">
          <van-field
            class="address-field"
            :value="info.addressTag"
            :readonly="true"
            type="textarea"
            rows="1"
          />
          <CopyButton
            :text="info.addressTag"
            :hide-text="true"
          />
        </div>
      </div>
      <div class="tip-box mt40">
        <div>注意：</div>
        <div class="item">
          请勿向上述地址充值任何非 {{ displayTarget }} 资产，否则资产将不可找回。
        </div>
        <div
          v-if="target === 'EOS' || target === 'XRP'"
          class="item"
        >
          向 aBTC.one 充值 {{ target }} 成功需要同时提供 标签 和 地址
        </div>
      </div>
    </div>

    <van-dialog
      v-model="shareAlertFlag"
      class="share-dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="share-confirm-dialog">
        <div class="confirm-title">
          接收 {{ displayTarget }}
        </div>

        <div class="qr-code">
          <img
            v-if="qrCode"
            :src="qrCode"
          >
        </div>

        <button
          class="btn-blue"
          @click="appShare"
        >
          <img
            src="../../assets/images/btn-icon-share.png"
            width="20"
          >
          {{ $t('shareImage') }}
        </button>
        <button
          class="btn-gray"
          @click="onSave"
        >
          <img
            src="../../assets/images/btn-icon-save.png"
            width="20"
          >
          {{ $t('saveImage') }}
        </button>
      </div>
      <img
        class="btn-close"
        src="../../assets/images/icon-close.png"
        width="40"
        @click="() => (shareAlertFlag = false)"
      >
    </van-dialog>
  </div>
</template>
<script>
import { DI } from "core"
import QRCode from "@kpi/qrcode"
import { Poster } from "@kpi/poster"
import { CopyButton, Indicator, Message } from "components"
import addShareImg from './addShareImg'
import selectChain from './selectChain'
import fetchBlobXHR from '@kpi/u/fetchBlobXHR'
import fileToBase64 from '@kpi/u/fileToBase64'

export default {
  components: {
    CopyButton,
    selectChain
  },
  mixins: [addShareImg],
  data() {
    return {
      target: "",
      qrCode: "",
      shareAlertFlag: false,
      shareImg: "",
      chainInfo: [],
      active: ''
    }
  },
  computed: {
    displayTarget() {
      return this.active ? `${this.active}_${this.target}` : this.target
    },
    info() {
      return this.chainInfo.find(e => e.chain_name === this.active) || {}
    },
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    biTargetInfo() {
      return this.biInfo[this.target] || {}
    },
    iconUrl() {
      return this.biTargetInfo && this.biTargetInfo["use_device_icon"]
        ? DI.get('BI_LOCAL_ICON')[this.target]
        : this.biTargetInfo["icon_url"]
    }
  },
  watch: {
    biTargetInfo: {
      immediate: true,
      handler() {
        this.getBase64Data()
      }
    },
    info: {
      handler() {
        this.getBase64Data()
      }
    }
  },
  mounted() {
    const { query } = this.$route
    this.target = query.target || "BTC"
    DI.get("utils").setTitle(this.$t('deposit'))

    if (DI.get('utils').isFromApp()) {
      DI.get("vue").$emit("set-header-right", {
        share: true,
        action: this.appShareDialog
      })
    }
    this.getDepositAddress()
  },
  methods: {
    goSelect() {
      this.$router.replace({
        name: "selectBI",
        query: {
          target: "deposit",
          item: this.target
        }
      })
    },
    getBase64Data() {
      if (!this.info.address || !this.biTargetInfo["name"]) {
        return
      }

      if (this.biTargetInfo["use_device_icon"]) {
        // local icon
        this.renderQr(this.iconUrl)
      } else {
        fetchBlobXHR(this.iconUrl)
          .then(blob => fileToBase64(blob))
          .then(base64 => {
            this.renderQr(base64)
          })
          .catch(Message)
      }
    },
    renderQr(iconUrlData) {
      const qrCode = new QRCode({
        size: 500,
        text: this.info.address
      }).toDataURL()
      new Poster()
        .loadImg([
          qrCode,
          iconUrlData
        ])
        .then(instance => {
          instance.init(0)
          const context = instance.canvas.getContext("2d")
          const cHalfWidth = instance.canvas.width / 2
          const iconWidth = cHalfWidth * 0.35
          context.fillStyle = "white"
          context.beginPath()
          context.arc(cHalfWidth, cHalfWidth, cHalfWidth * 0.2, Math.PI * 2, 0)
          context.closePath()
          context.fill()
          instance.addImg({
            index: 1,
            x: cHalfWidth - iconWidth * 0.5,
            y: cHalfWidth - iconWidth * 0.5,
            width: iconWidth,
            height: iconWidth
          })
          this.qrCode = instance.canvas.toDataURL("image/png")

          if(DI.get('utils').isFromApp()) {
            this.generageShareImg(DI.get("offlineStorage").get("USER_AVATAR_CACHE"))
          }
        })
    },
    getDepositAddress() {
      Indicator.open(this.$t("loading"))
      DI.get("orderHttp")
        .getDepositAddressV2(this.target)
        .then(res => {
          this.chainInfo = res
          this.setActive()
        })
        .catch(Message)
        .then(() => {
          setTimeout(Indicator.close, 500) // QC code load
        })
    },
    setActive() {
      if (this.target === 'USDT') {
        this.active = this.chainInfo[0].chain_name
        this.active = 'ERC20'
      } else {
        this.active = this.chainInfo[0].chain_name
      }
    },
    appShareDialog() {
      this.shareAlertFlag = true
    },
    onSave() {
      DI.get('utils').appSaveImg(this.shareImg)
    },
    appShare() {
      // window.location = 'onebtc://share/' + this.qrCode
      // app 原生分享 share(base64 : string)
      DI.get("utils").appShareImg(this.shareImg)
      this.shareAlertFlag = false
    },
    onSelectChainChange(item) {
      this.active = item.chain_name
    }
  }
}
</script>
<style scoped lang="less">
@labelColor: rgba(34, 34, 34, 0.6);
@textColor: #222;
.deposit {
  .selectBI {
    background: #f1f2f4;
    padding: 0 40px;
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

  .content {
    padding: 0 40px;
  }
  .qr-code {
    width: 50%;
    height: 0;
    padding-bottom: 50%;
    margin: 30px auto;
  }
  .address-line {
    position: relative;
    margin-top: 20px;
    .input-label {
      margin-bottom: 10px;
      font-size: 14px;
      color: #222222;
    }
  }
  .comm-textarea {
    border: 1px solid #ddd;
    padding: 0 15px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px #eee;
    border-radius: 3px;
  }
  .comm-textarea .van-cell {
    flex: 1;
    padding: 0 !important;
  }
  .address-field {
    color: #222;
    font-size: 18px;
    height: 60px;
    line-height: 60px;
    &.small-size {
      padding: 10px 15px 10px 0 !important;
      font-size: 14px;
      line-height: 20px;
    }
  }

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
}

.share-dialog-wrap .btn-close {
  position: absolute;
  left: 50%;
  margin-left: -20px;
  bottom: -60px;
}
.van-dialog {
  overflow: visible;
  width: 75%;
}

.share-confirm-dialog {
  padding: 30px 40px;

  .qr-code {
    width: 80%;
    height: 0;
    padding-bottom: 80%;
    margin: 20px auto 40px;
  }
  .confirm-title {
    text-align: center;
    color: #000;
    font-weight: bold;
  }

  button {
    display: block;
    width: 100%;
    outline: none;
    height: 48px;
    border: none;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin-right: 5px;
    }
  }
  .btn-blue {
    margin-bottom: 20px;
    background-color: #00c3d2;
    color: #fff;
    font-weight: bold;
  }
  .btn-gray {
    background-color: #fff;
    border: 2px solid #eee;
    color: #222;
  }
}
</style>
