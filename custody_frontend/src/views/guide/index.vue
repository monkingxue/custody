<template>
  <div class="guide">
    <HeaderCommon
      :title="$t('index.tutorialTitle')"
    />
    <div class="white-box banner-box">
      <div
        v-if="false"
        class="banner touch-opacity"
        @click="toGuideFiat"
      >
        <img src="../../assets/images/guide/guide-banner1.png">
      </div>
      <div
        class="banner touch-opacity"
        @click="toGuideBibi"
      >
        <img src="../../assets/images/guide/guide-banner2.png">
      </div>
      <div
        class="banner touch-opacity"
        @click="toGuideDeposit"
      >
        <img src="../../assets/images/guide/guide-banner4.png">
      </div>
      <div
        class="banner touch-opacity"
        @click="toGuidePortfolio"
      >
        <img src="../../assets/images/guide/guide-banner5.png">
      </div>
      <div
        class="banner touch-opacity"
        @click="toPosterBibi"
      >
        <img src="../../assets/images/guide/guide-banner3.png">
      </div>
    </div>

    <!-- <div class="white-box guide-list">
      <div class="title">
        常见问题
      </div>
      <ul class="list">
        <li
          class="touch"
          @click="toPosterBibi"
        >
          <span>币币聚合交易</span>
        </li>
        <li
          class="touch"
          @click="toPosterBibi"
        >
          <span>币币聚合交易</span>
        </li>
      </ul>
    </div> -->
  </div>
</template>
<script>
import { HeaderCommon } from 'components'
import { DI } from "core"

export default {
  components: {
    HeaderCommon
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    storeRecommendAsset() {
      return DI.get("store").state.pairV2.recommendAssetList
    }
  },
  methods: {
    toGuideFiat() {
      this.$router.push({
        name: "guideFiat"
      })
    },
    toGuideBibi() {
      this.$router.push({
        name: "guideBibi"
      })
    },
    toGuideDeposit() {
      this.$router.push({
        name: "guideDeposit"
      })
    },
    toPosterBibi() {
      this.$router.push({
        name: "posterBibi"
      })
    },
    toGuidePortfolio() {
      this.$router.push({
        name: "guidePortfolio"
      })
    }
  }
}
</script>

<style scoped lang="less">
.guide {
  background-color: #F1F2F4;

  .white-box {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 20px 0;
  }
  .banner-box {
    padding: 20px;
    .banner {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .guide-list {
    .title {
      font-weight: bold;
      font-size: 18px;
      color: #222;
      margin-bottom: 15px;
      padding: 0 20px 0 30px;
    }
    li {
      padding: 0 20px;
      &:first-child span {
        border-top: 1px solid #eee;
      }
      span {
        background: url("../../assets/images/icon-arrow-right.svg") 98% center
        no-repeat;
        display: block;
        height: 48px;
        line-height: 48px;
        padding-left: 10px;
        font-size: 14px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>
