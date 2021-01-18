<script>
import { DI } from "core"

export default {
  computed: {
    storePairItem() {
      if (
        DI.get("store").state.pair.pairItem &&
        DI.get("store").state.pair.pairItem.symbol != this.symbol
      ) {
        return {}
      }
      return DI.get("store").state.pair.pairItem
    },
    priceDigits() {
      return this.storePairItem.price_digits
    },
    amountDigits() {
      return this.storePairItem.amount_digits
    },
    depth() {
      if (this.oldSymbol != this.symbol) {
        return {}
      }
      return DI.get("store").state.depth.depth
    },
    depthLoaded() {
      if (this.oldSymbol != this.symbol) {
        return false
      }
      return DI.get("store").state.depth.loaded
    },
    oldSymbol() {
      return DI.get("store").state.depth.symbol
    },
    asksData() {
      // 卖单
      if (this.oldSymbol != this.symbol) {
        return []
      }
      return this.depth.asks || []
    },
    bidsData() {
      // 买单
      if (this.oldSymbol !== this.symbol) {
        return []
      }
      return this.depth.bids || []
    },
    middlePrice() {
      if (
        this.bidsData.length &&
        this.bidsData[0].length &&
        this.asksData.length &&
        this.asksData[0].length
      ) {
        return Number((+this.bidsData[0][0] + +this.asksData[0][0]) / 2)
      }
      return ""
    },
    bidsMiddlePrice() {
      if (this.bidsData.length && this.bidsData[0].length) {
        return this.bidsData[0][0]
      }
      return ""
    }
  }
}
</script>
