<template>
  <div
    class="agreement"
  >
    <p>aBTC.one承诺会以市面上最优价格为您购入/卖出数字货币。我们会对比火币、OKEX、GATE.io等法币市场的价格，实时选择最低价格为您兑换。</p>
    <p>因数字货币价格会在极短时间内波动，以及用户从下单到确认付款的过程需要时间，所以币款到账数量会与下单时数量略有差异（偏高或者偏低），最终币款交割价格以实际到账数目为准。</p>
  </div>
</template>

<script>
import { DI } from 'core'
export default {
  mounted() {
    DI.get('utils').setTitle(this.$t('legalActuallPrice'))
  }
}
</script>

<style scoped>
.agreement{
  background: #FFF;
  min-height: 95vh;
  padding: 10px;
  font-size: 14px;
}
.agreement p {
  padding: 10px 5px;
}
</style>
