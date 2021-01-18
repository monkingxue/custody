<template>
  <div class="download container-white">
    <div class="top">
      <img src="../../assets/images/download-app-icon.png">
      <div class="intro">
        <div class="title">
          aBTC.one
        </div>
        <div class="title-sub">
          每个人都应有一枚比特币
        </div>
        <div class="btn">
          <van-button
            size="large"
            round
            class="orange-btn center-btn"
            @click="goToDownload"
          >
            <div class="btn-inside">
              <img src="../../assets/images/icon16.png">
              <span>下载APP</span>
            </div>
          </van-button>
        </div>
      </div>
    </div>
    <div
      v-if="!isFromAndroid"
      class="intro-img"
    >
      <img src="../../assets/images/download-intro.png">
    </div>
  </div>
</template>

<script>
import { DI } from 'core'
export default {
  data() {
    return {
      isFromAndroid: DI.get('utils').isFromAndroid()
    }
  },
  computed: {
    storeSetting() {
      return DI.get("store").state.setting.setting
    }
  },
  mounted() {
    DI.get('utils').setTitle('APP下载')
  },
  methods: {
    goToDownload() {
      DI.get('utils').goToDownloadApp(this.storeSetting)
    }
  }
}
</script>

<style scoped lang="less">
.download {
  .top {
    margin-top: -5%;
    position: relative;
    .intro {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      text-align: center;
      color: #999;
      font-size: 14px;
      .title {
        margin-top: 34%;
        font-size: 20px;
        color: #333;
      }
      .title-sub {
        margin-top: 2%;
      }
      .btn {
        width: 70%;
        margin: 10px auto;
      }
      .btn-inside {
        font-size: 16px;
        line-height: 16px;
        color: #FFF;
        img {
          display: inline-block;
          width: 16px;
          vertical-align: top;
        }
      }
    }
  }
  .intro-img {
    padding: 80px 40px 10px;
  }
}
</style>
