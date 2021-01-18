<script>
import { DI } from "core"
const SEARCH_ICON_HISTORY = "SEARCH_ICON_HISTORY"
const SEARCH_PAIR_HISTORY = "SEARCH_PAIR_HISTORY"
const ICON = "ICON"
const PAIR = "PAIR"

export default {
  data() {
    return {
      historyIcons: [],
      historyPairs: []
    }
  },
  methods: {
    initLocalHistory(historyType) {
      if (historyType === ICON) {
        this.historyIcons = this.getLocalHistory(SEARCH_ICON_HISTORY)
      }
      if (historyType === PAIR) {
        this.historyPairs = this.getLocalHistory(SEARCH_PAIR_HISTORY)
      }
    },
    getLocalHistory(localName) {
      let localHistoryData = DI.get("offlineStorage").get(localName)
      localHistoryData = localHistoryData ? JSON.parse(localHistoryData) : []
      if (!Array.isArray(localHistoryData)) {
        DI.get("offlineStorage").remove(localName)
        return []
      }
      return localHistoryData
    },
    addLocalHistory(item, type) {
      const localName =
        type === ICON ? SEARCH_ICON_HISTORY : SEARCH_PAIR_HISTORY
      const historyArr = this.getLocalHistory(localName)
      if (historyArr.indexOf(item) >= 0) {
        // deduplication
        historyArr.splice(historyArr.indexOf(item), 1)
      }
      historyArr.unshift(item)
      if (historyArr.length > 5) {
        // length limit
        historyArr.length = 5
      }
      DI.get("offlineStorage").set(localName, JSON.stringify(historyArr))
    },
    clearLocalHistory(historyType) {
      if (historyType === ICON) {
        this.historyIcons = []
        DI.get("offlineStorage").remove(SEARCH_ICON_HISTORY)
      }
      if (historyType === PAIR) {
        this.historyPairs = []
        DI.get("offlineStorage").remove(SEARCH_PAIR_HISTORY)
      }
    }
  }
}
</script>
