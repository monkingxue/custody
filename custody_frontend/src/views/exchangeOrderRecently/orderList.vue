<template>
  <div class="order-list-wrap">
    <ListLoading
      v-if="!noRecord && !orderList.length && isLogin"
      :placeholders-num="2"
    />

    <div
      v-else-if="!noRecord && !isLogin"
      class="no-login"
      @click="goToLogin"
    >
      {{ $t('pleaseLogin') }} &gt;
    </div>

    <Empty
      v-else-if="noRecord && !orderList.length"
      :text="isOpenOrders ? $t('noCommission') : ''" 
    />

    <div v-else-if="orderList.length">
      <div
        v-for="orderItem in orderList"
        :key="orderItem.order_id"
      >
        <ListItem
          :type="type"
          :order="orderItem"
        />
      </div>
      
      <LoadMore
        v-if="orderList.length < totalCount"
        v-element-in-view="loadMore"
      />
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Empty, LoadMore, Message } from "components"
import ListLoading from "../exchangeOrder/listLoading"
import ListItem from "./listItem"

const HISTORY_PAGE_NUM = 15
const OPEN_PAGE_NUM = 50

export default {
  components: {
    ListLoading,
    Empty,
    LoadMore,
    ListItem
  },
  props: {
    symbol: String,
    type: String
  },
  data() {
    return {
      xchOrderTimer: null,
      orderList: [],
      noRecord: false,
      totalCount: 0,
      pageIndex: 1,
      loading: false,
      loaded: false
    }
  },
  computed: {
    account() {
      return DI.get("auth").getUser()
    },
    isLogin() {
      return DI.get("auth").getToken().token
    },
    isOpenOrders() {
      return this.type === 'open'
    }
  },
  watch: {
    $route() {
      this.initHistory()
    },
    symbol: {
      immediate: true,
      handler(val) {
        if(val && !this.loaded) {
          this.getXchOrders()
        }
      }
    },
    type: {
      immediate: true,
      handler(val) {
        if(val && !this.loaded) {
          this.getXchOrders()
        }
      }
    },
    account: {
      immediate: true,
      handler(val) {
        if(val.identity && !this.loaded) {
          this.getXchOrders()
        }
      }
    }
  },
  mounted() {
    DI.get("vue").$on("update-orderlist-polling", () => {
      this.getXchOrders(true)
      this.pollingOrders()
    })
  },
  beforeDestroy() {
    this.clearXchOrderTimer()
  },
  methods: {
    initHistory() {
      this.clearXchOrderTimer()
      this.xchOrderTimer = null
      this.orderList = []
      this.noRecord = false
      this.totalCount = 0
      this.pageIndex = 1
      this.loading = false
      this.loaded = false
      this.getXchOrders()
    },
    clearXchOrderTimer() {
      clearInterval(this.xchOrderTimer)
    },
    pollingOrders() {
      if (this.xchOrderTimer === null) {
        this.xchOrderTimer = setInterval(() => {
          this.getXchOrders(true)
        }, 1000 * 5)
      }
    },
    processListData(res, updated) {
      const pageNum = this.isOpenOrders ? OPEN_PAGE_NUM : HISTORY_PAGE_NUM

      this.totalCount = res.total_length
      if (this.isOpenOrders) {
        DI.get("vue").$emit('get-open-orders-total', res.total_length)
      }
      if (this.totalCount > 0) {
        this.pollingOrders()
      }
      if (!updated) {
        this.orderList = this.orderList.concat(res.orders)
      } else if (+this.totalCount <= pageNum) {
        this.orderList = res.orders
      } else {
        let tempArr = []
        const tempMap = new Map()
        tempArr = tempArr.concat(
          res.orders,
          this.orderList.slice(0, pageNum)
        )
        const deduplication = tempArr.filter(
          a => !tempMap.has(a.order_id) && tempMap.set(a.order_id, 1)
        )
        this.orderList.splice(0, pageNum, ...deduplication)
      }      
    },
    getXchOrders(updated = false) {
      if (!this.account.identity) {
        // need login
        return
      }
      if (this.loading || !this.symbol || !this.type) {
        return
      }
      if (!updated) {
        // just update the first page
        this.loading = true
      }
      const pageIndex = updated ? 1 : this.pageIndex
      const pageNum = this.isOpenOrders ? OPEN_PAGE_NUM : HISTORY_PAGE_NUM
      const status = this.isOpenOrders ? 'unfinished' : 'finished'
      const recent = this.isOpenOrders ? 0 : 1
      // const status = this.isOpenOrders ? 'unfinished' : 'all'
      // const recent = 0

      DI.get("pairHttp")
        .getExchangeOrders(pageIndex, pageNum, status, this.symbol, recent)
        .then(res => {
          this.processListData(res, updated)
        })
        .catch(Message)
        .then(() => {
          if (this.orderList.length === 0) {
            this.noRecord = true
          } else {
            this.noRecord = false
          }
          this.loading = false
          this.loaded = true
        })
    },
    loadMore() {
      if (this.loading) return
      this.pageIndex += 1
      this.getXchOrders()
    },
    goToLogin() {
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped lang="less">
.order-list-wrap {
  .no-login {
    width: 100%;
    margin: 5vh 0;
    color: rgba(34, 34, 34, 0.6);
    text-align: center;
    font-size: 12px;
  }
}
</style>
