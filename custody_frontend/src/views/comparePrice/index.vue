<template>
  <div class="compare">
    <div class="upper">
      <p v-if="switchTarget === 'BUY'">
        实时获取全网购买价格，从低到高排序，每 3 秒自动刷新
      </p>
      <p v-else>
        实时获取全网卖出价格，从高到低排序，每 3 秒自动刷新
      </p>
      <ul>
        <li
          class="list-item commflex head"
        >
          <div class="flex">
            <span class="no">排名</span>
            <span class="name name-title">交易所</span>
          </div>
          <div class="flex">
            <span class="breathe">
              <i class="breathe-div" />
            </span>
            <span class="din cny">
              实时价格
            </span>
          </div>
        </li>
        <li
          v-for="(item, index) in otclist"
          :key="item[0]"
          class="list-item commflex"
          :class="{onebtc: item[0] === 'abtc'}"
          @click="() => {onGoToOTC(item[0])}"
        >
          <div class="flex">
            <span class="no no-number">{{ index + 1 }}</span>
            <img
              class="brand"
              :src="otcInfo[item[0]][1]"
            >
            <span class="name">{{ otcInfo[item[0]][0] }}</span>
          </div>
          <div class="flex">
            <span class="din cny">
              <span>¥</span>
              <ScrollNumber
                :number="getPrice(item[1])"
              />
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div
      v-if="!loading"
      class="why"
    >
      <img src="../../assets/images/compare-title.png">
      <p>1. aBTC 为您在火币、okex等严格挑选安全、靠谱、实惠的 OTC承兑商；</p>
      <p>2. 我们精挑的承兑商都具备大于一年的承兑经验，且资金安全有绝对保证；让用户您可以放心交易，无银行卡冻结风险</p>
      <p>3. aBTC 采用企业级的多签冷钱包存储用户资产，且全额担保您的资产安全</p>
      <p>4. 极速处理交易，到账只需 1 分钟</p>
      <!-- <p>5. 7*24 小时微信客服，悉心服务每一名用户</p> -->
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Indicator, ScrollNumber } from 'components'

export default {
  components: {
    ScrollNumber
  },
  data() {
    return {
      target: '',
      switchTarget: '',
      otclist: [],
      otcHttplist: [],
      loading: true,
      otcInfo: {
        'coincola': ['CoinCola'
          , require('../../assets/images/exchange/exchange_CoinCola.png')
        ],
        'okex': ['OKEX'
          , require('../../assets/images/exchange/exchange_okex.png')
        ],
        'huobi': ['火币'
          , require('../../assets/images/exchange/exchange_huobi.png')
        ],
        'abtc': ['aBTC'
          , require('../../assets/images/exchange/exchange_abtc.png')
        ],
        'gateio': ['Gate.io'
          , require('../../assets/images/exchange/exchange_gate.png')
        ],
        'otcbtc': ['OTCBTC'
          , require('../../assets/images/exchange/exchange_OTC.png')
        ],
        'zb': ['ZB'
          , require('../../assets/images/exchange/exchange_ZB.png')
        ]
      }
    }
  },
  computed: {
    marketInfo() {
      return DI.get('store').state.market.market[this.target] || {}
    }
  },
  watch: {
    marketInfo() {
      if (this.otcHttplist.length === 0) return
      this.updateOtcList()
    },
    otcHttplist() {
      this.updateOtcList()
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.marketTimmerId)
    next()
  },
  mounted() {
    const { query } = this.$route
    this.target = query.target || "BTC"
    this.switchTarget = query.switchTarget || "BUY"
    DI.get("utils").setTitle(`${this.target}价格对比`)
    this.getPriceList()
    Indicator.open('加载中')
    this.marketTimmerId = setInterval(() => {
      DI.get('store').dispatch('SYNC_MARKET')
    }, 1000 * 3)
  },
  methods: {
    updateOtcList() {
      const marketPrice = this.marketInfo[this.switchTarget === 'BUY' ? 'buy_price' : 'sell_price']
      if (marketPrice && marketPrice > 1) {
        this.updateOtcListOrder(marketPrice)
        return
      }
      this.updateOtcListOrder()
    },
    updateOtcListOrder(globalPrice) {
      const otcArr = []
      this.otcHttplist.forEach((o) => {
        const otc = o
        if (otc[0] === 'abtc' && globalPrice) {
          otc[1] = globalPrice
        }
        otcArr.push(otc)
      })
      otcArr.sort((a, b) => {
        if ((a[1] === b[1]) && a[0] === 'abtc') return -1
        if (a[1] < b[1]) return -1
        return 1
      })
      if (this.switchTarget !== 'BUY') {
        otcArr.reverse()
      }
      this.otclist = otcArr
    },
    getPrice(price) {
      return DI.get('filters').toFixed(price, 2)
    },
    onGoToOTC() {
      // 暂时决定不跳转了
      return
    },
    getPriceList() {
      DI.get('marketHttp')
        .getOtcPrices(this.target.toLowerCase(), this.switchTarget.toLowerCase())
        .then((res) => {
          this.otcHttplist = res
        })
        .catch(() => {})
        .then(() => {
          this.loading = false
          setTimeout(() => {
            // 确保 loading 提示消失时候 列表已经渲染
            Indicator.close()
          }, 100)
          if (this.$route.name !== 'comparePrice') return
          setTimeout(() => {
            this.getPriceList()
          }, 3 * 1000)
        })
    }
  }
}
</script>
<style scoped lang="less">
.compare {
  background: #F1F2F4;
  .upper p {
    background: #F1F2F4;
    font-size: 12px;
    color: #999;
    padding: 10px 0;
    text-align: center;
  }
  .onebtc {
    color: #222!important;
  }
  .upper {
    background: white;
  }
  .list-item.head {
    .name{
      font-weight: 100;
    }
    .name-title {
      margin-left: 20px;
    }
  }
  .list-item {
    font-size: 14px;
    color: #999;
    align-items: center;
    padding: 15px 0;
    margin: 0 25px;
    border-bottom: 1px solid #eee;
    &:last-child {
      border: none;
    }
    .no {
      line-height: 30px;
      margin-right: 20px;
      width: 40px;
    }
    .no-number {
      margin-left: 10px;
      margin-right: 10px;
    }
    .brand {
      height: 30px;
      padding-right: 10px;
    }
    .name {
      line-height: 30px;
      font-weight: bold;
    }
    .bi-img {
      width: 18px;
      height: 18px;
    }
    .cny {
      padding-left: 10px;
      line-height: 18px;
      span {
        display: inline-flex;
      }
    }
  }
  .why {
    margin-top: 10px;
    background: white;
    padding: 25px;
    img {
      width: 50%;
      display: block;
      margin: 0 auto 15px;
    }
    p {
      font-size: 14px;
      color: #666;
      padding: 5px 0;
    }
  }
}
</style>
