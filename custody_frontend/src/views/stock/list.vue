<template>
  <div class="stock-list-wrap">
    <Empty v-if="storeLoaded && !storeStockList.length" />

    <ListLoading v-else-if="!storeLoaded && !storeStockList.length" />

    <div
      v-else-if="storeStockList.length"
      class="stock-list-box"
    >
      <!-- lists -->
      <div
        v-for="item in storeStockList"
        :key="item.symbol"
      >
        <ListEach
          :info="item"
          source="STOCK"
        />
      </div>

      <LoadMore
        v-if="!storeLoaded"
        v-element-in-view="loadMore"
      />
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Empty, LoadMore } from "components"
import ListLoading from "../pair/item-list-loading"
import ListEach from "../pair/item-list-each"

export default {
  components: {
    ListLoading,
    ListEach,
    Empty,
    LoadMore
  },
  data() {
    return {}
  },
  computed: {
    storeStockList() {
      return DI.get("store").state.stock.stockList
    },
    storeLoaded() {
      return DI.get("store").state.stock.stockListLoaded
    },
    storeLoading() {
      return DI.get("store").state.stock.stockListLoading
    }
  },
  mounted() {
    this.getStockData()
  },
  methods: {
    getStockData() {
      DI.get('store').dispatch('SYNC_STOCK_LIST')
    },
    loadMore() {
      if (this.storeLoading) return
      DI.get("store").dispatch("SYNC_LIST_LOADMORE")
      DI.get("store").dispatch("SYNC_STOCK_LIST")
    }
  }
}
</script>

<style lang="less" scoped>
.stock-list-wrap {
  min-height: calc(100vh - 348px);
  background-color: #fff;
}
</style>