<template>
  <div class="container">
    <div class="drawcontent">
      <div
        class="orangeclock "
        style="margin-top: 10vh;"
      >
        <p class="tc">
          <img
            src="../assets/images/withdrawPending.svg"
            width="60"
            style="margin:0 auto;"
          >
        </p>
      </div>
      <p class="mt20 font18 bold tc">
        {{ $t('tips25') }}
      </p>
      <div class="mt40">
        <van-button
          size="large"
          round
          class="orange-btn"
          @click="tomine"
        >
          {{ $t('confirm') }}
        </van-button>
      </div>
      <div class="drawtip graycolor mt15">
        <p>{{ $t('notice') }}:</p>
        <p>* 您的提币申请已被托管aBTC机器人，正在为您安排转出，如在区块链转账高峰期，可能需要数小时才能到账，请您耐心等待。</p>
      </div>
    </div>
  </div>
</template>
<script>
// TODO: Deprecated 20190812
import { DI } from 'core'
export default {
  data() {
    return {
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('withdraw'))
  },
  methods: {
    tomine(){
      this.$router.push({
        name: 'asset',
        query: {
          target: this.$route.query.target || 'BTC'
        }
      })
    }
  }
}
</script>
<style scoped>

.drawcontent{
  padding:40px;
}
.van-uploader{
  vertical-align: middle;
}
.uploadpic{
  padding:20px;
  background: #fafefe;
  border:1px dashed #04d2b1;
  border-radius:4px;

}
</style>
