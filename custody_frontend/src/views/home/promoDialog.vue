<template>
  <van-dialog
    v-model="dialogFlag"
    class="promo-dialog-wrap"
    :show-confirm-button="false"
  >
    <div class="promo-dialog-box">
      <img
        class="bg"
        :src="curNotifData['img']"
      >
      <div
        class="dialog-btn"
        @click="closeAndJump"
      >
        &nbsp;
      </div>
    </div>
    <img
      class="btn-close img-btn-dark"
      src="../../assets/images/icon-close.png"
      width="40"
      @click="closeDialog"
    >
  </van-dialog>
</template>
<script>
import { DI } from "core"

const USER_HIDE_PROMO_DOWNLOAD = "USER_HIDE_PROMO_DOWNLOAD"
const PROMO_DIALOG_TYPE = {
  download: {
    img: require("../../assets/images/promoDialog/download.jpg"),
    pushData: {
      name: "download"
    }
  },
  popup_bibi_order: {
    img: require("../../assets/images/promoDialog/bibi.jpg"),
    pushData: {
      name: "chart",
      params: {
        symbol: "BTC_USDT"
      }
    }
  },
  popup_invite: {
    img: require("../../assets/images/promoDialog/invite.jpg"),
    pushData: {
      name: "invite"
    }
  },
  popup_yubibao_transaction: {
    img: require("../../assets/images/promoDialog/yubibao.jpg"),
    pushData: {
      name: "yubibao"
    }
  },
  popup_bounty_task: {
    img: require("../../assets/images/promoDialog/mining.jpg"),
    pushData: {
      name: "mining"
    }
  },
  popup_red_packet: {
    img: require("../../assets/images/promoDialog/redenvelope.jpg"),
    pushData: {
      name: "redEnvelope"
    }
  }
}

export default {
  data() {
    return {
      dialogFlag: false
    }
  },
  computed: {
    notif() {
      return DI.get("store").state.notification.notification['popup_index']
    },
    curNotif() {
      if (this.hasDownload) {
        return { 
          id: "", 
          type: "download"
        }
      }
      // console.log("promo dialog notif: ", this.notif) // eslint-disable-line no-console
      if (this.isFromApp && this.notif && this.notif.length) {
        const notice = this.notif[0]
        return {
          id: notice.message_id, 
          type: notice.event_detail.type
        }
      }
      return {}
    },
    curNotifData() {
      return this.curNotif && this.curNotif.type ? PROMO_DIALOG_TYPE[this.curNotif.type] : {}
    },
    isFromApp() {
      return DI.get("utils").isFromApp()
    },
    hasDownload() {
      return !this.isFromApp && (this.$dayjs().diff(this.$dayjs(+DI.get("offlineStorage").get(USER_HIDE_PROMO_DOWNLOAD)), "h") >= 24)
    }
  },
  watch: {
    curNotif: {
      immediate: true,
      handler(val) {
        if (val && val.type) {
          this.dialogFlag = true
        } else {
          this.dialogFlag = false
        }
      }
    }
  },
  beforeDestroy() {
    this.dialogFlag = false
  },
  mounted() {
    if (DI.get("utils").isFromApp()) {
      DI.get('store').dispatch('SYNC_NOTIFICATION')
    }
  },
  methods: {
    closeDialog() {
      this.dialogFlag = false
      if (this.curNotif.type === "download") {
        // storage 1d
        DI.get("offlineStorage").set(USER_HIDE_PROMO_DOWNLOAD, this.$dayjs().valueOf())
        return
      }
      // post msg
      DI.get("store").dispatch("READ_NOTIFICATION_BY_ID", {
        id: this.curNotif.id,
        key: "popup_index"
      })
    },
    closeAndJump() {
      this.closeDialog()
      this.$router.push(this.curNotifData["pushData"])
    }
  }
}
</script>

<style scoped lang="less">
.promo-dialog-wrap {
  &.van-dialog {
    overflow: visible;
    width: 80%;
  }
  .btn-close {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: -60px;
  }

  .promo-dialog-box {
    width: 100%;
    height: 0;
    padding-bottom: 125%;
    position: relative;
    .bg {
      width: 100%;
      border-radius: 4px;
    }

    .dialog-btn {
      position: absolute;
      bottom: 11%;
      width: 78%;
      height: 15%;
      left: 11%;
      &:active {
        box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>