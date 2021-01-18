<template>
  <div
    v-if="visible && isMainPage"
    class="download-banner"
    :class="{init: init}"
  >
    <img
      class="banner-img"
      src="../../assets/images/app-download.png"
    >
    <div class="banner-top flex-left-right">
      <div
        class="close"
        @click="closeBanner"
      >
        <img
          src="../../assets/images/close.png"
        >
      </div>
      <div class="title">
        <div>aBTC.one</div>
        <div class="title-sub">
          {{ $t('download.slogan') }}
        </div>
      </div>
      <div class="btn">
        <span @click="goToDownload">{{ $t('me.downloadApp') }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang='less'>
@keyframes MoveDown {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(0); }
}
.download-banner {
  height: 0;
  padding-bottom: 18.13%;
  background: #0C123F;
  .banner-img {
    width: 100%;
  }
  &.init {
    animation: MoveDown .3s linear;
  }position: relative;
  .banner-top {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #FFF;
    align-items: center;
    font-size: 14px;
    .close {
      height: 100%;
      width: 6%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        margin-left: 20%;
        height: 20px;
        width: 20px;
      }
    }
    .title {
      flex: 1;
      margin-left: 80px;
    }
    .title-sub {
      color: #999;
      font-size: 12px;
    }
    .btn {
      padding: 5px 8px;
      background: #00C3D2;
      border-radius: 5px;
      min-width: 100px;
      text-align: center;
      margin-right: 15px;
      margin-left: 5px;
      opacity: 0;
    }
  }
}
</style>
<script>
import { DI } from 'core'

const USER_HIDE_APP_BANNER = 'USER_HIDE_APP_BANNER'

export default {
  data() {
    return {
      visible: false,
      init: false
    }
  },
  computed: {
    isMainPage() {
      return ['account', 'wallet', 'explore']
        .indexOf(this.$route.name) > -1
    },
    storeSetting() {
      return DI.get("store").state.setting.setting
    }
  },
  mounted() {
    if (DI.get('utils').isFromApp()) return
    if (this.$dayjs().diff(
      this.$dayjs(+DI.get('offlineStorage').get(USER_HIDE_APP_BANNER)), 'h'
    ) < 24) return
    this.visible = true
  },
  methods: {
    closeBanner() {
      this.visible = false
      DI.get('offlineStorage').set(USER_HIDE_APP_BANNER, this.$dayjs().valueOf())
    },
    goToDownload() {
      DI.get('utils').goToDownloadApp(this.storeSetting)
    }
  }
}
</script>
