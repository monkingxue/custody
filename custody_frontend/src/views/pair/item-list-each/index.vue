<template>
  <div
    :class="['pair-item-wrap touch', source === 'RANKING' && 'ranking-item-wrap']"
    :data-symbol="info.symbol"
    @click="onItemClick"
  >
    <div
      class="pair-item"
      :class="[!isLast && 'pair-item-bottom-line']"
    >
      <div class="pair-item-left">
        <div
          v-if="showIndex"
          class="pair-index din"
        >
          {{ showIndex }}
        </div>
        <div
          v-if="getIconUrl(info.symbol)"
          class="pair-icon"
        >
          <img
            :src="getIconUrl(info.symbol)"
            width="28"
          >
        </div>
        <div class="pair-name">
          <div>
            <b class="base">{{ info.symbol }}</b>
            <span
              v-if="info.quote"
              class="quote"
            > / {{ info.quote }} </span>
          </div>
          <div :class="['cn', isStock && 'text-ellipsis']">
            {{ isStock ? info.name : getCNName(info.symbol) }}
          </div>
        </div>
      </div>
      <div
        v-if="type === 'favorite'"
        class="favorite"
        @click.stop="onFavoriteChange"
      >
        <img
          v-if="favoriteDisplay"
          src="../../../assets/images/pair/icon-faved.png"
        >
        <img
          v-else
          src="../../../assets/images/pair/icon-fav.png"
        >
      </div>
      <div
        v-else-if="type !== 'pair' && type !== 'exchange'"
        class="pair-item-right"
      >
        <div class="price">
          <b class="din">
            {{ isStock ? info.price : info.price_usd }}
          </b>
          <span class="fiat">
            &yen;{{ info.price_cny }}
          </span>
        </div>
        <div
          v-if="source === 'RANKING' && itemLastFiled"
          class="ml10 din marketVal"
        >
          {{ shorthandMoney(info[itemLastFiled]) }}
        </div>
        <div
          v-else
          class="ml10"
        >
          <div
            :class="[
              'din',
              lowest ? 'change' : 'change-btn',
              +info.percent_change_24h < 0 ? 'orange' : 'green'
            ]"
          >
            {{ displayPercent }}
          </div>
          <div
            v-if="lowest"
            class="lowest"
          >
            实时最低价：{{ getExchangeCNName(info.lowest_price_exchange) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import { Toast } from "vant"
import { DI } from 'core'
import { Message } from 'components'
import SearchHistory from '../search/searchHistory'

export default {
  mixins: [SearchHistory],
  props: {
    info: Object,
    type: String,
    isLast: Boolean,
    lowest: Boolean,
    source: String,
    showIndex: Number,
    itemLastFiled: String
  },
  data() {
    return {
      favoriteDisplay: false
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    isStock() {
      return this.source === 'STOCK'
    },
    displayPercent() {
      let pre = ''
      if (this.info.percent_change_24h >= 0) {
        pre = '+'
      }
      if (this.isStock) {
        // one day, after bibi percentage change data is unified into a percentage format, then remove it
        return `${pre}${(+this.info.percent_change_24h).toFixed(2)}%`
      }
      return `${pre}${(this.info.percent_change_24h * 100).toFixed(2)}%`
    }
  },
  mounted() {
    if (this.type === 'favorite') {
      this.favoriteDisplay = this.info.isFavorite
    }
  },
  methods: {
    shorthandMoney(money) {
      return DI.get("filters").shorthandMoney(money)
    },
    onFavoriteChange() {
      if (this.favoriteDisplay) {
        DI.get('assetHttp').deleteFavoritePair({
          asset: this.info.symbol
        }).then(() => {
          Toast("取消收藏")
        }).catch(Message)
      } else {
        DI.get('assetHttp').updateFavoritePair({
          asset: this.info.symbol
        }).then(() => {
          Toast("收藏成功")
        }).catch(Message)
      }
      this.favoriteDisplay = !this.favoriteDisplay
    },
    onItemClick() {
      let jumpMethod = 'push'
      let routeName = 'chart'
      if (this.type === 'favorite' || this.type === 'pair') {
        jumpMethod = 'replace'
      }
      let symbol = `${this.info.symbol}_USDT`
      if (this.type === 'pair' || this.type === 'exchange') {
        symbol = `${this.info.symbol}_${this.info.quote}`
      }
      if (this.info.pairs && this.info.pairs[0]) {
        symbol = this.info.pairs[0]
      }
      const pairPriceInfo = {
        last: this.info.price_usd
      }
      if (this.type === 'exchange') {
        routeName = 'exchange'
      }
      // add history
      if (this.$route.name === 'search') {
        this.addLocalHistory(symbol, this.type === 'favorite' ? 'ICON' : 'PAIR')
      }
      if (this.isStock) {
        routeName = 'stockDetail'
      }
      this.$router[jumpMethod]({
        name: routeName,
        params: {
          symbol,
          pairPriceInfo
        }
      })
    },
    getIconUrl(target) {
      if (this.isStock) {
        return DI.get("STOCK_CO_INFO")[target]
          ? DI.get("STOCK_CO_INFO")[target]
          : ""
      }
      return this.biInfo && this.biInfo[target] && !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get('BI_LOCAL_ICON')[target]
    },
    getCNName(target) {
      return this.biInfo && this.biInfo[target] && this.biInfo[target]["cn_name"]
    },
    getExchangeCNName(target) {
      return DI.get('OTC_INFO')[target]["nameCN"]
    }
  }
}
</script>
<style lang="less" scoped>
.pair-item-wrap {
  cursor: pointer;
  padding: 0 30px;
  background: #FFF;
}
.ranking-item-wrap {
  padding: 0 20px;
}
.pair-item-bottom-line {
  border-bottom: 1px solid #eee;
}
.pair-item {
  height: 66px;
  display: flex;
  justify-content: space-between;

  b {
    font-weight: 600;
  }

  .pair-item-left,
  .pair-item-right {
    display: flex;
    align-items: center;
    flex: 1 1;
  }
  .pair-item-left {
    flex-grow: 0.8;
  }
  .pair-item-right {
    justify-content: flex-end;
  }

  .pair-index {
    font-size: 16px;
    font-weight: bold;
    width: 20%;
  }

  .pair-icon {
    width: 28px;
    height: 28px;
    overflow: hidden;
    margin-right: 10px;
  }

  .pair-name {
    .base {
      font-size: 16px;
      color: #222;
    }
    .quote {
      font-size: 12px;
      color: rgba(34, 34, 34, 0.6);
    }
    .cn {
      opacity: 0.3;
      font-size: 10px;
      color: #000000;
    }
    .text-ellipsis {
      white-space: nowrap;
      max-width: calc(52vw - 68px);
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .price {
    text-align: right;
    height: 30px;
    b {
      display: block;
      color: #222;
      font-size: 16px;
      line-height: 16px;
    }
    .fiat {
      color: rgba(34, 34, 34, 0.6);
      font-size: 12px;
      line-height: 12px;
    }
  }

  .change-btn {
    font-size: 14px;
    width: 70px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    border-radius: 2px;
    &.orange {
      background-color: #ff654c;
    }
    &.green {
      background-color: #36d58f;
    }
  }

  .change {
    font-size: 16px;
    text-align: right;
    color: #222;

    &.orange {
      color: #ff654c;
    }
    &.green {
      color: #36d58f;
    }
  }

  .lowest {
    font-size: 10px;
    color: #222;
    opacity: 0.6;
    text-align: right;
    min-width: 110px;
  }

  .marketVal {
    font-weight: bold;
    min-width: 90px;
    text-align: right;
  }

  .favorite {
    display: flex;
    align-items: center;
    img {
      width: 28px;
    }
  }
}
</style>
