<template>
  <div class="fee-content">
    <div class="fee-title">
      当前手续费: {{ serviceFee }}
      <span
        v-if="account.credit_vip_level && account.credit_vip_level >= 0"
        class="commend"
        @click="onGoToVIP"
      >
        VIP{{ account.credit_vip_level }}
      </span>
    </div>
    <p>
      在 aBTC，能通过提升 VIP
      等级，以最优惠的手续费买卖各大交易所的币种，且不再承担其它交易所的手续费。（VIP5
      手续费低至 0.075%）
    </p>

    <table
      v-if="otcLists.length"
      class="fee-table"
    >
      <tr>
        <th>交易所</th>
        <th>交易费率</th>
      </tr>
      <tr
        v-for="otc in otcFee"
        :key="otc.name"
      >
        <td
          v-if="otcLists.indexOf(otc.name) >= 0"
          width="50%"
        >
          <div class="otc">
            <img
              v-if="otcInfo[otc.name]['icon']"
              :src="otcInfo[otc.name]['icon']"
              width="13"
            >
            {{ otcInfo[otc.name]['name'] }}
          </div>
        </td>
        <td
          v-if="otcLists.indexOf(otc.name) >= 0"
        >
          {{ otc.name === 'abtc' ? serviceFee : otc.fee }}
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { DI } from "core"

export default {
  data() {
    return {
      symbol: "",
      otcFee: [
        { name: "abtc", fee: "" },
        { name: "binance", fee: "0.1%" },
        { name: "biki", fee: "0.15%" },
        { name: "okex", fee: "0.15%" },
        { name: "huobi", fee: "0.2%" },
        { name: "bitfinex", fee: "0.2%" },
        { name: "gateio", fee: "0.2%" },
        { name: "mxc", fee: "0.2%" }
      ]
    }
  },
  computed: {
    otcInfo() {
      return DI.get('OTC_INFO')
    },
    setting() {
      return DI.get("store").state.setting.setting
    },
    storePairItem() {
      return DI.get("store").state.pair.pairItem
    },
    account() {
      return DI.get("auth").getUser()
    },
    serviceFee() {
      const discount = this.setting[
        `vip_bibi_offer.level_${this.account.credit_vip_level}`
      ]
      if (!this.storePairItem) {
        return
      }
      if (this.storePairItem.exchange === 'mxc') {
        if (!discount || this.account.vip_level === 0) {
          return "0.2%"
        }
      }
      if (!discount) return "0.15%"
      return (this.storePairItem.trade_fee || this.storePairItem.exchange_trade_fee)
        ? `${Number((((this.storePairItem.trade_fee * discount) / 100 + this.storePairItem.exchange_trade_fee) * 100).toFixed(3))}%`
        : ""
    },
    storeMarketInfo() {
      return DI.get("store").state.pairV2.marketInfo
    },
    otcLists() {
      const lists = ["abtc"]
      if (this.storeMarketInfo && this.storeMarketInfo.length) {
        this.storeMarketInfo.forEach(marketInfo => {
          lists.push(marketInfo.exchange)
        })
        return lists
      }
      return lists
    }
  },
  mounted() {
    const { params } = this.$route
    this.symbol = params.symbol
    DI.get('store').dispatch('SYNC_MARKET_INFO', { symbol: this.symbol })
  },
  methods: {
    onGoToVIP() {
      this.$router.push({
        name: "vip"
      })
    }
  }
}
</script>

<style scoped lang="less">
.fee-content {
  font-size: 12px;
  color: rgba(34, 34, 34, 0.6);
  padding: 20px 0;
  .commend {
    font-size: 14px;
    font-weight: bold;
    background: #fef4e8;
    padding: 1px 5px;
    border-radius: 4px;
    color: #f7931a;
  }
  .fee-title {
    color: #222;
  }
  p {
    line-height: 24px;
    margin: 20px 0;
  }
  .fee-table {
    border: 1px solid #eee;
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      height: 48px;
      border: 1px solid #eee;
    }
    th {
      background-color: #fafafa;
    }
    td {
      &:first-child {
        padding-left: 14%;
      }
      &:last-child {
        padding-left: 20%;
      }
    }
    .otc {
      display: flex;
      align-items: center;
      img {
        margin-right: 5px;
      }
    }
  }
}
</style>
