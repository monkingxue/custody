<template>
  <div class="yubibao-intro">
    <div class="content">
      <div>
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            产品介绍
          </Title>
        </div>
        <div
          v-if="isHuoqi"
          class="block"
        >
          余币宝活期理财是 aBTC 推出的一款具备低风险、收益稳定、随存随取等特点的币币增值产品。平台力求在满足安全性、流通性需求的基础上实现更高的收益。
        </div>
        <div
          v-else
          class="block"
        >
          <p>
            余币宝定期理财是 aBTC 推出的一款具备低风险、高收益等特点的币币增值产品。平台力求在满足安全性、流通性需求的基础上实现更高的收益。
          </p>
          <p class="mt10">
            起投金额：100 USDT
          </p>
          <p>
            产品周期：{{ contractItem.contract_days }}天
          </p>
        </div>
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            计息说明
          </Title>
        </div>
        <template v-if="isHuoqi">
          <div class="block">
            <p>1. 基础年化收益率为 {{ yubibaoRate }}%，利率随市场行情波动</p>
            <p>2. 第 T 天存入，T + 1 天生息，T + 2 天凌晨收益到账</p>
            <p>3. 限额与利率加成：</p>
          </div>
          <table class="vip-table">
            <thead>
              <tr>
                <th>VIP等级</th>
                <th>活期理财额度</th>
                <th>利率加成</th>
              </tr>
            </thead>
            <tbody
              v-if="storeYubibaoSetting.length"
            >
              <tr
                v-for="(item) in [1,2,3,4,5]"
                :key="item"
              >
                <th>VIP {{ item }}</th>
                <td>
                  <div
                    v-for="(bi) in storeYubibaoSetting"
                    v-show="bi.coin_name === coin"
                    :key="bi.coin_name"
                  >
                    {{ `${bi.vip_settings[item - 1].share} ${bi.coin_name} ` }}
                  </div>
                </td>
                <td>
                  <div>{{ `${(yubibaoRate * storeYubibaoSetting[0].vip_settings[item - 1].extra_interest_rate).toFixed(2)}%` }}</div>
                  <div>{{ `(${yubibaoRate}% * ${(storeYubibaoSetting[0].vip_settings[item - 1].extra_interest_rate * 100).toFixed(0)}%)` }}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="title">
            <Title
              color="#222"
              block-color="#D6AF74"
            >
              产品亮点
            </Title>
          </div>
          <div class="block">
            <p>1. 每日生息，随存随取</p>
            <p>2. VIP 利息加成</p>
            <p>3. 百分百保本</p>
          </div>
        </template>
        <template v-else>
          <div class="block">
            <p>1. 基础年化收益率为 {{ (contractItem.base_interest_rate * 100).toFixed(2) }}%，利率随市场行情波动</p>
            <p>2. 第 T 天存入，T + 1 天生息，T + 2 天凌晨收益到账</p>
            <p v-if="contractItem.contract_days > 30">
              3. 赎回规则：到期归还全部本息。在计息日开始 30 天内提前赎回则无收益，30天后提前赎回则总收益按活期年化利率{{ yubibaoRate }}%计算
            </p>
            <p v-else>
              3. 赎回规则：到期归还全部本息，提前赎回则无收益
            </p>
            <p>4. VIP利率加成：</p>
          </div>
          <table
            v-if="storeYubibaoContract.vip_settings"
            class="vip-table"
          >
            <thead>
              <tr>
                <th>VIP等级</th>
                <th>利率加成</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item) in storeYubibaoContract.vip_settings"
                :key="item.vip_level"
              >
                <th>VIP {{ item.vip_level }}</th>
                <th>
                  <div>{{ `${(item.extra_interest_rate * contractItem.base_interest_rate * 100).toFixed(2)}%` }}</div>
                  <div>{{ `(${contractItem.base_interest_rate * 100}% * ${(item.extra_interest_rate).toFixed(2)}%)` }}</div>
                </th>
              </tr>
            </tbody>
          </table>
          <div class="title">
            <Title
              color="#222"
              block-color="#D6AF74"
            >
              产品亮点
            </Title>
          </div>
          <div class="block">
            <p>1. 大幅高于活期利率</p>
            <p>2. VIP 利息加成</p>
            <p>3. 百分百保本</p>
          </div>
        </template>
      </div>
    </div>
    <div class="entrance">
      <div class="main">
        <van-button
          :class="['img-btn-dark', 'mt20', 'brown-btn']"
          size="large"
          round
          @click="onBtnClick"
        >
          {{ `${isHuoqi ? '立即存入' : '立即申购'}` }}
        </van-button>
        <div
          v-if="isHuoqi"
          class="tip"
        >
          VIP {{ coinVipSetting.vip_level }} 可投 <span>{{ coinVipSetting.share }}</span> {{ coin }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import Title from "../vip/title"
import BalanceMixin from './balanceMixin'

export default {
  components: {
    Title
  },
  mixins: [BalanceMixin],
  data() {
    return {
      coin: '',
      yubibaoRate: '3.2',
      id: 0
    }
  },
  computed: {
    storeAccount() {
      return DI.get('auth').getUser()
    },
    coinSetting() {
      if (!this.storeYubibaoSetting.length || !this.coin) return {}
      return this.storeYubibaoSetting.find(_ => _.coin_name === this.coin)
    },
    coinVipSetting() {
      if (!this.storeAccount.credit_vip_level || !this.coinSetting.vip_settings) return []
      return this.coinSetting.vip_settings.find(_ => _.vip_level === this.storeAccount.credit_vip_level)
    },
    isHuoqi() {
      return !this.id
    },
    contractItem() {
      if (!this.storeYubibaoContract.contract_templates || !this.id) return {}
      return this.storeYubibaoContract.contract_templates.find(_ => Number(_.id) === Number(this.id)) || {}
    }
  },
  mounted() {
    const { query } = this.$route
    this.coin = query.coin || "BTC"
    this.fromRoute = query.fromRoute
    this.type = query.type || 'H'
    this.id = query.id
    DI.get("utils").setTitle(`${this.coin}${this.isHuoqi ? '活期' : '定期'}规则`)
  },
  methods: {
    onBtnClick() {
      if (this.fromRoute) {
        if (this.isHuoqi) {
          this.$router.go(-1)
        } else {
          this.onGoToOperationContract()
        }
      }
      if (this.isHuoqi) {
        this.$router.push({ name: 'yubibaoOperation', query: {
          coin: this.coin
        } })
      } else {
        this.onGoToOperationContract()
      }
    },
    onGoToOperationContract() {
      this.$router.push({ name: 'yubibaoOperationContract', query: {
        coin: this.coin,
        id: this.id
      } })
    }
  }
}
</script>
<style scoped lang="less">
.yubibao-intro {
  .content {
    padding: 10px 30px 100px;
    font-size: 12px;
    color: rgba(34, 34, 34, 0.6);
    .block {
      margin: 20px 0;
      line-height: 1.6;
    }
    .title {
      margin: 30px 0;
    }
  }
  .entrance {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #FFF;
    .main {
      padding: 10px 30px;
    }
    .tip {
      margin-top: 10px;
      text-align: center;
      font-size: 12px;
      color: #7A7A7A;
      span {
        color: #D6AF74
      }
    }
  }
}
</style>
