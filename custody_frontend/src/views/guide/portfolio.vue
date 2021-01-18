<template>
  <div class="guide-wrap container-white">
    <img
      class="img-no-margin"
      src="../../assets/images/guide/portfolio-0.png"
    >
    <section class="mt30">
      <h2>定投简介</h2>
      <p>定投，即指在固定的时间以固定的金额分批次购买指定的币种。</p>
      <p class="mt30">
        在aBTC定投，您可以自由地配置投资组合，实现一键购买多个投资标的，省心省力。
      </p>
    </section>
    <section class="mt30">
      <h2>如何正确定投</h2>
      <p>1. 行情下行，坚持定投，能有效平摊投资成本。</p>
      <p>2. 行情筑底，坚持定投，能以较低成本积攒更多份额。</p>
      <p>3. 行情回升，适度止盈，获利卖出。</p>
      <img
        src="../../assets/images/guide/portfolio-1.png"
      >
    </section>
    <section class="mt30">
      <h2>定投操作</h2>
      <img
        src="../../assets/images/guide/portfolio-2.png"
      >
      <img
        src="../../assets/images/guide/portfolio-3.png"
      >
    </section>
    <section class="mt30">
      <h2>定投小建议</h2>
      <p>1、关注长期收益，不计较眼前的得失。</p>
      <p>2、建议投资主流币价值币。</p>
      <p>3、定投被称为熊市最佳伴侣，越是熊市越不能放弃，熊市是低价吸筹最好的时候，也是分摊持仓成本最佳时机。</p>
      <p>4、定投不需要止损，但需要止盈，设置合适的心理止盈价，在牛市时分批出仓。</p>
    </section>
    <div class="guide-btn-box">
      <van-button
        size="large"
        class="orange-btn"
        @click="toInvest"
      >
        开始定投
      </van-button>
    </div>
    <HeaderRightShare />
  </div>
</template>
<script>
import { DI } from "core"
import { HeaderRightShare } from 'components'

export default {
  components: {
    HeaderRightShare
  },
  mounted() {
    this.$nextTick(() => {
      DI.get("utils").setTitle("定投指南")
    })
  },
  methods: {
    toInvest() {
      const { fromRoute } = this.$route.query
      if (fromRoute === 'portfolio') {
        this.$router.go(-1)
        return
      }
      this.$router.push({
        name: 'portfolio'
      })
    }
  }
}
</script>
<style scoped lang="less">
.guide-wrap {
  height: 100%;
  padding: 0  0 40px;
  h2 {
    font-size: 16px;
    color: #000;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  p {
    font-size: 14px;
    color: rgba(34, 34, 34, 0.6);
    line-height: 22px;
    padding: 0 10%;
    text-align: justify;
  }
  img {
    margin: 10px auto 0;
    width: 100%;
  }
  .img-no-margin {
    margin: 0;
  }
  .guide-btn-box {
    padding: 30px 30px 0;
  }
}
</style>
