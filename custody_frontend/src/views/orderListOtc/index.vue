<template>
  <ListView
    :http-method="httpMethod"
  >
    <ListItem
      slot="listItem"
      slot-scope="{item}"
      :item="item"
      parent-list="orderListOtc"
    />
    <ListItem />
  </ListView>
</template>
<script>
import { DI } from "core"
import { ListView } from "components"
import ListItem from "../allOrders/item"

export default {
  components: {
    ListItem,
    ListView
  },
  data() {
    return {
      httpMethod: DI.get("orderHttp").getOrderListOtc
    }
  },
  mounted() {
    DI.get("utils").setTitle('OTC订单')
  }
}
</script>
