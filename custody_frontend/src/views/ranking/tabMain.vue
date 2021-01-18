<template>
  <div class="ranking-wrap-tab">
    <div class="ranking-top">
      <div class="top-wrap">
        <div>
          <h2 class="title">
            {{ rankingInfo["title"] }}
          </h2>
          <div
            class="sub-title"
            @click="showTips"
          >
            {{ rankingInfo["subTitle"] }}
            <span class="icon-help" />
          </div>
        </div>
        <div class="top-img">
          <img :src="rankingInfo.iconLarge">
        </div>
      </div>
    </div>
    <div
      ref="rankingList"
      class="ranking-list"
    >
      <TabFilter
        v-if="type === 'ieo'"
        ref="ieo"
        filter="ieo"
      />
      <OtcPremium v-else-if="type === 'otcPremium'" />
      <CryptoMarketCap v-else-if="type === 'cryptoMarketCap'" />
      <RankingList
        v-else
        :type="type"
      />
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Dialog } from "vant"
import TabFilter from "../pair/filter"
import OtcPremium from "./otcPremium"
import CryptoMarketCap from "./cryptoMarketCap"
import RankingList from "./rankingList"

let lastScrollPosition = 0
let lastType = ""

export default {
  components: {
    TabFilter,
    OtcPremium,
    CryptoMarketCap,
    RankingList
  },
  props: {
    type: String
  },
  data() {
    return {
      rankingLabelsData: DI.get("RANKING_LABEL_DATA")
    }
  },
  computed: {
    rankingInfo() {
      if (this.type) {
        return this.rankingLabelsData[this.type]
          ? this.rankingLabelsData[this.type]
          : {}
      }
      return {}
    },
    isFromApp() {
      return DI.get('utils').isFromApp()
    }
  },
  beforeRouteLeave(to, from, next) {
    lastType = this.type
    next()
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        if (!val) return
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        DI.get('utils').setBody('bacgray')
        if (this.type === "ieo") {
          const initFunc =
          this.$refs[this.type] && this.$refs[this.type].initChild
          if (initFunc) initFunc()
        }

        if (lastScrollPosition >= 0 && lastType === this.type) {
          window.scroll(0, lastScrollPosition)
          lastScrollPosition = 0
        }
      })
    },
    showTips() {
      Dialog.alert({
        title: `${
          this.rankingInfo["type"] === "ieo"
            ? this.rankingInfo["title"] + "榜说明"
            : this.rankingInfo["title"] + "说明"
        }`,
        messageAlign: "left",
        message: this.rankingInfo["desc"],
        confirmButtonText: "好的",
        className: "ranking-tips"
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ranking-wrap-tab {
  .ranking-top {
    background: url(../../assets/images/rank/bg.png) no-repeat;
    background-color: #4140BB;
    background-size: 100%;
    background-position: bottom;
    height: 140px;
    padding: 10px 18px 0;
    .top-wrap {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top-img {
      width: 50px;
    }
    .title {
      font-size: 28px;
      line-height: 40px;
      color: #fff;
      font-weight: bold;
    }
    .sub-title {
      font-size: 10px;
      line-height: 14px;
      color: #fff;
      display: flex;
      padding-top: 5px;
      align-items: center;
    }
    .sub-title .icon-help {
      width: 12px;
      height: 12px;
      margin-left: 3px;
      background-color: #fff;
      mask: url("../../assets/images/icon/icon-help.svg") no-repeat center;
    }
  }
  .ranking-list {
    padding: 0 10px;
    margin-top: -30px;
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
.ranking-tips {
  .van-dialog__message {
    font-size: 13px;
  }
}
</style>
