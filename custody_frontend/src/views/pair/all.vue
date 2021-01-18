<template>
  <div class="all">
    <div
      ref="all"
      class="elementInView"
    />
    <ListLoading
      v-if="storeAllPairList.length === 0"
    />
    <div
      v-if="storeAllPairList.length !== 0"
      class="all-pair-list-container"
    >
      <div
        v-for="(item) in storeAllPairList"
        :key="item.symbol"
      >
        <ListEach
          :info="item"
          :lowest="false"
        />
      </div>
      <LoadMore
        v-if="!storePairListLoadEnd"
        v-element-in-view="fetchData"
      />
    </div>
  </div>
</template>

<style>
</style>

<script>
import { DI } from 'core'
import { LoadMore } from 'components'
import ListLoading from './item-list-loading'
import ListEach from './item-list-each'
import elementInView from '@kpi/u/elementInView'

let intervalId
export default {
  components: {
    ListLoading,
    ListEach,
    LoadMore
  },
  computed: {
    setting() {
      return DI.get("store").state.setting.setting
    },
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    storeAllPairList() {
      return DI.get("store").state.pairV2.allPairList
    },
    storePairListLoadEnd() {
      return DI.get("store").state.pairV2.pairListLoadEnd
    }
  },
  methods: {
    initChild() {
      if (this.storeAllPairList.length) {
        this.fetchInViewDate()
      } else {
        this.fetchData()
      }
      this.initInterval()
    },
    fetchData() {
      DI.get('store').dispatch('SYNC_ALL_PAIR')
    },
    getIconUrl(target) {
      return this.biInfo && this.biInfo[target] && !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get('BI_LOCAL_ICON')[target]
    },
    fetchInViewDate() {
      const inViewBiArr = []
      const List = document.querySelector('.all-pair-list-container')
      if (!List) return
      const BiList = List.querySelectorAll('.pair-item-wrap')
      if (BiList && BiList.length > 0) {
        BiList.forEach((el) => {
          if (elementInView(el)) {
            inViewBiArr.push(el.dataset.symbol)
          }
        })
      }
      if (inViewBiArr.length === 0 ) return
      const query = inViewBiArr.join(',')
      DI.get('store').dispatch('SYNC_ASSETS_PAIR', { query })
    },
    initInterval() {
      if (intervalId) return
      this.fetchInViewDate()
      intervalId = setInterval(() => {
        if (!this.$refs.all || !elementInView(this.$refs.all)) {
          clearInterval(intervalId)
          intervalId = null
        } else {
          this.fetchInViewDate()
        }
      }, 1000 * 5)
    }
  }
}
</script>

