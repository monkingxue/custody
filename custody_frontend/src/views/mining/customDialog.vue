<template>
  <van-dialog
    v-model="dialogFlag"
    class="custom-dialog-wrap"
    :show-confirm-button="false"
  >
    <div class="custom-dialog-box">
      <img
        :src="dialogData['headImg']"
        class="head-img"
        height="57"
      >
      <div class="title">
        {{ dialogData["title"] ? dialogData["title"] : rewardText }}
      </div>
      <div
        v-if="type === 'transferUSDT' || type === 'transferBTC'"
        class="content"
      >
        {{ dialogData["content"] }}
        {{ rewardText }}
      </div>
      <!-- eslint-disable -->
      <div
        v-else-if="type === 'desc'"
        class="content desc preline"
      >{{ dialogData["content"] }}</div>
      <div
        v-else
        class="content preline"
      >{{ dialogData["content"] }}</div>
      <!-- eslint-enable -->
      
      <button
        class="btn-green"
        @click="confirmDialog"
      >
        {{ dialogData["btnText"] }}
      </button>
      <button
        v-if="type === 'deposit_success'"
        class="btn-green-outline mt10"
        @click="goDepositGuide"
      >
        如何充值
      </button>
    </div>
    <img
      class="btn-close"
      src="../../assets/images/icon-close.png"
      width="40"
      @click="closeDialog"
    >
  </van-dialog>
</template>
<script>
import { DI } from "core"

const DIALOG_ALL_DATA = {
  desc: {
    headImg: require("../../assets/images/mining/title-desc.png"),
    title: "挖矿说明",
    content: `1. 星球上每 4 小时产生一块绿色（USDT）或黄色晶体（BTC），可自由拾取，矿物放置 48 小时不拾取则会消失。\n 2. 紫色晶体为稀有矿物，需完成任务后拾取，紫色晶体不定时刷新。\n 3. 矿物资产可提取到钱包，用于正常交易与提现。`,
    btnText: "好的"
  },
  transferUSDT: {
    headImg: require("../../assets/images/mining/title-usdt.png"),
    title: "USDT 矿车",
    content: "",
    btnText: "转划到钱包"
  },
  transferBTC: {
    headImg: require("../../assets/images/mining/title-btc.png"),
    title: "BTC 矿车",
    content: "",
    btnText: "转划到钱包"
  },
  deposit_success: {
    headImg: require("../../assets/images/mining/title-reward.png"),
    title: "",
    content: `您需要完成一次充值\n（充值任意币种均可完成任务）`,
    btnText: "去充值",
    pushData: {
      name: 'deposit',
      query: {
        target: "BTC"
      }
    }
  },
  yubibao_success: {
    headImg: require("../../assets/images/mining/title-reward.png"),
    title: "",
    content: `您需要体验一次余币宝理财\n（随存随取，稳定收益，低风险）`,
    btnText: "去余币宝",
    pushData: {
      name: 'yubibao'
    }
  },
  bibi_success_order: {
    headImg: require("../../assets/images/mining/title-reward.png"),
    title: "",
    content: `您需要完成一次币币交易\n（任意币种与交易金额）`,
    btnText: "去币币交易",
    pushData: {
      name: 'chart',
      params: {
        symbol: "BTC_USDT"
      }
    }
  },
  share_success: {
    headImg: require("../../assets/images/mining/title-reward.png"),
    title: "",
    content: "您需要完成一次分享",
    btnText: "去分享",
    pushData: {
      name: 'invite'
    }
  },
  invite_success: {
    headImg: require("../../assets/images/mining/title-reward.png"),
    title: "",
    content: `您需要邀请一名实名好友\n（可享受至多 50% 好友交易手续费返佣）`,
    btnText: "去邀请",
    pushData: {
      name: 'invite'
    }
  },
  otc_success_order: {
    headImg: require("../../assets/images/mining/title-reward.png"),
    title: "",
    content: `您需要完成一次 OTC 交易\n（任意币种与交易金额）`,
    btnText: "去法币交易",
    pushData: {
      name: 'fiat'
    }
  }
}

export default {
  props: {
    callback: Function,
    type: String,
    coinName: String,
    bonusAmount: String
  },
  data() {
    return {
      dialogFlag: false
    }
  },
  computed: {
    dialogData() {
      return this.type ? DIALOG_ALL_DATA[this.type] : {}
    },
    rewardText() {
      if (this.type === "desc") {
        return ""
      }
      if (this.type === "transferUSDT" || this.type === "transferBTC") {
        return `余额：${this.bonusAmount} ${this.coinName}`
      }
      return `奖励 ${this.bonusAmount} ${this.coinName}`
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.dialogFlag = true
        } else {
          this.dialogFlag = false
        }
      }
    }
  },
  mounted() {},
  methods: {
    closeDialog() {
      DI.get("vue").$emit("set-dialog-type")
    },
    confirmDialog() {
      this.closeDialog()
      if (typeof this.callback === "function") {
        this.callback()
      }
      if (this.dialogData.pushData) {
        this.$router.push(this.dialogData.pushData)
      }
    },
    goDepositGuide() {
      this.$router.push({
        name: 'guideDeposit'
      })
    }
  }
}
</script>

<style scoped lang="less">
.custom-dialog-wrap {
  width: 80%;
  .btn-close {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: -60px;
  }

  .custom-dialog-box {
    padding: 30px;
    
    .head-img {
      margin: -58px auto 30px;
    }
    .title {
      text-align: center;
      font-weight: 500;
    }
    .content {
      padding: 10px 0 30px;
      font-size: 14px;
      line-height: 20px;
      color: rgba(34, 34, 34, 0.6);
      text-align: center;
      &.desc {
        padding: 10px 0 15px;
        font-size: 12px;
        line-height: 22px;
        text-align: left;
      }
      &.preline {
        white-space: pre-line;
      }
    }
    .btn-green,
    .btn-green-outline {
      display: block;
      width: 100%;
      outline: none;
      height: 48px;
      line-height: 48px;
      border: 1px solid #38CB99;
      text-align: center;
      color: #fff;
      font-size: 16px;
      border-radius: 5px;
    }
    .btn-green {
      background-color: #38CB99;
    }
    .btn-green-outline {
      background-color: #fff;
      color: #38CB99;
    }
  }
}

.van-dialog {
  overflow: visible;
}
</style>