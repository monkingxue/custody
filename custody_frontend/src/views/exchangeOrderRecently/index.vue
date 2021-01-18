<template>
  <div class="xch-order-wrap">
    <div class="flex-left-right xch-title">
      <scrollTabLabel
        class="order-tab"
        :tabs="orderTabLabel"
        :target="orderTab"
        @change="onSwitchTabClick"
      />
      <span
        v-if="isAuthenticated"
        class="font14 arrow-right"
        @click="goXchALLOrders"
      >
        {{ orderTab === 'open' ? $t('allOpenOrders') : $t('allHistory') }}
      </span>
    </div>
    <div class="order-content">
      <ScrollTab v-model="orderTab">
        <ScrollTabItem id="open">
          <OrderList
            v-if="orderTab === 'open'"
            type="open"
            :symbol="symbol"
          />
        </ScrollTabItem>
        <ScrollTabItem id="history">
          <OrderList
            v-if="orderTab === 'history'"
            type="history"
            :symbol="symbol"
          />
        </ScrollTabItem>
      </ScrollTab>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { scrollTabLabel, ScrollTab as ScrollTabContainer } from "components"
import OrderList from "./orderList"

const { ScrollTab, ScrollTabItem } = ScrollTabContainer

export default {
  components: {
    scrollTabLabel,
    ScrollTab,
    ScrollTabItem,
    OrderList
  },
  props: {
    symbol: String
  },
  data() {
    return {
      openTotal: "",
      orderTab: "open"
    }
  },
  computed: {
    isAuthenticated() {
      return DI.get("auth").isAuthenticated()
    },
    orderTabLabel() {
      return [
        {
          value: "open",
          text: `${this.$t("openOrders")}`,
          subText: this.openTotal
        },
        { value: "history", text: this.$t('24hHistory') }
      ]
    }
  },
  mounted() {
    DI.get("vue").$on('get-open-orders-total', (total) => {
      this.openTotal = total
    })
  },
  methods: {
    onSwitchTabClick(tab) {
      if (this.orderTab === tab) {
        return
      }
      this.orderTab = tab
    },
    goXchALLOrders() {
      this.$router.push({
        name: "exchangeAllOrders",
        params: {
          orderType: this.orderTab,
          symbol: this.orderTab === 'open' ? 'all' : this.symbol
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.xch-order-wrap {
  .xch-title {
    border-bottom: 1px solid #eee;
    line-height: 48px !important;
  }
}
</style>
<style lang="less">
.xch-order-wrap {
  .order-tab {
    ul {
      li {
        padding: 0 20px 0 0 !important;
        color: rgba(34, 34, 34, 0.3) !important;
        font-weight: normal;
      }
      li.active {
        color: #222 !important;
        font-weight: 500;
      }
      span {
        line-height: 48px !important;
      }
      .bot {
        background-color: #4140bb !important;
      }
    }
  }
}
</style>
