<template>
  <div class="ranking-wrap">
    <div
      v-if="isFromApp"
      class="share-btn"
      @click="appShare"
    >
      <img src="../../assets/images/icon-share.png">
    </div>
    <van-tabs
      v-model="active"
      background="#4140BB"
      color="#FFF"
      title-inactive-color="#B3B2E3"
      title-active-color="#FFF"
      :swipe-threshold="5"
      :scrollspy="true"
      :offset-top="44"
      :sticky="true"
      @click="changeRankType"
    >
      <van-tab
        v-for="index in tabItems"
        :key="index.title"
        :title="index.name"
        :name="index.title"
      >
        <TabMain
          v-if="type && type === index.title"
          :type="type"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { DI } from "core"
import { Tabs, Tab } from "vant"
import TabMain from './tabMain'
let lastType
let routerFrom = {}
let lastScrollPosition = 0
export default {
  components: {
    TabMain,
    'van-tab': Tab,
    'van-tabs': Tabs
  },
  data() {
    return {
      type: "",
      active: "",
      tabItems: [
        {
          name: '热搜',
          title: 'hotSearch'
        },
        {
          name: '市值',
          title: 'marketValue'
        },
        {
          name: '成交额',
          title: 'tradeVolume'
        },
        {
          name: '涨跌幅',
          title: 'priceChange'
        },
        {
          name: '平台币',
          title: 'platformCoin'
        },
        {
          name: 'IEO',
          title: 'ieo'
        },
        {
          name: 'BTC占比',
          title: 'cryptoMarketCap'
        },
        {
          name: '场外溢价',
          title: 'otcPremium'
        }
      ]
    }
  },
  computed: {
    isFromApp() {
      return DI.get('utils').isFromApp()
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        if (!val) return
        this.active = val
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.handleScrollPosition)
    next()
  },
  beforeRouteEnter(to, from, next) {
    routerFrom = from
    next()
  },
  mounted() {
    const { query } = this.$route
    this.type = query.type
    // 回退跳转到上次tab
    if (lastType && routerFrom.name !== 'explore') {
      this.type = lastType
    }
    lastType = this.type
    this.$nextTick(() => {
      DI.get('utils').setBody('bacgray')
      DI.get("utils").setTitle("")
    })
    setTimeout(() => {
      window.scroll(0, lastScrollPosition)
      window.addEventListener("scroll", this.handleScrollPosition)
    }, 100)
  },
  methods: {
    handleScrollPosition() {
      lastScrollPosition = window.scrollY
    },
    appShare() {
      DI.get('utils').toggleBodyClass('app-share-wrap')
      setTimeout(() => {
        DI.get("utils").appScreenshot()
      }, 100)
      setTimeout(() => {
        DI.get('utils').toggleBodyClass('app-share-wrap')
      }, 110)
    },
    changeRankType(index) {
      this.type = index
      lastType = this.type
      this.$nextTick(() => {
        window.scroll(0, 0)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.share-btn {
  z-index: 99;
  position: fixed;
  top: 12px;
  right: 20px;
  width: 18px;
  height: 40px;
}
</style>
<style lang="less">
.ranking-wrap {
  .van-hairline--top-bottom::after {
    border-width: 0 0;
  }
  .van-tab--active span {
    font-weight: bold;
  }
}
.ranking-tips {
  .van-dialog__message {
    font-size: 13px;
  }
}
</style>
