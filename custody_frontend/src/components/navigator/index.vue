<template>
  <div v-if="visible && !smallScreenHide">
    <nav
      class="footer bacf"
    >
      <van-tabbar
        v-model="activeTab"
        style="height:64px;"
      >
        <van-tabbar-item
          :class="{'in-active': activeTab!==0}"
          @click="toHome"
        >
          <span>{{ $t('tab.trade') }}</span>
          <img
            v-if="activeTab === 0"
            slot="icon"
            src="../../assets/images/nav/icon-home.png"
          >
          <img
            v-else
            slot="icon"
            src="../../assets/images/nav/icon-home-gray.png"
          >
        </van-tabbar-item>
        <van-tabbar-item
          v-if="!isTemplate"
          :class="{'in-active': activeTab!==1}"
          @click="toExplore"
        >
          <span>{{ $t('tab.explore') }}</span>
          <img
            v-if="activeTab === 1"
            slot="icon"
            src="../../assets/images/nav/icon-explore.png"
          >
          <img
            v-else
            slot="icon"
            src="../../assets/images/nav/icon-explore-gray.png"
          >
        </van-tabbar-item>
        <van-tabbar-item
          v-if="!isTemplate"
          :class="{'in-active': activeTab!==2}"
          @click="toWallet"
        >
          <span>{{ $t('tab.wallet') }}</span>
          <img
            v-if="activeTab === 2"
            slot="icon"
            src="../../assets/images/nav/icon-wallet.png"
          >
          <img
            v-else
            slot="icon"
            src="../../assets/images/nav/icon-wallet-gray.png"
          >
        </van-tabbar-item>
        <van-tabbar-item
          :class="{'in-active': activeTab!==3, 'reddot': isMyRedDot}"
          @click="toAccount"
        >
          <span>{{ $t('tab.mine') }}</span>
          <img
            v-if="activeTab === 3"
            slot="icon"
            src="../../assets/images/nav/icon-account.png"
          >
          <img
            v-else
            slot="icon"
            src="../../assets/images/nav/icon-account-gray.png"
          >
        </van-tabbar-item>
      </van-tabbar>
    </nav>
  </div>
</template>

<script>
import { DI } from 'core'
import RedDot from '../../views/myInvite/reddot'

export default {
  mixins: [RedDot],
  props: {
    isTemplate: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      visible: false,
      smallScreenHide: false,
      activeTab: 0,
      initBodyHeight: this.getBodyHeigth()
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        const { name } = val
        if (name === 'home') {
          this.activeTab = 0
          this.visible = true
          DI.get('utils').appVibrate()
        } else if (name === 'explore') {
          this.activeTab = 1
          this.visible = true
          DI.get('utils').appVibrate()
        } else if (name === 'wallet') {
          this.activeTab = 2
          this.visible = true
          DI.get('utils').appVibrate()
        } else if (name === 'account') {
          this.activeTab = 3
          this.visible = true
          DI.get('utils').appVibrate()
          this.setMyTipsLocal()
        } else {
          this.visible = false
        }
      }
    },
    inviteData: {
      immediate: true,
      handler() {
        this.setMyTipsLocal()
      }
    },
    rebateData: {
      immediate: true,
      handler() {
        this.setMyTipsLocal()
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)

    if (DI.get("auth").getToken().token) {
      DI.get("store").dispatch("SYNC_INVITE")
      DI.get("store").dispatch("SYNC_REBATE")
      this.setMyTipsLocal()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    getBodyHeigth() {
      return document.body.clientHeight
    },
    handleResize() {
      if (this.getBodyHeigth() < (this.initBodyHeight * 0.8)) {
        this.smallScreenHide = true
      } else {
        this.smallScreenHide = false
      }
    },
    toHome(){
      this.$router.push({ name: 'home' })
    },
    toExplore(){
      this.$router.push({ name: 'explore' })
    },
    toWallet() {
      this.$router.push({ name: 'wallet' })
    },
    toAccount(){
      this.$router.push({ name: 'account' })
    }
  }
}
</script>
<style lang="less">
.nav-pad {
  height: 70px;
  width: 100%;
}
.footer {
  position:fixed;
  bottom:0;
  left:0;
  width:100%;
  background:#fff;
  z-index: 999;
}
.van-tabbar {
  box-shadow: 0 -1px 8px 0 rgba(0,0,0,.1);
  margin: 0 auto;
  right: 0;
}
.footer .in-active {
  .van-tabbar-item__text{
    opacity: .3;
  }
}
.van-tabbar-item:active{
  opacity: .7;
}
.van-tabbar-item--active,.van-tabbar-item {
  color: #222222!important
}
.van-tabbar-item__icon img {
  height: 26px !important;
}
.footer-margin {
  margin-bottom:74px;
}
.van-tabbar-item::after {
  right: 50%;
  top: 50%;
  margin: -20px -12px 0 0;
}
.van-tabbar-item__text{
  font-size: 12px; // 防止有的浏览器不兼容 12px以下
  font-size: 10px;
}
</style>
