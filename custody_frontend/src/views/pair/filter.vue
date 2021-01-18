<template>
  <div
    class="filter"
  >
    <div
      ref="all"
      class="elementInView"
    />
    <ListLoading
      v-if="storeFilterPairList.length === 0"
    />
    <div
      v-if="storeFilterPairList.length !== 0"
      class="main-filter"
      :class="[filter]"
    >
      <div
        v-for="(item) in storeFilterPairList"
        :key="item.exchange"
        class="exchange-box"
      >
        <div class="exchange">
          <span class="exchange-label">
            <img
              v-if="getOTCInfo(item.exchange)"
              class="icon"
              :src="getOTCInfo(item.exchange).icon"
            >
            <span class="nameCN">
              {{ getOTCInfo(item.exchange).nameCN }}
            </span>
          </span>
        </div>
        <ListEach
          v-for="(asset, index) in item.coins"
          :key="asset.symbol"
          :info="asset"
          :is-last="index + 1 === item.coins.length"
        />
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import { DI } from 'core'
import ListLoading from './item-list-loading'
import ListEach from './item-list-each'
import elementInView from '@kpi/u/elementInView'
// import stickyHeaders from './stickyHeaders'

const intervalIds = {}
export default {
  components: {
    ListLoading,
    ListEach
  },
  props: {
    filter: String
  },
  computed: {
    storeFilterPairList() {
      return DI.get("store").state.pairV2[`filter${this.filter}PairList`]
    }
  },
  // watch: {
  //   storeFilterPairList(val) {
  //     if (val.length > 0) {
  //       this.$nextTick(() => {
  //         if (!this.removeStickyHeadersListener) {
  //           this.removeStickyHeadersListener = stickyHeaders({
  //             paddingTop: document.querySelector('.main-filter').getBoundingClientRect().top + window.pageYOffset,
  //             headerClass: `.${this.filter} .exchange`
  //           })
  //         }
  //       })
  //     }
  //   }
  // },
  destroyed() {
    this.removeStickyHeadersListener
      && this.removeStickyHeadersListener()
  },
  methods: {
    initChild() {
      this.fetchData()
      this.initInterval()
    },
    initInterval() {
      if (intervalIds[this.filter]) return
      intervalIds[this.filter] = setInterval(() => {
        if (!this.$refs.all || !elementInView(this.$refs.all)) {
          clearInterval(intervalIds[this.filter])
          intervalIds[this.filter] = null
        } else {
          this.fetchData()
        }
      }, 1000 * 5)
    },
    fetchData() {
      DI.get('store').dispatch('SYNC_FILTER_PAIR', { filter: this.filter })
    },
    getOTCInfo(target) {
      return DI.get('OTC_INFO')[target]
    }
  }
}
</script>
<style scoped lang="less">
.exchange-box {
  background-color: #fff;
}
.exchange {
  display: flex;
  align-items: center;
  padding-top: 10px;
  z-index: 1;
  .exchange-label {
    background-color: #F1F2F4;
    padding: 0 20px;
    border-radius: 0 10px 10px 0;
    height: 25px;
    display: flex;
    align-items: center;
  }
  .icon{
    width: 16px;
  }
  .nameCN{
    font-size: 12px;
    color: #222222;
    font-weight: bold;
    margin-left: 6px;
  }
}
</style>
