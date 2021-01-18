<template>
  <div class="container-white">
    <div class="comm-list">
      <ListLoading v-if="!noRecord && !orderList.length" />

      <Empty v-else-if="noRecord && !orderList.length" />

      <div v-else-if="!noRecord && orderList.length">
        <div
          v-for="item in orderList"
          :key="item.order_id"
          :class="{ canceled: item.status === 'canceled' }"
        >
          <slot
            name="listItem"
            :item="item"
          />
        </div>

        <LoadMore
          v-if="orderList.length < totalCount"
          v-element-in-view="loadMore"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Message, LoadMore, Empty } from "components"
import ListLoading from "../../views/allOrders/loading"

export default {
  components: {
    Empty,
    ListLoading,
    LoadMore
  },
  props: {
    httpAdaptor: {
      type: Object,
      default: () => ({
        items: 'items',
        total: 'total'
      })
    },
    httpMethod: {
      type: Function
    }
  },
  data() {
    return {
      orderList: [],
      totalCount: 0,
      pageIndex: 1,
      loading: false,
      noRecord: false
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.loading = true
      this.httpMethod({
        page: this.pageIndex
      })
        .then(res => {
          this.orderList = this.orderList.concat(
            res[this.httpAdaptor.items])
          this.totalCount = res[this.httpAdaptor.total]
        })
        .catch(Message)
        .then(() => {
          if (this.orderList.length === 0) {
            this.noRecord = true
          }
          this.loading = false
        })
    },
    loadMore() {
      if (this.loading) return
      this.pageIndex += 1
      this.getOrderList()
    }
  }
}
</script>
