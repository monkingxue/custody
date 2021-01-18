<template>
  <div class="wallet">
    <span
      v-for="item in Object.keys(BIimgs)"
      :key="item"
      :ref="`BI_${item}`"
      class="hide bi_img"
      :class="`BI_${item}`"
    >
      <img
        :src="BIimgs[item].icon"
      >
    </span>
    <div
      v-if="step === 1"
      ref="topText"
      class="top-text"
    >
      <h2>aBTC 2.0 钱包升级</h2>
      <span>冷热钱包，多重签名</span>
    </div>
    <img
      ref="wallet"
      class="wallet-center"
      src="../../assets/images/wallet-intro.png"
    >
    <div
      ref="mainText"
      class="main-text"
    >
      <van-button
        v-if="step === 1"
        size="large"
        class="orange-btn"
        @click="init"
      >
        更新到钱包2.0
      </van-button>
      <template v-else>
        <img
          v-if="step === 5"
          src="../../assets/images/wallet-done.gif"
        >
        <img
          v-else
          src="../../assets/images/wallet-loading.gif"
        >
        <span v-if="step === 2">正在为您更新…</span>
        <span v-else-if="step === 3">24小时自由充提</span>
        <div v-else-if="step === 4">
          <span>自动存入冷钱包机制</span><br>
          <span>保证资产安全</span>
        </div>
        <div v-else-if="step === 5">
          <span>更新成功</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.wallet {
  position: relative;
  .hide {
    display: none;
  }
  .top-text {
    position: absolute;
    z-index: 0;
    text-align: center;
    h2 {
      font-size: 30px;
      font-weight: bold;
    }
    span {
      font-size: 15px;
      line-height: 35px;
    }
  }
  .main-text {
    position: absolute;
    z-index: 0;
    text-align: center;
    span {
      font-size: 15px;
      color: #666;
    }
    span:first-of-type {
      margin-top: 40px;
    }
    img {
      height: 25px;
      width: 25px;
      display: block;
      margin: -5px auto 15px;
    }
  }
  .bi_img {
    position: absolute;
    transition: all 1s ease 0s;
    z-index: 1;
    box-shadow: 5px 5px 4px rgba(0,0,0,.3);
    border-radius: 100px;
  }
  .fadeIn {
    animation: fadeIn 1s ease;
  }
  .fadeOut {
    animation: fadeOut 1.5s;
  }
  .jump {
    animation: jump 4s ease-in-out infinite;
  }
  .wallet-center {
    position: absolute;
    z-index: 0;
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    25% {
      opacity: 0.5;
      transform: scale(0.4);
    }
    75% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(0px,5px);
    }
    to {
      opacity: 1;
      transform: translate(0px,0px);
    }
  }
  @keyframes jump {
    0% {
      transform:  translate(0px,0px)  ;
    }
    25% {
      transform:  translate(0px,3px)  ;
    }
    50% {
      transform:  translate(0px,0px)  ;
    }
    75% {
      transform:  translate(0px,3px)  ;
    }
    100% {
      transform:  translate(0px,0px)  ;
    }
  }
}
</style>

<script>
import { DI } from 'core'
const height = window.innerHeight
const halfHeight = height * 0.5
const width = window.innerWidth
const halfWidth = width * 0.5
const ratio = height / width
const biSize = 28 * ratio
const setting = {
  BTC: {
    x: 0.04,
    y: 0.43,
    scale: 1.8,
    rotate: 0,
    icon: require('../../assets/images/BII_BTC.png')
  },
  USDT: {
    x: 0.57,
    y: 0.49,
    scale: 1.1,
    rotate: 30,
    icon: require('../../assets/images/BII_USDT.png')
  },
  ETH: {
    x: 0.78,
    y: 0.33,
    scale: 1.2,
    rotate: 0,
    icon: require('../../assets/images/BII_ETH.png')
  },
  EOS: {
    x: 0.31,
    y: 0.3,
    scale: 1.1,
    rotate: 25,
    icon: require('../../assets/images/bi/bi_eos.png')
  },
  XRP: {
    x: 0.26,
    y: 0.59,
    scale: 0.9,
    rotate: -15,
    icon: require('../../assets/images/BII_XRP.png')
  },
  BNB: {
    x: 0.21,
    y: 0.22,
    scale: 0.8,
    rotate: 0,
    icon: require('../../assets/images/BII_BNB.png')
  },
  HT: {
    x: 0.41,
    y: 0.14,
    scale: 0.7,
    rotate: -15,
    icon: require('../../assets/images/BII_HT.png')
  },
  TRX: {
    x: 0.6,
    y: 0.22,
    scale: 0.92,
    rotate: 0,
    icon: require('../../assets/images/BII_TRX.png')
  }
}
export default {
  data() {
    return {
      BIimgs: setting,
      step: 1
    }
  },
  computed: {
    isAuthenticated() {
      return DI.get('auth').isAuthenticated()
    }
  },
  mounted() {
    const wallet = this.$refs.wallet
    const mainText = this.$refs.mainText
    const topText = this.$refs.topText
    const initWidth = width * 0.38 * ratio
    const initLeft = (width - initWidth) * 0.5
    const commonWidth = width * 0.8
    const commonLeft = width * 0.1
    wallet.style.top = `${halfHeight - width * 0.23 * ratio}px`
    wallet.style.width = `${initWidth}px`
    wallet.style.left = `${initLeft}px`
    mainText.style.top = `${halfHeight + width * 0.23 * ratio}px`
    mainText.style.width = `${commonWidth}px`
    mainText.style.left = `${commonLeft}px`
    topText.style.top = `${width * 0.1 * ratio}px`
    topText.style.width = `${commonWidth}px`
    topText.style.left = `${commonLeft}px`
    Object.keys(this.BIimgs).forEach((bi) => {
      this[`BI_${bi}`] = this.$refs[`BI_${bi}`][0]
    })
  },
  methods: {
    init() {
      if (!this.isAuthenticated) {
        this.$router.push({
          name: "login"
        })
        return
      }
      Object.keys(setting).forEach((each) => {
        const config = setting[each]
        this[`BI_${each}`].style.top = `${config.y * height}px`
        this[`BI_${each}`].style.height = `${config.scale * biSize}px`
        this[`BI_${each}`].style.width = `${config.scale * biSize}px`
        this[`BI_${each}`].style.left = `${config.x * width}px`
        this[`BI_${each}`].querySelector('img').style.transform = `rotate(${config.rotate}deg)`
        this[`BI_${each}`].classList.add('fadeIn')
      })
      let step = 0
      const intervalId = setInterval(() => {
        if (step > 10) clearInterval(intervalId)
        this.process(step)
        step += 1
      }, 500)
      this.step = 2
    },
    process(step) {
      switch (step) {
      case 0:
        this.showBi('BTC')
        break
      case 1:
        this.showBi('USDT')
        break
      case 2:
        this.showBi('ETH')
        break
      case 3:
        this.showBi('EOS')
        this.step = 3
        break
      case 4:
        this.showBi('BNB')
        break
      case 5:
        this.showBi('XRP')
        break
      case 6:
        this.showBi('HT')
        this.showBi('TRX')
        this.step = 4
        break
      case 9:
        this.center()
        break
      }
    },
    showBi(bi) {
      this[`BI_${bi}`].classList.remove('hide')
      setTimeout(() => {
        this[`BI_${bi}`].classList.remove('fadeIn')
        this[`BI_${bi}`].classList.add('jump')
      }, 1000)
    },
    center() {
      Object.keys(setting).forEach((each) => {
        const config = setting[each]
        this[`BI_${each}`].style.top = `${halfHeight - config.scale * biSize}px`
        this[`BI_${each}`].style.left = `${halfWidth - config.scale * biSize}px`
        this[`BI_${each}`].classList.remove('jump')
        this[`BI_${each}`].classList.add('fadeOut')
        setTimeout(() => {
          this[`BI_${each}`].classList.add('hide')
          this.step = 5
          setTimeout(() => {
            this.$emit('done')
          }, 2000)
        }, 800)
      })
    }
  }
}
</script>
