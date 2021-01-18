
<template>
  <ListView
    :http-method="httpMethod"
    :http-adaptor="httpAdaptor"
  >
    <ListItem
      slot="listItem"
      slot-scope="{item}"
      :item="item"
    />
    <ListItem />
  </ListView>
</template>
<script>
import { DI } from "core"
import { ListView } from "components"
import ListItem from "./item"

export default {
  components: {
    ListItem,
    ListView
  },
  data() {
    return {
      httpMethod: DI.get("orderHttp").getOrderList,
      httpAdaptor: {
        items: 'orders',
        total: 'total_length'
      }
    }
  },
  mounted() {
    DI.get("utils").setTitle(this.$t("orderinquiry"))
    DI.get('utils').setBackAction(() => {
      this.$router.push({ name: 'account' })
    })
  }
}
</script>
