<template>
  <div class="vip-detail">
    <div class="top-block flex-left-right">
      <div class="left">
        <div class="title">
          {{ detailObj.title }}
        </div>
        <div class="available">
          VIP{{ ['fee', 'interest'].indexOf(name) > -1 ? '1' : '2' }} 以上用户可享
        </div>
      </div>
      <div class="right">
        <img :src="detailObj.icon">
      </div>
    </div>
    <div class="content">
      <div v-if="name === 'fee'">
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            特权说明
          </Title>
        </div>
        <table class="vip-table">
          <thead>
            <tr>
              <th>等级</th>
              <th>手续费</th>
            </tr>
          </thead>
          <tbody v-if="setting.base_interest">
            <tr
              v-for="(item, index) in [1,2,3,4,5,6]"
              :key="item"
            >
              <th>VIP {{ index }}</th>
              <td>{{ serviceFee(index) }}%</td>
            </tr>
          </tbody>
        </table>
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            交易所基础手续费
          </Title>
        </div>
        <table class="vip-table">
          <thead>
            <tr>
              <th>交易所</th>
              <th>手续费</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>HUOBI</th>
              <td>0.2%</td>
            </tr>
            <tr>
              <th>BITFINEX</th>
              <td>0.2%</td>
            </tr>
            <tr>
              <th>Gate io</th>
              <td>0.2%</td>
            </tr>
            <tr>
              <th>Coinbase</th>
              <td>0.3%</td>
            </tr>
            <tr>
              <th>POLONIEX</th>
              <td>0.2%</td>
            </tr>
            <tr>
              <th>OKEX</th>
              <td>0.15%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="name === 'air'">
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            特权说明
          </Title>
        </div>
        <div class="block">
          成为 VIP 2 以上并在空投前 10 日内无掉级记录，将会享受 aBTC 平台的不定期空投奖励，每次空投奖励将会以下图比例平均分配给对应等级的 VIP 用户。
        </div>
        <div class="block">
          举例说明：如果空投 1,000,000 枚 TRX，VIP 3 有 500 位用户，那么每位用户可得到 400（1000000 * 20% / 500） 枚 TRX。
        </div>
        <table class="vip-table">
          <thead>
            <tr>
              <th>等级</th>
              <th>空投比例</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item) in [2,3,4,5]"
              :key="item"
            >
              <th>VIP {{ item }}</th>
              <td>{{ air[item] }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="name === 'gift'">
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            特权说明
          </Title>
        </div>
        <div class="block">
          每位成为 VIP 2 的用户，将会得到 aBTC 平台特别定制的精美比特币纪念章一枚，每位用户仅可以获得一次。
        </div>
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            兑换说明
          </Title>
        </div>
        <div class="block">
          若您已经达到 VIP 2，请联系客服微信: onebtc520。
        </div>
      </div>
      <div v-if="name === 'interest'">
        <div class="title">
          <Title
            color="#222"
            block-color="#D6AF74"
          >
            特权说明
          </Title>
        </div>
        <div class="special flex-left-right">
          <div>
            <p>成为 VIP 1 ，享有「余币宝」使用权限</p>
          </div>
          <span
            class="ybcBtn"
            @click="onGoToYubiBao"
          >
            余币宝 >
          </span>
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
                  :key="bi.coin_name"
                >
                  {{ `${bi.vip_settings[item - 1].share} ${bi.coin_name}` }}
                </div>
              </td>
              <td>
                <div>{{ `${(yubibaoRate * storeYubibaoSetting[0].vip_settings[item - 1].extra_interest_rate).toFixed(2)}%` }}</div>
                <div>{{ `(${yubibaoRate}% * ${(storeYubibaoSetting[0].vip_settings[item - 1].extra_interest_rate * 100).toFixed(0)}%)` }}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="block">
          举例说明：若 VIP 1 的年化利率是 3.2%，那么 VIP 5 的年化利率就是 3.2% * 130% = 4.16%
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import Title from "./title"

const detailObj = {
  'fee': {
    title: '手续费折扣',
    icon: require('../../assets/images/vip/fee-1.png')
  },
  'interest': {
    title: '存币生息',
    icon: require('../../assets/images/vip/interest-1.png')
  },
  'air': {
    title: '空投奖励',
    icon: require('../../assets/images/vip/air-1.png')
  },
  'gift': {
    title: '礼品赠送',
    icon: require('../../assets/images/vip/gift-1.png')
  }
}
export default {
  components: {
    Title
  },
  data() {
    return {
      name: '',
      ybbLimit: DI.get('VIP_YUBIBAO_LIMIT'),
      ybbAdd: DI.get('VIP_YUBIBAO_ADD_INTEREST'),
      air: DI.get('VIP_AIR'),
      yubibaoRate: '3.2'
    }
  },
  computed: {
    storePairBasic() {
      return DI.get("store").state.pair.pairBasic
    },
    pairInfo() {
      return this.storePairBasic['BTC_USDT'] || {}
    },
    setting() {
      return DI.get("store").state.setting.setting
    },
    detailObj() {
      return detailObj[this.name] || {}
    },
    storeYubibaoSetting() {
      return DI.get("store").state.yubibao.setting
    }
  },
  mounted() {
    DI.get("utils").setTitle("权益详情")
    const { query } = this.$route
    this.name = query.name || "fee"
    if (this.name === 'interest') {
      DI.get('store').dispatch('SYNC_YUBIBAO_SETTING')
    }
  },
  methods: {
    serviceFee(level) {
      const discount = this.setting[`vip_bibi_offer.level_${level}`]
      if (!discount) return "-"
      return +(
        ((this.pairInfo.trade_fee * discount) / 100 +
          this.pairInfo.exchange_trade_fee) *
        100
      ).toFixed(3)
    },
    onGoToYubiBao() {
      // Dialog.alert({
      //   message: '即将上线'
      // })
      this.$router.push({ name: 'yubibao' })
    }
  }
}
</script>
<style scoped lang="less">
.vip-detail {
  .top-block {
    padding: 30px 30px;
    color: #FFF;
    background: url('../../assets/images/vip/detail-bg.png') #39384D no-repeat;
    background-size:100%;
    background-position: bottom;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .available {
      margin-top: 20px;
      font-size: 14px;
    }
    .right {
      img {
        width: 60px;
        padding-bottom: 50px;
      }
    }
  }
  .content {
    padding: 10px 30px 20px;
    font-size: 12px;
    color: rgba(34, 34, 34, 0.6);
    .block {
      margin: 20px 0;
      line-height: 1.6;
    }
    .title {
      margin: 30px 0;
    }
    .special {
      font-size: 12px;
      background: rgba(214,175,116,0.10);
      border: 1px solid rgba(214,175,116,0.12);
      text-align: center;
      padding: 7px 10px;
      align-items: center;
      margin-bottom: 25px;
      p {
        padding: 0;
        color: #D6AF74;
      }
      .ybcBtn {
        background: #D6AF74;
        padding: 5px;
        color: #FFF;
      }
    }
  }
}
</style>
