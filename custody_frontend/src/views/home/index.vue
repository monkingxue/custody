<template>
  <div class="home">
    <div class="top">
      <div class="top-container">
        <img
          class="logo"
          src="../../assets/images/pair/icon-abtc.png"
        >
        <div
          class="search"
          @click="onSearchClick"
        >
          <img
            class="search-icon"
            src="../../assets/images/pair/icon-search.png"
          >
          <span class="search-text">{{ $t("search.searchTokenPlaceholder") }}</span>
        </div>
      </div>
    </div>
    <div
      class="white-box notice-box touch"
    >
      <img
        class="notice"
        src="../../assets/images/home/notice.png"
      >
      <div
        class="notice-list"
      >
        <content-loader
          v-if="!noticeArr.length"
          :height="40"
          :width="220"
          :speed="1"
          class="notice-loading"
          primary-color="#f3f3f3"
          secondary-color="#e6e6e6"
        >
          <rect
            x="0"
            y="12"
            rx="8"
            ry="8"
            width="220"
            height="16"
          />
        </content-loader>
        <div
          v-for="item in noticeArr"
          v-else
          :key="item.title"
          class="notice-each"
          @click="() => showAggregateDialog(item)"
        >
          {{ item.extra.scroll_title }}
        </div>
      </div>
    </div>

    <div class="main-block flex-all">
      <div
        v-if="!isOtcEnable"
        class="item touch-opacity"
        @click="toInvite"
      >
        <img src="../../assets/images/home/invite.png">
        <span>邀请好友</span>
      </div>
      <div
        v-if="isOtcEnable"
        class="item touch-opacity"
        @click="toFiat"
      >
        <img src="../../assets/images/home/otc.png">
        <span>法币交易</span>
      </div>
      <div
        v-if="isOtcEnable"
        class="item touch-opacity"
        @click="onGoPortfolio"
      >
        <img src="../../assets/images/home/portfolio.png">
        <span>定投计划</span>
      </div>
      <div
        class="item touch-opacity"
        @click="toMining"
      >
        <img src="../../assets/images/home/ttwb.png">
        <span>天天挖币</span>
      </div>
      <div
        class="item touch-opacity homereddot"
        @click="onGoYubibao"
      >
        <img src="../../assets/images/home/ybb.png">
        <span>余币宝</span>
      </div>
      <div
        class="item touch-opacity"
        @click="toGuide"
      >
        <img src="../../assets/images/home/new.png">
        <span>新手指南</span>
      </div>
    </div>

    <div class="tab home-tab-list">
      <scrollTabLabel
        class="pair-top-tab"
        :tabs="tabName"
        :target="tabTarget"
        @change="onTabLabelClick"
      />
    </div>
    <div class="content home-tab-content">
      <ScrollTab v-model="tabTarget">
        <ScrollTabItem id="favorite">
          <TabFavorite
            v-if="tabTarget === 'favorite'"
            ref="favorite"
          />
        </ScrollTabItem>
        <ScrollTabItem id="all">
          <TabAll
            v-if="tabTarget === 'all'"
            ref="all"
          />
        </ScrollTabItem>
        <ScrollTabItem id="exclusive">
          <TabFilter
            v-if="tabTarget === 'exclusive'"
            ref="exclusive"
            filter="exclusive"
          />
        </ScrollTabItem>
        <ScrollTabItem id="stock">
          <StockList v-if="tabTarget === 'stock'" />
        </ScrollTabItem>
      </ScrollTab>
    </div>

    <!-- aggregate exchange dialog -->
    <van-dialog
      v-model="aggregateDialogFlag"
      class="aggregate-dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="aggregate-dialog-box">
        <div class="dialog-title">
          {{ noticeDialogInfo.title }}
        </div>
        <div
          class="dialog-content grayText"
          v-html="noticeDialogInfo.content"
        />
        <van-button
          size="large"
          class="orange-btn bold"
          @click="closeAggregateDialogAndJump"
        >
          {{ noticeDialogInfo.extra.buttons.text }}
        </van-button>
      </div>
      <img
        class="btn-close img-btn-dark"
        src="../../assets/images/icon-close.png"
        width="40"
        @click="closeAggregateDialog"
      >
    </van-dialog>
    <PromoDialog />
  </div>
</template>
<script>
import { DI } from "core"
import { scrollTabLabel, ScrollTab as ScrollTabContainer, Message } from "components"
import TabAll from "../pair/all"
import TabFavorite from "../pair/favorite"
import TabFilter from "../pair/filter"
import stickyHeaders from '../pair/stickyHeaders'
import { ContentLoader } from "vue-content-loader"
import StockList from '../stock/list'
import PromoDialog from "./promoDialog"

const { ScrollTab, ScrollTabItem } = ScrollTabContainer
let globalTabTarget = "all"
let lastScrollPosition = 0
let lableToTop = 0
let globarNoticeArr = []
export default {
  components: {
    scrollTabLabel,
    ScrollTab,
    ScrollTabItem,
    TabAll,
    TabFavorite,
    TabFilter,
    ContentLoader,
    StockList,
    PromoDialog
  },
  data() {
    return {
      aggregateDialogFlag: false,
      tabTarget: null,
      tabName: [
        { value: "favorite", text: this.$t("trade.favorites") },
        { value: "all", text: this.$t("trade.all") },
        { value: "exclusive", text: this.$t("trade.exclusive") }
        // { value: "stock", text: this.$t("trade.stocks") }
      ],
      otcInfo: DI.get('OTC_INFO'),
      aggregateOTCList: DI.get('AGGREGATE_TRANS_SUPPORT_OTC'),
      noticeArr: globarNoticeArr,
      noticeDialogInfo: { extra: { buttons: {} } }
    }
  },
  computed: {
    isOtcEnable() {
      if (this.setting.otc_enabled) return true
      return this.account.enable_otc
    },
    setting() {
      return DI.get("store").state.setting.setting
    },
    account() {
      return DI.get('auth').getUser()
    },
    hideInvite() {
      // apple app store 审核账户 隐藏邀请好友
      if (this.account.identity
        && this.account.identity === '86-11011011011') return true
      return false
    }
  },
  watch: {
    tabTarget: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.tabTarget = globalTabTarget
        } else {
          globalTabTarget = val
          setTimeout(() => {
            const initFunc = this.$refs[val] && this.$refs[val].initChild
            if (initFunc) initFunc()
          })
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.handleScrollPosition)
    this.removeStickyHeadersListener
      && this.removeStickyHeadersListener()
    clearInterval(this.noticeIntervalId)
    next()
  },
  mounted() {
    this.removeStickyHeadersListener = stickyHeaders({
      paddingTop: 48,
      headerClass: '.home-tab-list'
    })
    const labelInfo = document.querySelector('.home-tab-content').getBoundingClientRect()
    lableToTop = labelInfo.top - 48 - 48 + window.pageYOffset
    setTimeout(() => {
      window.scroll(0, lastScrollPosition)
      window.addEventListener("scroll", this.handleScrollPosition)
    }, 100)
    this.fetchNotice()
  },
  methods: {
    fetchNotice() {
      if (globarNoticeArr.length) {
        this.initPlayNotice()
        return
      }
      DI.get('marketHttp').getNotice()
        .then((res) => {
          this.noticeArr = res
          globarNoticeArr = this.noticeArr
          this.initPlayNotice()
        })
        .catch(Message)
    },
    initPlayNotice() {
      if (this.noticeArr.length < 2) return
      let time = 0
      this.noticeIntervalId = setInterval(() => {
        if (time < this.noticeArr.length - 1) {
          time++
        } else {
          time = 0
        }
        const noticeArr = document.querySelectorAll('.notice-each')
        noticeArr.forEach((no) => {
          no.style.transform = `translateY(${time * -40}px)`
        })
      }, 5000)
    },
    toFiat() {
      this.$router.push({ name: "buy" })
    },
    toGuide() {
      this.$router.push({ name: "guide" })
    },
    toInvite() {
      this.$router.push({ name: "myInvite" })
    },
    toMining() {
      this.$router.push({ name: "mining" })
    },
    onGoYubibao() {
      this.$router.push({ name: "yubibao" })
    },
    onGoPortfolio() {
      this.$router.push({ name: "portfolio" })
    },
    // toPosterBibi() {
    //   this.$router.push({ name: "posterBibi" })
    // },
    handleScrollPosition() {
      lastScrollPosition = window.scrollY
    },
    onSearchClick() {
      this.$router.push({
        name: "search",
        query: {
          type: "favorite"
        }
      })
    },
    onTabLabelClick(e) {
      this.tabTarget = e
      this.$nextTick(() => {
        window.scroll(0,
          lastScrollPosition >= lableToTop ? lableToTop : lastScrollPosition
        )
        this.handleScrollPosition()
      })
    },
    showAggregateDialog(noticeDialogInfo) {
      this.noticeDialogInfo = noticeDialogInfo
      this.aggregateDialogFlag = true
    },
    closeAggregateDialog() {
      this.aggregateDialogFlag = false
    },
    closeAggregateDialogAndJump() {
      this.closeAggregateDialog()
      this.$router.push(this.noticeDialogInfo.extra.buttons.url)
    }
  }
}
</script>

<style scoped lang="less">
.home {
  background-color: #F1F2F4;
  padding-top: 48px;
  .white-box {
    background-color: #fff;
  }
  .top {
    position: fixed;
    height: 48px;
    background-color: #4140bb;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    .top-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .logo {
        height: 14px;
        margin-left: 20px;
        padding-right: 20px;
      }
      .search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 32px;
        margin-right: 20px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.1);
        .search-icon {
          width: 28px;
          opacity: 0.5;
        }
        .search-text {
          opacity: 0.5;
          font-size: 14px;
          color: #ffffff;
        }
      }
    }
  }
  .notice-box {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    margin: 0 0 10px;
    .notice {
      height: 20px;
      margin-right: 10px;
      margin-left: 20px;
    }
    .notice-list{
      height: 40px;
      overflow: hidden;
      transition: all 1s ease 0s;
    }
    .notice-each{
      height: 40px;
      line-height: 40px;
      transition: all 1s ease 0s;
    }
    .notice-loading {
      height: 40px;
      width: 220px;
      line-height: 40px;
    }
  }

  .main-block {
    background: #fff;
    padding: 20px;
    margin-bottom: 10px;
    .item {
      width: 18%;
      img {
        margin: 0 auto;
        width: 40px;
        height: 40px;
      }
      span {
        margin-top: 4px;
        display: block;
        font-size: 10px;
        color: #222222;
        text-align: center;
      }
    }
  }

  .banner-box {
    padding: 0 10px;
    margin-bottom: 10px;
    .banner-item {
      flex: 1;
    }
    .banner-part {
      background-color: #fff;
      padding: 0 10px 0 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      border-radius: 3px;
      height: 52px;
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      color: #222;
    }
    .desc {
      font-size: 10px;
      color: #222;
      opacity: 0.3;
    }
    .img-wrap {
      position: absolute;
      right: 8px;
      display: flex;
      height: 52px;
      align-items: center;
    }
  }

  .tab {
    height: 48px;
    background-color: #fff;
    z-index: 10;
  }
  .content {
    padding-top: 1px;
    padding-bottom: 68px;
  }
}

.aggregate-dialog-wrap {
  &.van-dialog {
    overflow: visible;
    width: 80%;
  }
  .btn-close {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: -60px;
  }

  .aggregate-dialog-box {
    padding: 40px 30px;
    .dialog-title {
      text-align: center;
      font-size: 16px;
      color: #000;
      font-weight: bold;
    }
    .dialog-content {
      padding: 20px 0 10px;
      font-size: 12px;
      line-height: 20px;
    }
    .text {
      text-justify: auto;
    }
    .otc-lists {
      display: flex;
      padding-top: 10px;
      flex-wrap: wrap;
      li {
        display: flex;
        width: 50%;
        margin-bottom: 10px;
        justify-content: center;
        .item {
          min-width: 75px;
          text-align: left;
        }
      }
      img {
        margin-right: 8px;
      }
    }
  }
}
</style>
<style lang="less">
.home {
  .tab {
    .pair-top-tab {
      font-size: 14px;
      padding: 0 30px;
      border-bottom: 1px solid #eee;
      li {
        padding: 0 20px 0 0;
        color: rgba(34, 34, 34, 0.3);
      }
      .active {
        color: #222;
      }
      span {
        line-height: 48px;
      }
      .bot {
        background: #4140bb;
      }
    }
  }
  .homereddot {
    position: relative;
  }
  .homereddot::after {
    content: "";
    position: absolute;
    right: 9px;
    top: -1px;
    width: 9px;
    height: 9px;
    background-color: #FF654C;
    border-radius: 4px;
  }
}
</style>
