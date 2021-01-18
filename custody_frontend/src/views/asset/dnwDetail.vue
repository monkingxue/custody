<template>
  <div class="dnw-detail-wrap container-white">
    <div class="bottom-line mb20">
      <div class="btc-img center">
        <img
          v-if="iconUrl"
          :src="iconUrl"
        >
      </div>
      <div class="bi-name mb20">
        {{ detail.currency }}
      </div>
      <div class="info flex-left-right">
        <span>{{ $t('amount') }}</span>
        <span>{{ detail.amount }}</span>
      </div>
      <div class="info flex-left-right">
        <span>{{ $t('status') }}</span>
        <span
          :class="[detail.status < 3 && 'process']"
        >
          {{ displayStatus(detail) }}
        </span>
      </div>
      <div
        v-if="detail.transfer_detail && detail.transfer_detail.confirmedNum"
        class="info flex-left-right"
      >
        <span>{{ $t('blockConfirm') }}</span>
        <span>
          {{
            `${detail.transfer_detail.confirmedNum}/${detail.transfer_detail.confirmingThreshold}`
          }}
        </span>
      </div>
    </div>
    <div class="info flex-left-right">
      <span>{{ $t('address') }}</span>
      <span>{{ detail.wallet_address }}</span>
    </div>
    <div
      v-if="detail.transfer_detail && detail.transfer_detail.txid"
      class="info flex-left-right"
    >
      <span>Txid</span>
      <span>
        {{ detail.transfer_detail.txid }}
      </span>
    </div>
    <div
      v-if="detail.created_at"
      class="info flex-left-right"
    >
      <span>{{ $t('time') }}</span>
      <span>
        {{ $dayjs.unix(detail.created_at).format("YYYY-MM-DD HH:mm:ss") }}
      </span>
    </div>

    <div
      v-if="detail.transfer_detail && detail.transfer_detail.txid"
      class="fix-btn-box fade-in"
    >
      <van-button
        size="large"
        round
        class="orange-btn"
      >
        <div class="btn-content">
          <CopyButton
            :text="detail.transfer_detail.txid"
            :hide-text="true"
          />
          <span class="ml5">{{ $t('copyTxid') }}</span>
        </div>
      </van-button>
    </div>
  </div>
</template>

<script>
import { DI } from "core"
import { CopyButton, Indicator, Message } from "components"

export default {
  components: {
    CopyButton
  },
  data() {
    return {
      id: "",
      detail: {
        currency: "",
        transfer_detail: {}
      }
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    biTargetInfo() {
      const { currency } = this.detail
      return this.biInfo[currency] || {}
    },
    iconUrl() {
      return this.biTargetInfo && this.biTargetInfo["use_device_icon"]
        ? DI.get('BI_LOCAL_ICON')[this.target]
        : this.biTargetInfo["icon_url"]
    },
    avaliableBalance() {
      const { currency } = this.detail
      if (!this.account.balance[currency]) return 0
      return (
        this.account.balance[currency] - this.account.frozen_balance[currency]
      )
    },
    account() {
      return DI.get("auth").getUser()
    }
  },
  mounted() {
    const { query, params } = this.$route
    this.type = params && params.action
    DI.get("utils").setTitle(this.type === "deposit" ? this.$t('depositDetail') : this.$t('withdrawDetail'))
    if (!query.id) {
      Message(this.$t('depositIdError'))
      return
    }
    Indicator.open(this.$t("loading"))
    this.id = query.id
    this.detail = params
    this.getWithdrawDetail()
  },
  methods: {
    getWithdrawDetail() {
      Indicator.open(this.$t("loading"))
      DI.get("orderHttp")
        .getWithdrawDetail(this.id)
        .then(res => {
          this.detail = res
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    displayStatus(item) {
      return DI.get('WITHDRAW_ORDER_STATUS')[item.status] || item.status
    }
  }
}
</script>

<style scoped lang="less">
@labelColor: rgba(34, 34, 34, 0.6);
@textColor: #222;

.dnw-detail-wrap {
  height: 100%;
  min-height: 95vh;
  padding: 0 20px;
  font-size: 14px;
  color: @labelColor;
}
.btc-img {
  padding-top: 30px;
  text-align: center;
  width: 15%;
  margin: 0 auto 10px;
}
.bi-name {
  font-size: 38px;
  color: @textColor;
  font-weight: bold;
  text-align: center;
}
.bottom-line {
  border-bottom: 1px solid #eee;
}
.info {
  line-height: 20px;
  margin-bottom: 15px;
  span:last-child {
    width: 75%;
    text-align: right;
    word-wrap: break-word;
  }
  .process {
    color: #ff9b00;
  }
}

.fix-btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: calc(100% - 40px);
  padding: 0 20px 20px;
  margin: 0 auto;

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    widows: 100%;
  }
}
</style>
