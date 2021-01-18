<template>
  <div class="market-price">
    <ListLoading
      v-if="storeMarketInfo && storeMarketInfo.length === 0"
      :margin="0"
    />
    <ul
      v-else
      class="market-price-list"
    >
      <div
        v-if="!storeMarketInfo"
        class="no-record"
      >
        <img
          src="../../assets/images/empty.svg"
          width="60"
        >
        <span>{{ $t('noRecords') }}</span>
      </div>
      <div v-else>
        <div class="top-tip">
          <span class="breathe">
            <i class="breathe-div" />
          </span>
          <span class="tip-text">每5秒更新各交易所最新成交价格</span>
        </div>
        <li
          v-for="(item, index) in storeMarketInfo"
          :key="item.exchange"
          v-element-in-view="() => showTip(index)"
          class="list"
        >
          <div class="otc">
            <img :src="otcInfo[item.exchange].icon">
            <div class="otc-name">
              <div class="din upper">
                {{ otcInfo[item.exchange].name }}
              </div>
              <div class="down">
                {{ otcInfo[item.exchange].nameCN }}
              </div>
            </div>
          </div>
          <div class="price">
            <div class="din upper">
              <span>{{ item.last }}</span><span class="usdt">{{ quote }}</span>
            </div>
            <div class="down">
              ≈￥{{ getCNYPrice(item.last) | toFixed(2) }}
            </div>
          </div>
        </li>
        <div
          v-if="showTipPad"
          class="tip-pad"
        />
      </div>
    </ul>
  </div>
</template>

<script>
import { DI } from 'core'
import ListLoading from '../pair/item-list-loading'

const LIMIT = 200

export default {
  components: {
    ListLoading
  },
  data() {
    return {
      otcInfo: DI.get('OTC_INFO'),
      base: '',
      quote: '',
      showTipPad: false
    }
  },
  computed: {
    storeMarketInfo() {
      return DI.get("store").state.pairV2.marketInfo
    },
    storeMarket() {
      return DI.get('store').state.market.market
    }
  },
  mounted() {
    const { params } = this.$route
    const { symbol } = params
    this.symbol = symbol
    this.quote = this.symbol.split('_')[1]
    this.start()
  },
  beforeDestroy() {
    DI.get('store').dispatch('CLEAR_MARKET_INFO')
    clearInterval(this.intervalId)
  },
  methods: {
    start() {
      if (this.init) return
      this.fetchData()
      this.startInterval()
      DI.get("store").dispatch("SYNC_DEPTH", {
        symbol: this.symbol,
        limit: LIMIT
      })
      this.init = true
    },
    showTip(index) {
      const total = this.storeMarketInfo.length
      if ((index + 1) / total > 0.7) {
        this.$emit('show-tip')
        this.showTipPad = true
      }
    },
    fetchData() {
      DI.get('store').dispatch('SYNC_MARKET_INFO',
        { symbol: this.symbol })
    },
    startInterval() {
      this.intervalId = setInterval(() => {
        this.fetchData()
      }, 5 * 1000)
    },
    getCNYPrice(usd) {
      if (!this.quote || !this.storeMarket || !this.storeMarket[this.quote]) return 0
      return usd * this.storeMarket[this.quote].buy_price
    }
  }
}
</script>
<style lang="less" scoped>
.market-price {
  margin-bottom: -15px;

  .top-tip {
    display: flex;
    height: 40px;
    margin: 0 -30px;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    .tip-text {
      color: #222222;
      opacity: .3;
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #EEE;
    &:last-child {
      border-bottom: none;
    }
    .otc {
      display: flex;
      align-items: center;
      flex: 1;
      img {
        width: 28px;
        height: 28px;
        margin-right: 10px;
      }
    }
    .otc-name {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .upper {
      font-size: 16px;
      color: #222222;
      font-weight: bold;
      .usdt {
        margin-left: 3px;
      }
    }
    .down {
      opacity: 0.3;
      font-size: 12px;
      color: #000000;
    }
    .price {
      flex: 1;
      text-align: right;
    }
  }
  .tip-pad {
    height: 40px;
  }
}
.no-record {
  width: 100%;
  margin: 30px 0;
  img {
    display: block;
    margin: 0 auto;
  }
  span {
    display: block;
    padding: 20px 0;
    color: #999;
    text-align: center;
  }
}
</style>
