<template>
  <div class="guide-wrap container-white">
    <section>
      <h2>法币交易简介</h2>
      <p>法币交易，是指法定货币（比如人民币）与数字货币之间的买卖行为。在 aBTC 平台，您可以使用微信、支付宝、银行卡转账的方式进行数字货币买卖。aBTC 平台提供会最流畅的交易速度，并保障您的资产安全。</p>
    </section>
    <section class="mt30">
      <h2>操作步骤</h2>
    </section>
    <section>
      <p>第一步：登录后，在【首页】选择【一键买卖】。</p>
      <img src="../../assets/images/guide/f1.png">
    </section>
    <section class="mt30">
      <p>第二步：选择您想要购买或者出售的币种，在框中输入想要购买的价格和数量，点击【立即购买】/【立即出售】按钮。</p>
      <img src="../../assets/images/guide/f2.png">
    </section>
    <section class="mt30">
      <p>第三步：选择您的支付/收款方式，确认您的订单无误后，点击【去支付】。（推荐使用支付宝）</p>
      <img src="../../assets/images/guide/f3.jpg">
    </section>
    <section class="mt30">
      <p>第四步：进入付款页面，复制对方的支付宝收款账户，然后打开手机支付宝 App。（微信与手机银行转账也是同样的操作方式）</p>
      <img src="../../assets/images/guide/f4.png">
    </section>
    <section class="mt30">
      <p>第五步：进入支付宝 App，点击转账。</p>
      <img src="../../assets/images/guide/f5.jpg">
    </section>
    <section class="mt30">
      <p>第六步：点击【转到支付宝】。</p>
      <img src="../../assets/images/guide/f6.png">
    </section>
    <section class="mt30">
      <p>第七步：粘贴您刚才复制的收款方式，点击下一步。</p>
      <img src="../../assets/images/guide/f7.png">
    </section>
    <section class="mt30">
      <p>第八步：回到 aBTC App 中复制金额，将其填入支付宝，并确认转账。</p>
      <img src="../../assets/images/guide/f8-1.png">
      <img src="../../assets/images/guide/f8-2.png">
    </section>
    <section class="mt30">
      <p>第九步：转账完成之后，回到 App 点击【我已付款】，1分钟以内您就会收到购买的加密货币。购买流程结束。</p>
      <img src="../../assets/images/guide/f9.png">
    </section>
    <section class="mt30">
      <h2>温馨提示</h2>
      <p>付款完成之后，请务必回到 aBTC App 中点击【我已付款】按钮，以便您的数字货币极速到达。</p>
    </section>
    <div class="guide-btn-box">
      <van-button
        size="large"
        @click="toFiat"
      >
        我已了解，去交易
      </van-button>
      <van-button
        class="mt20"
        size="large"
        @click="toGuideBibi"
      >
        去看币币交易指南
      </van-button>
    </div>
  </div>
</template>
<script>
import { DI } from "core"

export default {
  mounted() {
    this.$nextTick(() => {
      DI.get("utils").setTitle("法币交易指南")
    })
  },
  methods: {
    toFiat() {
      this.$router.push({
        name: 'buy',
        query: {
          from: "home"
        }
      })
    },
    toGuideBibi() {
      this.$router.push({
        name: 'guideBibi'
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
  img {
    margin: 10px auto 0;
    width: 100%;
  }
  .guide-btn-box {
    padding: 30px 30px 0;
  }
}
</style>
