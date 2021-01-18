<template>
  <div class="my-asset container-white">
    <div class="top-asset bottom-line">
      <div class="btc-img center">
        <img
          v-if="iconUrl"
          :src="iconUrl"
        >
      </div>
      <div class="amount center din">
        {{ getFormatNum(account.balance) }}
      </div>
      <div
        v-if="account.cny_balance"
        class="amount-cny center"
      >
        ≈ {{ getFormatNum(account.cny_balance) }} 元
      </div>
      <div class="info flex-left-right">
        <span>{{ $t("available") }}: </span>
        <span>{{ getFormatNum(account.available_balance) }}</span>
      </div>
      <div class="info flex-left-right">
        <span>冻结: </span>
        <span>{{ getFormatNum(account.frozen_balance) }}</span>
      </div>
      <div
        v-if="yubibaoBalance"
        class="info flex-left-right"
      >
        <span>余币宝: </span>
        <span>{{ getFormatNum(yubibaoBalance) }}</span>
      </div>
    </div>

    <div class="trade-box bottom-line mb20">
      <p class="mod-title mod-title-trade">
        交易区
      </p>
      <div class="go-trade">
        <div
          v-for="pairItem in pairPrice"
          :key="pairItem.quote"
          class="pair img-btn-dark"
          @click="() => goToTrade(`${target}_${pairItem.quote}`)"
        >
          <div class="label">
            {{ pairItem.base }} / {{ pairItem.quote }}
          </div>
          <div class="price din">
            <span class="price_num">
              {{ pairItem.last }}
            </span>
            <span
              class="rate"
              :class="[+pairItem.price_change_percent < 0 ? 'orange' : 'green']"
            >
              {{ `${pairItem.price_change_percent}%` }}
            </span>
          </div>
        </div>
        <div
          v-if="
            false && biTargetInfo['otc_buy_enabled'] &&
              fabiPrice.price_change_percent !== undefined
          "
          class="pair img-btn-dark"
          @click="() => goToTrade(target, 'FIAT')"
        >
          <div class="label">
            法币交易
          </div>
          <div class="price din">
            <span class="price_num"> ¥{{ marketStore.buy_price }} </span>
            <span
              class="rate"
              :class="[
                +fabiPrice.price_change_percent < 0 ? 'orange' : 'green'
              ]"
            >
              {{ `${fabiPrice.price_change_percent}%` }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="transaction">
      <p class="mod-title">
        资产历史
      </p>

      <Empty v-if="noRecord" />

      <ul>
        <li
          v-for="item in transactionList"
          :key="item.transaction_type + item.transaction_id"
        >
          <Item :item="item" />
        </li>
      </ul>
      <LoadMore
        v-if="transactionList.length < totalLen"
        v-element-in-view="loadMore"
      />
    </div>

    <div class="withdraw-area fade-in">
      <div class="center-btn">
        <van-button
          size="large"
          round
          class="btns"
          :class="[
            !biTargetInfo['withdraw_enabled'] ? 'gray-btn' : 'yellow-btn'
          ]"
          @click="goWithdraw"
        >
          <img src="../../assets/images/withdraw.png">
          <span>提&nbsp;&nbsp;币</span>
        </van-button>
        <van-button
          size="large"
          round
          class="btns"
          :class="[
            !biTargetInfo['deposit_enabled'] ? 'gray-btn' : 'orange-btn'
          ]"
          @click="goDeposit"
        >
          <img src="../../assets/images/deposit.png">
          <span>充&nbsp;&nbsp;币</span>
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { DI } from "core"
import { Indicator, Message, Empty, LoadMore } from "components"
import { Dialog, Toast } from "vant"
import Item from "./Item"

export default {
  components: {
    Empty,
    LoadMore,
    Item
  },
  data() {
    return {
      transactionList: [],
      noRecord: false,
      pageIndex: 1,
      totalLen: '',
      loading: false,
      target: "",
      pairPrice: [],
      pairInfo: [],
      fabiPrice: {}
    }
  },
  computed: {
    marketStore() {
      return DI.get("store").state.market.market[this.target] || {}
    },
    fabiSymbol() {
      return `${this.target}_USDT`
    },
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    biTargetInfo() {
      return this.biInfo[this.target] || {}
    },
    iconUrl() {
      return this.biTargetInfo && this.biTargetInfo["use_device_icon"]
        ? DI.get("BI_LOCAL_ICON")[this.target]
        : this.biTargetInfo["icon_url"]
    },
    account() {
      return DI.get("auth").getUser()
    },
    yubibaoBalance() {
      return this.account.yubibao_balance
    }
  },
  mounted() {
    const { query, params } = this.$route
    this.target = query.target || "BTC"
    DI.get("utils").setTitle(`${this.target}资产`)
    if (params && params.from === "withdrawPending") {
      Toast.success({
        message: "提币申请已提交",
        className: "van-toast-custom"
      })
    } else {
      Indicator.open(this.$t("loading"))
    }
    this.getTransactions()
    this.getPairInfo()
    DI.get("store").dispatch("SYNC_BASIC_PAIR")
  },
  methods: {
    getPairInfo() {
      Indicator.open(this.$t("loading"))
      DI.get("pairHttp")
        .getPairListV2({
          params: {
            assets: this.target
          }
        })
        .then(res => {
          if (res.assets[0]) {
            this.pairInfo = res.assets[0].pairs
          }
          this.getPairPriceByName()
        })
        .catch(e => {
          Message(e)
          Indicator.close()
        })
    },
    getPairPriceByName() {
      if (this.pairInfo.length === 0) {
        this.fabiPrice.price_change_percent = 0 // USDT hack
        return
      }
      DI.get("pairHttp")
        .getPairPriceByName(this.pairInfo)
        .then(res => {
          const pairList = DI.get("utils").formatPairArray(res.pairs)
          pairList.forEach(item => {
            if (item.symbol === this.fabiSymbol) {
              this.fabiPrice = item
            }
          })
          this.pairPrice = pairList
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    getFormatNum(balance) {
      return balance && balance[this.target]
        ? DI.get("filters").getMaxDecimalNum(balance[this.target], 8)
        : 0
    },
    goDeposit() {
      if (!this.biTargetInfo["deposit_enabled"]) {
        Dialog.alert({
          message: `${this.target} 充值近期上线
当前状态不影响您的买卖、持有和增值`
        })
        return
      }
      this.$router.push({
        name: "deposit",
        query: {
          target: this.target
        }
      })
    },
    goWithdraw() {
      const isSetCardNumber = this.account.set_card_number
      const isSetPassword = this.account.set_fund_password
      if (!isSetCardNumber) {
        Dialog.confirm({
          message: "请先进行身份认证"
        })
          .then(() => {
            this.$router.push({ name: "realname" })
          })
          .catch(() => {})
        return
      }
      if (!isSetPassword) {
        Dialog.confirm({
          message: "请先设置资金密码"
        })
          .then(() => {
            this.$router.push({ name: "password" })
          })
          .catch(() => {})
        return
      }
      if (!this.biTargetInfo["withdraw_enabled"]) {
        Dialog.alert({
          message: `${this.target} 提币近期上线
当前状态不影响您的买卖、持有和增值`
        })
        return
      }
      this.$router.push({
        name: "withdraw",
        query: {
          target: this.target
        }
      })
    },
    getTransactions() {
      DI.get("orderHttp")
        .getTransactions(this.target, this.pageIndex)
        .then(res => {
          this.totalLen = res.total_length
          if (this.pageIndex === 1) {
            this.transactionList = res.items
          } else {
            this.transactionList = this.transactionList.concat(res.items)
          }
        })
        .catch(Message)
        .then(() => {
          if (this.transactionList.length === 0) {
            this.noRecord = true
          }
          Indicator.close()
        })
    },
    loadMore() {
      if (this.loading) return
      this.pageIndex += 1
      this.getTransactions()
    },
    goToTrade(target, fiat) {
      if (fiat === "FIAT") {
        DI.get("offlineStorage").set("USER_SELECT_TARGET", "BUY")
        DI.get("offlineStorage").set("USER_SELECT_BI", target)
        this.$router.push({
          name: "buy"
        })
      } else {
        this.$router.push({
          name: "chart",
          params: {
            symbol: target
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
@labelColor: rgba(34, 34, 34, 0.6);
@textColor: #222;
.my-asset {
  height: 100%;
  min-height: 95vh;
}
.bottom-line {
  border-bottom: 10px solid #f1f2f4;
}
.mod-title {
  color: @labelColor;
  font-size: 14px;
}
.top-asset {
  padding: 30px 0 20px;
  margin-bottom: 15px;
  .center {
    text-align: center;
  }
  .btc-img {
    width: 50px;
    margin: 0 auto;
  }
  .amount {
    font-size: 38px;
    color: @textColor;
    font-weight: bold;
    line-height: 44px;
    margin-top: 10px;
  }
  .amount-cny {
    font-size: 12px;
    color: @labelColor;
    padding-top: 3px;
  }
  .info {
    padding: 0 30px;
    font-size: 14px;
    padding-top: 10px;
    color: @labelColor;
  }
}
.trade-box {
  overflow: hidden;
  padding: 0 30px;
}
.go-trade {
  margin: 10px -3% 10px 0;
  display: flex;
  flex-wrap: wrap;

  .pair {
    width: 29%;
    margin-bottom: 10px;
    margin-right: 2%;
    padding: 12px 0 12px 2%;
    white-space: nowrap;
    background-color: #f1f2f4;
    border-radius: 2px;
    font-size: 10px;
    line-height: 10px;
    color: #9f9f9f;
    .price {
      margin-top: 8px;
      .price_num {
        color: #222222;
        font-weight: bold;
      }
      .rate {
        &.orange {
          color: #ff654c;
        }
        &.green {
          color: #36d58f;
        }
      }
    }
  }
}
.transaction {
  padding: 0 30px 80px;
}
.withdraw-area {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 20px;

  .center-btn {
    width: calc(100% - 60px);
    margin: 0 auto;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
  }
  .btns {
    width: 46%;
    img {
      display: inline-block;
      height: 20px;
      vertical-align: sub;
    }
  }
}
</style>
<style>
.van-toast-custom {
  width: 105px;
}
</style>
