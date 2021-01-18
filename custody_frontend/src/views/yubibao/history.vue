<template>
  <div class="yubibao-history">
    <div class="flex-all">
      <div class="top">
        <div class="total">
          投资金额（{{ currency }}）
        </div>
        <div class="din total-amount">
          {{ coinBalance.balance }}
        </div>
        <div class="sub">
          ≈ {{ coinBalance.balance_cny }} 元
        </div>
      </div>
      <div class="top">
        <div class="total">
          累计收益（{{ currency }}）
        </div>
        <div class="din total-amount">
          {{ coinBalance.interest }}
        </div>
        <div class="sub">
          ≈ {{ coinBalance.interest_cny }} 元
        </div>
      </div>
    </div>
    <div class="main">
      <div class="sub-title">
        投资明细
      </div>
      <ul>
        <li
          v-for="(item, index) in recordData"
          :key="index"
        >
          <div class="flex-all top">
            <div>{{ getLabel(item) }}</div>
            <div>{{ getSymbol(item) }} {{ item.amount }} {{ item.currency }}</div>
          </div>
          <div class="flex-all bottom">
            <div>{{ item.time_str }}</div>
            <div>{{ item.amount_cny }} 元</div>
          </div>
        </li>
        <LoadMore
          v-if="recordData.length < totalCount"
          v-element-in-view="loadMore"
        />
      </ul>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Message, LoadMore, Indicator } from "components"
import BalanceMixin from './balanceMixin'

export default {
  components: {
    LoadMore
  },
  mixins: [BalanceMixin],
  data() {
    return {
      currency: '',
      contractId: 0,
      page: 1,
      recordData: [],
      totalCount: 0
    }
  },
  computed: {
    coinBalance() {
      if (this.contractId) {
        if (!this.currency || !this.storeYubibaoBalance.contract) return {}
        return this.storeYubibaoBalance.contract.find(_ => _.contract_id == this.contractId)
      }
      if (!this.currency || !this.storeYubibaoBalance.current) return {}
      return this.storeYubibaoBalance.current.find(_ => _.currency === this.currency)
    }
  },
  mounted() {
    const { query } = this.$route
    this.currency = query.currency
    this.contractId = query.contractId
    if (this.contractId) {
      DI.get("utils").setTitle('收益明细')
    } else {
      DI.get("utils").setTitle(`${this.currency}收益`)
    }
    this.fetchRecord()
  },
  methods: {
    getLabel(item) {
      if (item.type === 'interest_record') return '收益'
      if (item.side === 'in') return '转入余币宝'
      return '转出余币宝'
    },
    getSymbol(item) {
      if (item.side === 'out') return '-'
      return '+'
    },
    loadMore() {
      this.page += 1
      this.fetchRecord()
    },
    fetchRecord() {
      if (this.recordData.length === 0) {
        Indicator.open(this.$t("loading"))
      }
      let promise
      if (this.contractId) {
        promise = DI.get('yubibaoHttp')
          .getContractRecords(this.contractId, this.page)
      } else {
        promise = DI.get('yubibaoHttp')
          .getRecords(this.currency, this.page)
      }
      promise
        .then((res) => {
          this.recordData = this.recordData.concat(res.items)
          this.totalCount = res.total
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
.yubibao-history {
  .top{
    padding: 20px 20px 0;
    flex: 1;
    .total {
      font-size: 12px;
      color: #222222;
      font-weight: bold;
      opacity: 0.33;
    }
    .total-amount {
      padding: 5px 0;
      font-size: 28px;
      color: #333;
    }
    .sub {
      opacity: 0.6;
      font-size: 12px;
      color: #222222;
      padding-bottom: 30px;
    }
  }
  .main {
    padding: 0 20px;
    border-top: 5px solid #eee;
    .sub-title {
      padding: 20px 0 5px;
      opacity: 0.6;
      font-size: 14px;
      color: #222222;
    }
    ul {
      li {
        border-bottom: 1px solid #eee;
        .top {
          padding: 10px 0;
          font-size: 14px;
          color: #222222;
        }
        .bottom {
          padding: 0 0 10px;
          opacity: 0.6;
          font-size: 12px;
          color: #222222;
        }
      }
    }
  }
}
</style>
