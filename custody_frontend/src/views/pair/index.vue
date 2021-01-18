<template>
  <div class="pair">
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
          <span class="search-text">搜索币种</span>
        </div>
      </div>
    </div>
    <div class="tab">
      <scrollTabLabel
        class="pair-top-tab"
        :tabs="tabName"
        :target="tabTarget"
        @change="onTabLabelClick"
      />
    </div>
    <div class="content">
      <ScrollTab
        v-model="tabTarget"
      >
        <ScrollTabItem
          id="favorite"
        >
          <TabFavorite
            ref="favorite"
          />
        </ScrollTabItem>
        <ScrollTabItem
          id="all"
        >
          <TabAll
            ref="all"
          />
        </ScrollTabItem>
        <ScrollTabItem
          id="ieo"
        >
          <TabFilter
            ref="ieo"
            filter="ieo"
          />
        </ScrollTabItem>
        <ScrollTabItem
          id="exclusive"
        >
          <TabFilter
            ref="exclusive"
            filter="exclusive"
          />
        </ScrollTabItem>
      </ScrollTab>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { scrollTabLabel, ScrollTab as ScrollTabContainer } from 'components'
import TabAll from './all'
import TabFavorite from './favorite'
import TabFilter from './filter'
const { ScrollTab, ScrollTabItem } = ScrollTabContainer
let globalTabTarget = 'all'
let lastScrollPosition = 0
export default {
  components: {
    scrollTabLabel,
    ScrollTab,
    ScrollTabItem,
    TabAll,
    TabFavorite,
    TabFilter
  },
  data() {
    return {
      tabTarget: null,
      tabName: [
        { value: 'favorite',
          text: '自选' },
        { value: 'all',
          text: '全部' },
        { value: 'exclusive',
          text: '交易所热门' },
        { value: 'ieo',
          text: 'IEO' }
      ]
    }
  },
  computed: {
    biInfo() {
      return DI.get("store").state.setting.biInfo
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
          const initFunc = this.$refs[val] && this.$refs[val].initChild
          if (initFunc) initFunc()
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.handleScrollPosition)
    next()
  },
  mounted() {
    if (lastScrollPosition >= 0) {
      window.scroll(0, lastScrollPosition)
      lastScrollPosition = 0
    }
    window.addEventListener('scroll', this.handleScrollPosition)
  },
  methods: {
    handleScrollPosition() {
      lastScrollPosition = window.scrollY
    },
    onSearchClick() {
      this.$router.push({ name: 'search', query: {
        type: 'favorite'
      } })
    },
    onTabLabelClick(e) {
      this.tabTarget = e
      this.$nextTick(() => {
        window.scroll(0, 0)
        lastScrollPosition = 0
      })
    }
  }
}
</script>

<style scoped lang="less">
.pair {
  background-color: #f1f2f4;
  .top {
    position: fixed;
    height: 48px;
    background-color: #4140bb;
    left: 0;
    right: 0;
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
        width: 100%;
        margin-right: 20px;
        border-radius: 2px;
        background: rgba(255,255,255, .1);
        .search-icon {
          width: 28px;
          opacity: .3;
        }
        .search-text {
          opacity: 0.3;
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }
  }
  .tab {
    position: fixed;
    top: 48px;
    height: 40px;
    background-color: #4140bb;
    left: 0;
    right: 0;
    z-index: 9;
  }
  .content {
    min-height: calc(100vh - 88px);
    padding-top: 88px;
    // padding-bottom: 64px;
  }
}
</style>
<style lang="less">
.pair {
  .tab {
    .pair-top-tab {
      font-size: 14px;
      padding: 0 30px;
      ul {
        justify-content: space-between;
      }
      li {
        padding: 0;
      }
      span {
        line-height: 40px;
      }
    }
  }
}
</style>
