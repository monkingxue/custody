<template>
  <div class="explore">
    <div
      v-if="storeRecommendAsset.length"
      class="recommend-asset white-box"
    >
      <div class="top-title">
        <span>{{ $t('explore.sectionTitle1') }}</span>
        <img
          src="../../assets/images/icon18.png"
          width="14"
          height="14"
          @click="onShowTips"
        >
      </div>
      <div class="top-recommend">
        <div
          v-for="(item, index) in storeRecommendAsset"
          :key="index"
          class="card-item img-btn-dark"
          :style="{
            flex: `0 0 ${swiperWidth}px`
          }"
          @click="onCardClick(item)"
        >
          <div class="card-each">
            <div class="top-main">
              <div class="left-main">
                <div class="up">
                  <div class="name">
                    {{ item.asset_name }}
                  </div>
                  <div class="name-cn">
                    {{ item.cn_name }}
                  </div>
                </div>
                <div class="down din">
                  <div class="price">
                    ${{ item.price_usd }}
                  </div>
                  <div
                    class="change"
                    :class="{ red: item.percent_change_24h < 0 }"
                  >
                    {{ Number(item.percent_change_24h * 100).toFixed(2) }}%
                  </div>
                </div>
              </div>
              <div class="right-icon">
                <img :src="getIconUrl(item.symbol)">
              </div>
            </div>
            <div class="down-main">
              {{ item.reason }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="white-box clearfix">
      <div class="top-title">
        <span>{{ $t('explore.sectionTitle2') }}</span>
      </div>
      <div class="label-content">
        <span
          v-for="label in Object.keys(rankingLabels)"
          :key="label"
          class="touch-opacity"
          :style="`backgroundColor: ${rankingLabels[label]['bgColor']}`"
          @click="() => toRanking(label)"
        >
          <img :src="rankingLabels[label]['icon']">
          {{ rankingLabels[label]["label"] }}
        </span>
      </div>
    </div>

    <div class="white-box info-box">
      <div class="top-title">
        {{ $t('explore.news.title') }}
      </div>
      <ul class="info-list">
        <li
          v-for="item in storeArticles"
          :key="item.h5_url"
          @click="toDetail(item)"
        >
          <div class="info-item touch">
            <div
              :class="[
                'info-text',
                (!item.thumb_images || !item.thumb_images.length) &&
                  'info-text-long'
              ]"
            >
              <div class="info-text-content">
                <div>
                  <div class="title">
                    {{ item.title }}
                  </div>
                </div>
                <span class="author">{{ `${item.source} ${item.publish_time_text}` }}</span>
              </div>
            </div>
            <div
              v-if="item.thumb_images && item.thumb_images.length"
              class="img-box"
              :style="`backgroundImage: url('${item.thumb_images[0]}'); backgroundSize: cover;`"
            />
          </div>
        </li>
      </ul>
      <LoadMore
        v-if="!storeArticlesLoaded"
        v-element-in-view="loadMore"
      />
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { LoadMore } from "components"
import { Dialog } from "vant"

const maxWidth = window.innerWidth

export default {
  components: {
    LoadMore
  },
  data() {
    return {
      rankingLabels: DI.get('RANKING_LABEL_DATA'),
      swiperWidth: maxWidth * 0.4
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
    },
    storeRecommendAsset() {
      return DI.get("store").state.pairV2.recommendAssetList
    },
    storeArticles() {
      return DI.get("store").state.articles.articles || []
    },
    storeArticlesLoaded() {
      return DI.get("store").state.articles.loaded
    },
    storeArticlesLoading() {
      return DI.get("store").state.articles.loading
    }
  },
  mounted() {
    DI.get("store").dispatch("SYNC_RECOMMEND_ASSET")
    DI.get("store").dispatch("SYNC_ARTICLES", { pageIndex: 1 })
  },
  methods: {
    loadMore() {
      if (this.storeArticlesLoading) return
      DI.get("store").dispatch("SYNC_ARTICLES_LOADMORE")
      DI.get("store").dispatch("SYNC_ARTICLES")
    },
    getIconUrl(target) {
      return this.biInfo &&
        this.biInfo[target] &&
        !this.biInfo[target]["use_device_icon"]
        ? this.biInfo[target]["icon_url"]
        : DI.get("BI_LOCAL_ICON")[target]
    },
    onShowTips() {
      Dialog.alert({
        messageAlign: "left",
        title: this.$t('explore.section1DescriptionTitle'),
        message: this.$t('explore.section1Description')
      })
    },
    onCardClick(item) {
      const symbol = item.pairs[0]
      this.$router.push({
        name: "chart",
        params: {
          symbol
        }
      })
    },
    toRanking(type) {
      this.$router.push({
        name: "ranking",
        query: { type }
      })
    },
    toDetail(item) {
      window.location = item.h5_url
    }
  }
}
</script>

<style scoped lang="less">
.explore {
  background-color: #F1F2F4;

  .white-box {
    background-color: #fff;
    padding: 0 0 20px;
    margin-bottom: 10px;
  }
  .top-title {
    font-weight: bold;
    font-size: 20px;
    color: #222222;
    padding-left: 6%;
    display: flex;
    align-items: center;
    height: 48px;
    line-height: 48px;
  }
  .recommend-asset {
    max-height: 60vw;
    position: relative;
    padding: 10px 0 0;
    .top-title {
      img {
        display: inline-block;
        margin-left: 4px;
      }
    }
    .top-recommend {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 10px 0 20px;
    }
    .top-recommend::-webkit-scrollbar {
      display: none;
      -webkit-appearance: none;
    }
    .card-item {
      padding-right: 10px;
    }
    .card-item:first-of-type {
      margin-left: 6%;
    }
    .card-each {
      background-color: #fff;
      border-radius: 4px;
      padding: 18px 17px 5px;
      box-shadow: 0 0px 15px rgba(0, 0, 0, 0.08);
      min-height: 21vw;
      .top-main {
        display: flex;
        justify-content: space-between;
        .left-main {
          .up {
            display: flex;
            align-items: center;
          }
          .down {
            display: flex;
            align-items: center;
            padding: 5px 0 3px;
          }
          .name {
            font-size: 14px;
            color: #222222;
            font-weight: bold;
          }
          .name-cn {
            margin-left: 5px;
            opacity: 0.3;
            font-size: 10px;
            color: #222222;
          }
          .price {
            font-size: 10px;
            color: #222222;
          }
          .change {
            margin-left: 5px;
            font-size: 10px;
            color: #36d58f;
          }
          .red {
            color: #ff654c;
          }
        }
        .right-icon {
          img {
            width: 28px;
            height: 28px;
          }
        }
      }
      .down-main {
        font-size: 10px;
        margin-top: 5px;
        color: rgba(34, 34, 34, 0.6);
      }
    }
  }
  .label-content {
    padding-left: 20px;
    span {
      float: left;
      background-color: #f1f2f4;
      height: 32px;
      line-height: 32px;
      padding: 0 15px 0 10px;
      font-size: 12px;
      margin: 10px 10px 0 0;
      border-radius: 16px;
      display: flex;
      align-items: center;
      color: #fff;
      font-weight: bold;
      img {
        width: 14px;
        margin-right: 3px;
      }
    }
  }
  .info-box {
    padding-bottom: 60px;
  }
  .info-list {
    li {
      padding: 0 20px;
      margin-bottom: 15px;
      .info-item {
        border: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        padding-left: 15px;
        border-radius: 5px;
      }
    }
    .info-text {
      width: 60%;
      height: 0;
      padding-bottom: 37%;
      position: relative;
      &.info-text-long {
        width: 98%;
      }
      .info-text-content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      .title {
        font-size: 16px;
        line-height: 22px;
        height: 44px;
        width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .author {
        font-size: 12px;
        color: rgba(34, 34, 34, 0.6);
      }
    }
    .img-box {
      width: 37%;
      height: 0px;
      padding-bottom: 37%;
      overflow: hidden;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 0 5px 5px 0;
    }
  }
}
</style>
