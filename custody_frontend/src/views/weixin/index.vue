<template>
  <div class="weixin">
    <div class="main">
      <div class="copy">
        <span>宝二爷微信</span>
        <CopyButton
          text="guo_hongcai"
        />
      </div>
      <div class="copy">
        <span>aBTC客服微信</span>
        <CopyButton
          :text="customWechat"
        />
      </div>
      <img
        class="qrimg"
        :src="imgStr"
      >
      <van-button
        size="large"
        round
        class="orange-btn mt30"
        @click="saveImg"
      >
        {{ $t('me.saveQRCode') }}
      </van-button>
      <div class="drawtip graycolor mt20">
        <p>*请添加管理员为好友，管理员会把你拉到交流群中</p>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { CopyButton } from 'components'

export default {
  components: {
    CopyButton
  },
  data() {
    return {
      imgStr: DI.get("CUSTOMER_SERVICE_WECHAT_QRCODE"),
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t("me.joinSNS"))
  },
  methods: {
    saveImg() {
      if (DI.get('utils').isFromApp()) {
        DI.get('utils').appSaveImg(this.imgStr)
      } else {
        this.$router.push({
          name: 'imgPreview',
          params: {
            img: this.imgStr
          }
        })
      }
    }
  }
}
</script>
<style>
.copy .icon-copy{
  width:20px;
  height:20px;
}
</style>
<style scoped lang="less">
.weixin {
  background: #FFF;
  min-height: 95vh;
  .main {
    padding: 40px 40px 0;
  }
  .qrimg {
    margin-top: 10px;
  }
  .copy {
    font-size: 16px;
    padding: 10px 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
  }
}
</style>
