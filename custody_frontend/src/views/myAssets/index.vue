<template>
  <div class="myAssets">
    <div class="total">
      <div class="title">
        {{ $t('wallet.estimatedBalance') }}（BTC）
      </div>
      <div
        class="amount"
        style="font-family: helvetica;"
      >
        <div class="btc">
          {{ account.btc_total }}
        </div>
        <div class="rmb">
          ≈ {{ account.cny_total }} 元
        </div>
      </div>
    </div>
    <div class="list">
      <ul>
        <li
          v-for="(item) in BISort"
          :key="item"
          class="bi-item touch"
          @click="() => goToAsset(item)"
        >
          <div class="item-left">
            <img
              v-if="biInfo[item]"
              :src="biInfo[item]['icon_url']"
            >
            <div class="info title">
              <span>{{ item }}</span>
              <!-- <span>持仓盈亏：-18.7元</span> -->
            </div>
          </div>
          <div class="info amount">
            <span>{{ account.balance[item] | toFixed(4) }}</span>
            <span>{{ account.cny_balance && account.cny_balance[item] }} 元</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// TODO: Deprecated #20190813
import { DI } from 'core'

export default {
  data() {
    return {}
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    account() {
      return DI.get('auth').getUser()
    },
    cnyBalance(){
      return DI.get('auth').getUser().cny_balance
    },
    BISort(){
      return this.cnyBalance
        ? Object.keys(this.cnyBalance).sort(
          (a, b) => this.cnyBalance[b] - this.cnyBalance[a]
        )
        : []
    }
  },
  mounted() {
    DI.get('utils').setTitle('我的钱包')
    DI.get('utils').setBackAction(() => {this.$router.push('account')})
  },
  methods: {
    goToAsset(target) {
      this.$router.push({
        name: 'asset',
        query: {
          target: target
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.myAssets {
  background-image: linear-gradient(0deg, #5762FF 6%, #3F46B4 82%);
  min-height: 100vh;
  .total {
    color: #FFF;
    padding: 20px 20px 20px;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .amount {
      display: flex;
      margin-top: 8px;
      align-items: baseline;
      font-size: 14px;
      .btc {
        font-size: 40px;
        font-weight: bold;
        margin-right: 5px;
      }
    }
  }
  .list {
    padding: 0 20px 15px;
    .bi-item {
      background: #FFF;
      border-radius: 10px;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      .item-left {
        align-items: center;
        display: flex;
      }
      img {
        width: 40px;
        height: 40px;
      }
      .info{
        span {
          display: block;
        }
        :first-child{
          padding: 2px 0;
          font-size: 18px;
          font-weight: bold;
        }
        :last-child{
          font-size: 14px;
          padding: 2px 0;
        }
      }
      .title{
        margin-left: 20px;
        span {
          font-size: 20px!important;
        }
      }
      .amount{
        text-align: right;
      }
    }
  }
}
</style>
