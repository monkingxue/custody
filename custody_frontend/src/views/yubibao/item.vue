<template>
  <div class="list-item flex-all touch">
    <div class="flex-all">
      <img
        :src="getIconUrl(item.currency, item)"
        width="28"
      >
      <div class="mid">
        <div class="title din">
          <template v-if="item.projectType === 'H'">
            {{ item.coin_name }} 活期
          </template>
          <template v-if="item.projectType === 'D'">
            {{ item.coin_name }} {{ item.contract_days }}天
          </template>
        </div>
        <div class="sub">
          <template v-if="item.projectType === 'H'">
            <template v-if="item.displayType === 'my'">
              {{ item.base_interest_rate * 100 }}%年化收益
            </template>
            <template v-else>
              低风险 稳定收益 随存随取
            </template>
          </template>
          <template v-if="item.projectType === 'D'">
            <template v-if="item.displayType === 'my'">
              {{ item.base_interest_rate * 100 }}%年化收益 | {{ item.start_date }} 起息
            </template>
            <template v-else>
              低风险 高收益 整存整取
            </template>
          </template>
        </div>
      </div>
    </div>
    <div v-if="item.displayType === 'my'">
      <div class="amount1 din">
        {{ visible ? item.balance : '****' }}
      </div>
      <div class="amount2">
        {{ visible ? item.balance_cny : '****' }}元
      </div>
    </div>
    <div v-else>
      <div class="amount1 din">
        {{ Number(item.base_interest_rate * 100).toFixed(1) }}%
      </div>
      <div class="amount2">
        年化收益率
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"

export default {
  props: {
    visible: Boolean,
    item: Object
  },
  methods: {
    getIconUrl(name, setting) {
      return DI.get('utils')
        .getCoinIconUrlFromSetting(name, setting)
    }
  }
}
</script>
<style scoped lang="less">
.list-item {
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 5px 0 #eee;
  background: url('../../assets/images/yubibao/vip.png') #FFFFFF no-repeat;
  background-size: 50px;
  background-position: top right;
  .logo {
    width: 20px;
  }
  .mid {
    margin-left: 10px;
  }
  .title{
    font-size: 16px;
    color: #222222;
  }
  .sub{
    opacity: 0.3;
    font-size: 12px;
    color: #000000;
    margin-top: 2px;
  }
  .amount1{
    font-size: 16px;
    color: #222222;
    text-align: right;
  }
  .amount2{
    opacity: 0.3;
    font-size: 12px;
    color: #000000;
    text-align: right;
    margin-top: 2px;
  }
}
</style>
