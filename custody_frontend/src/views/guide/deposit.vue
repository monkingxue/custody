<template>
  <div class="guide-wrap container-white">
    <section>
      <h2>充提币功能简介</h2>
      <p class="mb20">
        充提币，是指将数字货币在不同交易所或钱包之间来回转账的过程。在转账过程中，都需依赖唯一性的数字货币地址。
      </p>
      <p class="mb20">
        充币，也称为充值。是指从其它交易平台或者数字货币钱包，把数字资产提到 aBTC 平台的过程。充入的资产，可以自由在法币交易、币币交易、余币宝中使用。
      </p>
      <p>提币，是指将数字货币从 aBTC 钱包转移到其它数字货币交易平台或者钱包的过程。</p>
    </section>
    <section class="mt30">
      <h2>操作步骤</h2>
    </section>
    <section>
      <p>第一步：在 aBTC App 的【钱包】中找到【充币】按钮，点击进入。进入后停留在充币页面，准备进行下一步。</p>
      <img src="../../assets/images/guide/deposit1-1.png">
      <img src="../../assets/images/guide/deposit1-2.png">
    </section>
    <section class="mt30">
      <p>第二步：打开另一平台 App ,找到提币的页面（以火币 App 举例）。进入提币页面后，切回 aBTC App。</p>
      <img src="../../assets/images/guide/deposit2-1.png">
      <img src="../../assets/images/guide/deposit2-2.png">
    </section>
    <section class="mt30">
      <p>第三步：回到 aBTC App，选择需要充值的币种，复制其「充币地址」和「充币标签」（部分币种需要标签，例如 EOS、XRP等），将其填写到火币 App 的提币地址中去。</p>
      <img src="../../assets/images/guide/deposit3-1.png">
      <img src="../../assets/images/guide/deposit3-2.png">
    </section>
    <section class="mt30">
      <p>第四步：最后经过安全验证（邮箱验证，手机短信验证，谷歌验证等）后，数字货币就会在一定时间内自动转入您在 aBTC 的钱包中。</p>
    </section>
    <section class="mt30">
      <h2>温馨提示</h2>
      <p>1. aBTC 提币步骤与上述火币 App 操作一致。</p>
      <p>2. 在充提币操作时，请反复核对地址的正确性。一旦充错地址，数字货币将很难找回。</p>
      <p>3. 根据数字货币的类型不同，区块链拥堵程度不同，需要的转账时间也有所不同。绝大部分币种的转账时间在 2 分钟 ～ 2 小时 之间。</p>
    </section>
    <div class="guide-btn-box">
      <van-button
        size="large"
        @click="toDeposit"
      >
        我已了解，去充币
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
      DI.get("utils").setTitle("充提币指南")
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
    }
  }
}
</script>
<style scoped lang="less">
.guide-wrap {
  height: 100%;
  padding: 40px 0 60px;
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
    padding: 40px 30px 0;
  }
}
</style>
