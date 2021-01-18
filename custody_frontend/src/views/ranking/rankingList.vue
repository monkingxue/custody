<template>
  <div class="ranking-list-wrap">
    <!-- hot search tab -->
    <div
      v-if="type === 'hotSearch' && hotSearchSources.length"
      :class="['ranking-tab-box', hotSearchSources.length > 3 && 'flex-left-right']"
    >
      <scrollTabLabel
        :tabs="hotSearchSourcesTab"
        :target="hotSearchSourceCur"
        @change="changeHotSearchSources"
      />
    </div>
    <!-- price change tab -->
    <div
      v-if="type === 'priceChange'"
      class="ranking-tab-box"
    >
      <scrollTabLabel
        :tabs="priceChangeTab"
        :target="priceChangeTabCur"
        @change="changePriceChangeTab"
      />
    </div>
    <!-- list small title -->
    <div :class="['list-title', !rankingInfo.showIndex && 'list-title-no-index']">
      <div>
        <span
          v-if="rankingInfo.showIndex"
          class="col-index"
        >
          排名
        </span>
        <span
          v-for="(name, index) in rankingInfo.filedsName"
          :key="name"
          :class="rankingInfo.filedsClass[index]"
        >
          {{ name }}
        </span>
      </div>
    </div>

    <Empty v-if="storeLoadEnd && !storeRanking.length" />

    <ListLoading v-else-if="storeRanking.length === 0" />

    <div
      v-else-if="storeRanking.length !== 0"
      class="pair-list-container"
    >
      <!-- lists -->
      <div
        v-for="(item, index) in storeRanking"
        :key="item.symbol"
      >
        <ListEach
          :info="item"
          :lowest="false"
          :show-index="rankingInfo.showIndex ? index + 1 : 0"
          source="RANKING"
          :item-last-filed="itemLastFiled"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Empty, scrollTabLabel } from "components"
import ListLoading from "../pair/item-list-loading"
import ListEach from "../pair/item-list-each"
import stickyHeaders from "../pair/stickyHeaders"

export default {
  components: {
    ListLoading,
    ListEach,
    Empty,
    scrollTabLabel
  },
  props: {
    type: String
  },
  data() {
    return {
      loading: false,
      intervalRanking: null,
      hotSearchSourceCur: "",
      priceChangeTabCur: "up"
    }
  },
  computed: {
    setting() {
      return DI.get("store").state.setting.setting
    },
    hotSearchSources() {
      return this.setting && this.setting.hot_search_data_sources
        ? this.setting.hot_search_data_sources.split(",")
        : []
    },
    hotSearchSourcesCN() {
      return this.setting && this.setting.hot_search_data_sources_cn
        ? this.setting.hot_search_data_sources_cn.split(",")
        : []
    },
    hotSearchSourcesTab() {
      return this.hotSearchSources.map((item, index) => ({
        value: item,
        text: this.hotSearchSourcesCN[index] || item
      }))
    },
    priceChangeTab() {
      return Object.keys(this.tabfileds).map((item) => ({
        value: item,
        text: this.tabfileds[item]
      }))
    },
    rankingLabelsData() {
      return DI.get("RANKING_LABEL_DATA")
    },
    rankingInfo() {
      if (this.type && this.rankingLabelsData && this.rankingLabelsData[this.type]) {
        return this.rankingLabelsData[this.type]
      }
      return {}
    },
    tabfileds() {
      return this.rankingInfo['tabfileds'] ? this.rankingInfo['tabfileds'] : []
    },
    storeAllRanking() {
      return DI.get("store").state.ranking.ranking
    },
    storeKey() {
      if (this.type === 'hotSearch' && this.hotSearchSourceCur) {
        return this.type + this.hotSearchSourceCur
      }
      if (this.type === 'priceChange') {
        return this.type + this.priceChangeTabCur
      }
      return this.type
    },
    storeRanking() {
      return this.storeKey && this.storeAllRanking && this.storeAllRanking[this.storeKey]
        ? this.storeAllRanking[this.storeKey]
        : []
    },
    storeLoadEnd() {
      const loadEndFlag = DI.get("store").state.ranking.loadEndFlag
      return loadEndFlag && loadEndFlag[this.type]
        ? loadEndFlag[this.type]
        : false
    },
    itemLastFiled() {
      if (this.type === 'tradeVolume') {
        return 'vol'
      }
      if (this.type === 'marketValue') {
        return 'market_value_usd'
      }
      return ''
    }
  },
  watch: {
    hotSearchSources: {
      immediate: true,
      handler(arr) {
        if (arr && arr.length) {
          this.hotSearchSourceCur = arr[0]
        }
      }
    },
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initRankingData()
          this.intervalRanking = setInterval(() => {
            this.initRankingData()
          }, 1000 * 10)
        }
      }
    }
  },
  mounted() {
    if (this.type === 'hotSearch' || this.type === 'priceChange') {
      this.removeStickyHeadersListener = this.$nextTick(() => {
        stickyHeaders({
          paddingTop: 44 + 44,
          headerClass: '.ranking-tab-box'
        })
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalRanking)
    this.removeStickyHeadersListener
      && this.removeStickyHeadersListener()
  },
  methods: {
    changeHotSearchSources(source) {
      this.hotSearchSourceCur = source
      this.initHotSearch()
    },
    changePriceChangeTab(tab) {
      this.priceChangeTabCur = tab
      this.initChangePrice()
    },
    initRankingData() {
      if (this.type === 'hotSearch') {
        this.initHotSearch()
      } else if (this.type === 'priceChange') {
        this.initChangePrice()
      } else {
        DI.get('store').dispatch('SYNC_RANKING_PAIR', { type: this.type })
      }
    },
    initHotSearch() {
      if (this.type !== 'hotSearch' || !this.hotSearchSourceCur) {
        return
      }
      DI.get("store").dispatch("SYNC_RANKING_PAIR", {
        type: this.type,
        param: { source: this.hotSearchSourceCur }
      })
    },
    initChangePrice() {
      DI.get("store").dispatch("SYNC_RANKING_PAIR", {
        type: this.type,
        param: { type: this.priceChangeTabCur }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ranking-list-wrap {
  .pair-list-container {
    background-color: #fff;
  }
  .ranking-tab-box {
    background-color: #FFF;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    z-index: 1;
    border-bottom: 1px solid #eee;
    &.flex-left-right span {
      margin: 0;
    }
    &.ranking-tab-box-fixed {
      left: 10px;
      right: 10px;
      width: auto!important;
    }
  }
  .list-title {
    background-color: #fff;
    padding: 0 20px;
  }
  .list-title > div {
    border-bottom: 1px solid #eee;
    height: 32px;
    color: rgba(34, 34, 34, 0.3);
    font-size: 10px;
    display: flex;
    align-items: center;
    span.col-index {
      width: 10%;
    }
    span.col-bi {
      width: 33%;
    }
    span.col-price {
      width: calc(57% - 80px);
      text-align: right;
    }
    span.col-price-slim {
      width: calc(57% - 100px);
    }
    span.col-value {
      width: 80px;
      text-align: right;
    }
    span.col-value-wide {
      width: 100px;
      white-space: nowrap;
    }
  }
  .list-title-no-index > div {
    span.col-bi {
      width: 37%;
    }
    span.col-price {
      width: calc(63% - 80px);
    }
  }
}
</style>
<style lang="less">
.ranking-tab-box {
  .buy-sell {
    li {
      padding: 10px 30px 10px 0px!important;
    }
    .active span {
      font-weight: bold!important;
      color: #222!important;
    }
    span {
      color: #A4A4A4!important;
      font-weight: normal!important;
    }
    .bot {
      background: #4140BB!important;
    }
  }

}
</style>
