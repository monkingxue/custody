<template>
  <div class="guide-wrap container-white">
    <section>
      <h2>币币交易简介</h2>
      <p>币币交易，是指在数字货币之间进行的交易（比如用 USDT 买卖 BTC、ETH 等）。在币币交易中，aBTC 提供更多的币种选择、全网最优的买卖价格、更低的手续费。此外，不同于法币【一键购买】，币币交易全天 24 小时都可以进行。</p>
    </section>
    <section class="mt30">
      <h2>操作步骤</h2>
    </section>
    <section>
      <p>第一步：登录后利用上方【搜索】功能，或者在下方列表中选择您想要交易的币种。</p>
      <img
        src="../../assets/images/guide/b1.png"
        width="90%"
      >
    </section>
    <section class="mt30">
      <p>第二步：选择币种后，您可以运用 aBTC 提供的各类信息帮助您进行交易判断。然后点击底部的买卖按钮，即可进入交易页面。</p>
      <img
        src="../../assets/images/guide/b2.jpg"
        width="90%"
      >
    </section>
    <section class="mt30">
      <p>第三步：在交易页面中输入您想要买入（卖出）的数量，点击【买入】或者【卖出】按钮即可完成交易。aBTC 聚合交易会自动按照市场最划算的价格进行成交。</p>
      <img
        src="../../assets/images/guide/b3.jpg"
        width="90%"
      >
    </section>
    <section class="mt30">
      <h2>温馨提示</h2>
      <p>
        在开始币币交易前，需要您先
        <span
          class="link"
          @click="toDeposit"
        >
          【充值】
        </span>
        或者通过法币
        <span
          class="link"
          @click="toFiat"
        >
          【一键购买】
        </span>
        来获得一些数字货币，然后就可以开始您的币币交易之旅。
      </p>
    </section>
    <div class="guide-btn-box">
      <van-button
        class="mt30"
        size="large"
        @click="toPair"
      >
        我已了解，去交易
      </van-button>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
const BIBI_USER_SELECT_CHONGBI = 'BIBI_USER_SELECT_CHONGBI'

export default {
  mounted() {
    this.$nextTick(() => {
      DI.get("utils").setTitle("币币交易指南")
    })
  },
  methods: {
    toDeposit() {
      const target = DI.get('offlineStorage').get(BIBI_USER_SELECT_CHONGBI, 'BTC')
      this.$router.push({
        name: 'deposit',
        query: {
          target,
          from: "home"
        }
      })
    },
    toFiat() {
      this.$router.push({
        name: 'buy',
        query: {
          from: "home"
        }
      })
    },
    toPair() {
      this.$router.push({
        name: "chart",
        params: {
          symbol: "BTC_USDT"
        },
        query: {
          from: "home"
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.guide-wrap {
  height: 100%;
  padding: 40px 0;
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
  .link {
    color: #00C3D2;
  }
  img {
    margin: 10px auto 0;
    width: 100%;
  }
  .guide-btn-box {
    padding: 30px 30px 0;
  }
}
</style>
