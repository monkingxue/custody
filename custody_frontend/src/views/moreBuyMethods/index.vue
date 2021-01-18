<template>
  <div class="more-buy-methods container-white">
    <section>
      <h2>第一步</h2>
      <p>若法币无法直接购买您想要的币种，请先在【一键购买】中购买稳定币 USDT。</p>
      <img src="../../assets/images/more-buy-methods1.png">
    </section>
    <section class="mt30">
      <h2>第二步</h2>
      <p>完成 USDT 购买后，回到首页，使用【搜索】找到想要购买的币种，使用 USDT 进行买卖。</p>
      <img src="../../assets/images/more-buy-methods2.png">
    </section>
    <section class="guide-btn-box">
      <van-button
        class="orange-btn"
        size="large"
        @click="goToPair"
      >
        去购买 USDT
      </van-button>
      <van-button
        class="mt20"
        size="large"
        @click="goGuide"
      >
        新手指南
      </van-button>
    </section>
  </div>
</template>
<script>
import { DI } from "core"

export default {
  mounted() {
    DI.get("utils").setTitle("更多币种购买方式")
  },
  methods: {
    goToPair() {
      DI.get('offlineStorage').set("USER_SELECT_BI", "USDT")
      this.$router.go(-1)
    },
    goGuide() {
      this.$router.push({ 
        name: 'guide',
        query: {
          from: "home"
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.more-buy-methods {
  height: 100%;
  padding: 40px 0;
  h2 {
    text-align: center;
    font-size: 16px;
    color: #000;
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
    color: rgba(34, 34, 34, 0.6);
    line-height: 22px;
    padding: 0 40px;
  }
  img {
    margin: 10px auto 0;
  }
  .guide-btn-box {
    margin-top: 40px;
    padding: 0 40px;
  }
}
</style>
