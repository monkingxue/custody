<template>
  <div class="search">
    <div class="top">
      <div class="search-container">
        <div class="search-main">
          <img
            class="search-icon"
            src="../../../assets/images/pair/icon-search.png"
          >
          <input
            ref="input"
            v-model="searchInput"
            class="search-input"
            :placeholder="placeholder"
            autoFocus
          >
        </div>
        <span
          class="search-cancel"
          @click="onSearchCancel"
        >
          {{ $t('cancel') }}
        </span>
      </div>
    </div>

    <!-- search history -->
    <div
      v-if="!searchInput"
      class="content"
    >
      <div
        v-if="curPairs.length > 1"
        class="search-box"
      >
        <h4>切换币对</h4>
        <div class="search-rec-list">
          <span
            v-for="pair in curPairs"
            :key="pair"
            class="item"
            @click="() => onItemClick(pair)"
          >
            {{ getPairName(pair) }}
          </span>
        </div>
      </div>
      <div class="search-box">
        <h4>{{ $t('search.topSearch') }}</h4>
        <div class="search-rec-list">
          <span
            v-for="hotItem in storeHotSearch"
            :key="hotItem.coin"
            class="item"
            @click="() => onItemClick(hotItem.pairs[0])"
          >
            {{ hotItem.coin }}
            <span
              v-if="hotItem.tag"
              :class="['hot-label', hotItem.tag && `icon-${hotItem.tag}`]"
            />
          </span>
        </div>
      </div>
      <div class="search-box">
        <div class="flex-left-right line">
          <h4>{{ $t('search.history') }}</h4>
          <img
            class="clear"
            src="../../../assets/images/pair/icon-del.png"
            width="36"
            @click="clearHistory"
          >
        </div>
        <div class="search-rec-list">
          <div
            v-for="historyItem in searchHistory"
            :key="historyItem"
            class="item"
            @click="() => onItemClick(historyItem)"
          >
            {{ getPairName(historyItem) }}
          </div>
        </div>
      </div>
    </div>

    <!-- search result -->
    <div
      v-else-if="searchResult.length"
      class="content"
    >
      <div v-if="type==='favorite'">
        <ListEach
          v-for="(item) in searchResult"
          :key="item.asset"
          :info="{
            ...item,
            symbol: item.asset
          }"
          :type="type"
        />
      </div>
      <div v-if="type==='pair' || type==='exchange'">
        <ListEach
          v-for="(item) in searchResult"
          :key="item"
          :type="type"
          :info="{
            symbol: item.split('_')[0],
            quote: item.split('_')[1]
          }"
        />
      </div>
    </div>

    <!-- search loading -->
    <div
      v-else-if="searching"
      class="content search-loading"
    >
      <Loading color="#36d58f" />
    </div>

    <!-- no results -->
    <div
      v-else
      class="content"
    >
      <Empty />
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Message, Empty, Loading } from 'components'
import debounce from '@kpi/u/debounce'
import ListEach from '../item-list-each'
import SearchHistory from './searchHistory'
export default {
  components: {
    ListEach,
    Loading,
    Empty
  },
  mixins: [SearchHistory],
  data() {
    return {
      searchInput: null,
      searchResult: [],
      searching: false,
      type: '',
      asset: ''
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    isCoin() {
      return this.type === 'favorite'
    },
    placeholder() {
      return this.isCoin
        ? this.$t('search.searchTokenName')
        : this.$t('search.searchPairName')
    },
    storeHotSearch() {
      return DI.get("store").state.pairV2.hotSearch
    },
    searchHistory() {
      return this.isCoin ? this.historyIcons : this.historyPairs
    },
    storeAllPairMap() {
      return DI.get("store").state.pairV2.allPairMap
    },
    curPairs() {
      if (
        this.storeAllPairMap &&
        this.asset &&
        this.storeAllPairMap[this.asset] &&
        this.storeAllPairMap[this.asset].pairs &&
        this.storeAllPairMap[this.asset].pairs.length
      ) {
        return this.storeAllPairMap[this.asset].pairs
      }
      return []
    }
  },
  watch: {
    searchInput(val, oldVal) {
      if (val !== oldVal) {
        this.searching = true
        this.throttleOnSearchAction()
      }
    }
  },
  created () {
    this.throttleOnSearchAction = debounce(this.onSearchAction, 200)
  },
  mounted() {
    const { query } = this.$route
    this.type = query.type || 'favorite'
    this.asset = query.asset
    if (this.asset) {
      DI.get('store').dispatch('SYNC_SINGLE_ASSETS', { query: this.asset })
    }

    DI.get('store').dispatch('SYNC_HOT_SEARCH')
    this.initLocalHistory(this.isCoin ? 'ICON' : 'PAIR')

    setTimeout(() => {
      this.$refs.input.focus()
    }, 100)
  },
  methods: {
    onSearchCancel() {
      this.$router.go(-1)
    },
    onSearchAction() {
      this.searchResult = []
      const keyword = this.searchInput
      if (!keyword) return
      let method
      if (this.type === 'favorite') {
        method = 'getAssetSearch'
      }
      if (this.type === 'pair') {
        method = 'getPairSearch'
      }
      if (this.type === 'exchange') {
        method = 'getPairSearch'
      }
      DI.get('pairHttp')[method]({ params: {
        keyword
      } })
        .then((res) => {
          if (keyword === this.searchInput) {
            this.searchResult = res.assets || res.pairs
          }
        })
        .catch(Message)
        .then(() => {
          this.searching = false
        })
    },
    getPairName(symbol) {
      return this.isCoin
        ? DI.get("utils").getBaseFromSymbol(symbol)
        : DI.get("utils").getPairWithSpace(symbol)
    },
    clearHistory() {
      const type = this.isCoin ? 'ICON' : 'PAIR'
      this.clearLocalHistory(type)
    },
    onItemClick(symbol) {
      let jumpMethod = 'push'
      if (this.type === 'favorite' || this.type === 'pair' || this.type === 'exchange') {
        jumpMethod = 'replace'
      }
      const routeName = this.type === 'exchange' ? 'exchange' : 'chart'
      this.addLocalHistory(symbol, this.isCoin ? "ICON" : "PAIR")

      this.$router[jumpMethod]({
        name: routeName,
        params: {
          symbol
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.search {
  background-color: #f1f2f4;
  min-height: calc(100vh);
  .top {
    position: fixed;
    height: 48px;
    background-color: #4140bb;
    left: 0;
    right: 0;
    z-index: 9;
    .search-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .search-main {
        margin-left: 20px;
        margin-right: 20px;
        border-radius: 2px;
        height: 32px;
        display: flex;
        align-items: center;
        flex: 1;
        border-radius: 100px;
        background: rgba(0, 0, 0, .1);
      }
      .search-icon {
        width: 28px;
        margin-right: 5px;
        margin-left: 3px;
      }
      .search-input {
        background: transparent;
        border: none;
        caret-color: #00C3D2;
        color: #FFF;
        width: 100%;
        font-size: 14px;
      }
      .search-cancel {
        font-size: 14px;
        color: #FFFFFF;
        margin-right: 20px;
      }
    }
  }
  .content {
    padding-top: 48px;
    &.search-loading {
      padding-top: 100px;
      display: flex;
      justify-content: center;
    }
  }
  .search-box {
    background-color: #fff;
    padding: 10px 20px;
    margin-bottom: 10px;
    .line {
      align-items: center;
      margin-top: -10px;
    }
    .clear {
      margin-right: -10px;
    }
    h4 {
      font-size: 12px;
      color: rgba(34, 34, 34, 0.6);
    }
  }
  .search-rec-list {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;

    .item {
      background-color: #FAFAFA;
      height: 38px;
      line-height: 38px;
      text-align: center;
      width: 30%;
      font-size: 14px;
      color: #222;
      margin: 10px 10px 0 0;
      position: relative;
    }
    .icon-boom {
      background: url("../../../assets/images/pair/icon-boom.png") center no-repeat;
    }
    .icon-hot {
      background: url("../../../assets/images/pair/icon-hot.png") no-repeat;
    }
    .icon-new {
      background: url("../../../assets/images/pair/icon-new.png") no-repeat;
    }
    .icon-recommend {
      background: url("../../../assets/images/pair/icon-recommend.png") no-repeat;
    }
    .hot-label {
      position: absolute;
      right: 10px;
      top: 13px;
      width: 12px;
      height: 12px;
      background-size: 100%;
    }
  }
}
</style>

