<script>
import { DI } from "core"

export default {
  computed: {
    storeYubibaoBalance() {
      return DI.get("store").state.yubibao.balance
    },
    storeYubibaoSetting() {
      return DI.get("store").state.yubibao.setting
    },
    storeYubibaoContract() {
      return DI.get("store").state.yubibao.contract
    }
  },
  mounted() {
    if (this.storeYubibaoBalance.yesterday_interest_cny_total >= 0
      && this.storeYubibaoSetting.length > 0) return
    this.fetchData()
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  methods: {
    fetchData() {
      DI.get('store').dispatch('SYNC_YUBIBAO_BALANCE')
      DI.get('store').dispatch('SYNC_YUBIBAO_SETTING')
      DI.get('store').dispatch('SYNC_YUBIBAO_CONTRACT')
    }
  }
}
</script>
