<template>
  <div class="setting">
    <div>
      <div class="top-tip">
        <template v-if="index === 0">
          <div
            class="download"
            @click="onGoDownload"
          >
            1. 下载谷歌验证器 (<span>Google Authenticator</span>)
          </div>
        </template>
        <template v-if="index === 1">
          2. 选择手动输入验证码
        </template>
        <template v-if="index === 2">
          3. 添加一个 aBTC 账户，并手动输入16位密钥
        </template>
        <template v-if="index === 3">
          4. 将生成的6位验证码填入aBTC.one中
        </template>
      </div>
      <div class="swipe">
        <van-swipe
          ref="swipe"
          indicator-color="#00C3D2"
          :loop="false"
          @change="onImgChange"
        >
          <van-swipe-item
            v-for="item in imageArr"
            :key="item"
          >
            <div class="imgItem">
              <img :src="item">
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div
      v-if="index === 3"
      class="bottom"
    >
      <van-button
        size="large"
        round
        class="orange-btn"
        @click="onGoNext"
      >
        {{ `${ index !== 3 ? '下一步' : '我已知晓' }` }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { DI } from 'core'

export default {
  data() {
    return {
      index: 0,
      imageArr: [
        require('../../assets/images/2fa/slide1.png'),
        require('../../assets/images/2fa/slide2.png'),
        require('../../assets/images/2fa/slide3.png'),
        require('../../assets/images/2fa/slide4.png')
      ]
    }
  },
  mounted() {
    DI.get("utils").setTitle('设置验证码')
  },
  methods: {
    onGoNext() {
      this.index += 1
      if (this.index === 4) {
        this.$router.go(-1)
        return
      }
      this.$refs.swipe.swipeTo(this.index)
    },
    onImgChange(e) {
      this.index = e
    },
    onGoDownload() {
      let url = 'https://shouji.baidu.com/software/22417419.html'
      if (DI.get("utils").isFromiOS()) {
        url = 'https://apps.apple.com/us/app/google-authenticator/id388497605'
      }
      window.location = url
    }
  }
}
</script>

<style scoped lang="less">
.setting {
  padding: 30px;
  .top-tip {
    font-size: 14px;
    color: #222222;
    text-align: center;
    padding-bottom: 20%;
    padding-top: 10px;
  }
  .download {
    opacity: 0.6;
    font-size: 12px;
    color: #222222;
    text-align: center;
    span {
      color: #04C3D2;
    }
  }
  .swipe {
    width: 90%;
    margin: 0 auto;
  }
  .imgItem {
    padding-bottom: 70px;
  }
  /deep/ .van-swipe__indicators {
      bottom : 0px;
    }
  .bottom {
    position: fixed;
    bottom: 40px;
    left: 30px;
    right: 30px;
  }
}
</style>
