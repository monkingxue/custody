<template>
  <div class="red">
    <div class="red-target">
      <ul>
        <li
          v-for="item in Object.keys(redType)"
          :key="item"
          :class="[{active: redTarget === item}, 'img-btn-bright']"
          @click="() => onTargetClick(item)"
        >
          {{ redType[item] }}
        </li>
      </ul>
    </div>
    <div class="bu-body rel">
      <div class="comm-inputcon bu-input redEnvelope-input mt30 din">
        <span class="graycolor">{{ $t('amount') }}</span>
        <van-field
          v-model="amount"
          type="number"
        />
        <span class="graycolor laber-for-right">{{ $t('yuan') }}</span>
      </div>
      <div class="comm-inputcon bu-input redEnvelope-input mt30">
        <van-field
          v-model="content"
          class="lh50"
        />
      </div>
    </div>
    <div
      class="tip"
      @click="showRedTip"
    >
      <img src="../../assets/images/icon18.png">
      <span>红包使用说明</span>
    </div>
    <img
      class="img-preview"
      :src="imgType[redTarget]"
    >
    <div class="red-button">
      <van-button
        class="red-btn"
        size="large"
        round
        :disabled="!showPopupBtnEnabled"
        @click="showPopup"
      >
        <span>发红包</span>
      </van-button>
    </div>
    <div class="btc-amount">
      {{ btcAmount }} BTC
    </div>
    <van-popup
      id="redPopup"
      v-model="show"
      position="bottom"
    >
      <div class="pd20 red-popup">
        <div class="title">
          发{{ redType[redTarget] }}红包
        </div>
        <div class="info commflex">
          <div class="left">
            红包总金额
          </div>
          <div class="right">
            {{ btcAmount }}BTC = {{ amount }} 元
          </div>
        </div>
        <div class="info commflex">
          <div class="left">
            寄语
          </div>
          <div class="right">
            {{ content }}
          </div>
        </div>
        <PasswordInput
          :hide-pass="true"
          class="red-pass"
          :red-active="true"
          :auto-focus="false"
          @onChange="onPassChange"
        />
        <van-button
          size="large"
          class="red-btn"
          round
          :disabled="!confirmEnabled"
          @click="onConfirm"
        >
          <span>确认支付</span>
        </van-button>
        <van-button
          size="large"
          class="red-btn withdraw-cancel-btn"
          round
          @click="hidePopup"
        >
          <span>取消</span>
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { DI } from 'core'
import { Dialog } from 'vant'
import { PasswordInput, Message, Indicator } from 'components'

const contentType = {
  roman: '呐，你就像比特币一样可爱',
  birth: '有人送过你比特币当生日礼物吗',
  facai: '送你比特币 富贵财生财',
  zhongqiu: '月饼馅儿是比特币噢'
}
const amountType = {
  roman: '52.0',
  birth: 18.8,
  facai: 88.8,
  zhongqiu: 8.15
}

const USER_SELECT_RED_CONFIG = 'USER_SELECT_RED_CONFIG'

export default {
  components: {
    PasswordInput
  },
  data() {
    return {
      show: false,
      amount: '',
      password: '',
      content: '',
      redType: {
        roman: '浪漫',
        birth: '生日',
        facai: '恭喜发财',
        zhongqiu: '中秋'
      },
      localConfig: null,
      imgType: {
        roman: require('../../assets/images/red-romance.png'),
        birth: require('../../assets/images/red-birth.png'),
        facai: require('../../assets/images/red-facai.png'),
        zhongqiu: require('../../assets/images/red-zhongqiu.png')
      },
      redTarget: 'roman'
    }
  },
  computed: {
    showPopupBtnEnabled() {
      return this.amount >= 1 && this.amount <= 1000
    },
    confirmEnabled() {
      return this.password && this.password.length === 6
    },
    account() {
      return DI.get('auth').getUser()
    },
    btcAmount() {
      return (this.amount / DI.get('store').state.market.market.BTC.buy_price).toFixed(4)
    }
  },
  watch: {
    amount(val) {
      if (val < 1) {
        Message('最少 1 CNY')
      } else if (val > 1000) {
        Message('最多 1000 CNY')
      } else {
        const cnyNumber = DI.get('filters').maxDecimal(this.amount, 2)
        this.amount = cnyNumber
        this.saveToLocale()
      }
    },
    content(val) {
      if (!val) return
      this.saveToLocale()
    },
    redTarget: {
      immediate: true,
      handler(val) {
        this.onRedTargetChange(val)
      }
    }
  },
  mounted() {
    DI.get('utils').setTitle('发红包')
    const c = DI.get('offlineStorage').get(USER_SELECT_RED_CONFIG)
    try {
      if (c) {
        const config = JSON.parse(c)
        const { target } = config
        if (target) {
          this.localConfig = config
          this.redTarget = target
          this.onRedTargetChange(target)
        }
      }
    } catch (e) {} // eslint-disable-line
  },
  methods: {
    onRedTargetChange(val) {
      if (this.localConfig && val === this.localConfig.target) {
        this.amount = this.localConfig.amount
        this.content = this.localConfig.content
        return
      }
      this.amount = amountType[val]
      this.content = contentType[val]
    },
    saveToLocale() {
      DI.get('offlineStorage').set(USER_SELECT_RED_CONFIG, JSON.stringify({
        target: this.redTarget,
        amount: this.amount,
        content: this.content
      }))
    },
    showRedTip() {
      Dialog.alert({
        title: '红包功能使用步骤',
        message: `1.在金额框中填写人民币数额，系统会自动换算成BTC数量。

2.在文字框中可输入您给好友的寄语。

3.点击【发红包】，系统会自动生成专属红包海报，您可通过微信将红包海报分享给好友。

4.好友扫码海报并登录aBTC.one后，红包中的BTC数目会自动加到好友的余额中。`,
        messageAlign: 'left'
      })
    },
    onTargetClick(index) {
      this.redTarget = index
      this.saveToLocale()
    },
    showPopup() {
      const isSetCardNumber = this.account.set_card_number
      const isSetPassword = this.account.set_fund_password
      if (!isSetCardNumber) {
        Dialog.confirm({
          message: '请先进行身份认证'
        }).then(() => {
          this.$router.push({ name: 'realname' })
        }).catch(() => {})
        return
      }
      if (!isSetPassword) {
        Dialog.confirm({
          message: '请先设置资金密码'
        }).then(() => {
          this.$router.push({ name: 'password' })
        }).catch(() => {})
        return
      }
      this.show = true
    },
    onConfirm() {
      Indicator.open(this.$t('loading'))
      const postObject = {
        currency: 'BTC',
        style: 1,
        fund_password: this.password,
        description: this.content,
        cny_amount: Number(this.amount),
        extra: JSON.stringify({
          isDefaultText: this.content === contentType[this.redTarget],
          redTarget: this.redTarget
        })
      }
      DI.get('marketHttp')
        .sendRedPacket(postObject)
        .then((res) => {
          this.$router.push({
            name: 'redEnvelopePoster',
            query: {
              id: res.identifier
            },
            params: {
              ...postObject,
              identifier: res.identifier
            }
          })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    hidePopup() {
      this.show = false
    },
    onPassChange(val) {
      this.password = val
    }
  }
}
</script>

<style scoped lang="less">
.red {
  background: #FFF;
  min-height: 95vh;
}
.bu-body {
	padding: 10px 30px 0;
}

.bu-input {
  align-items: center;
  font-weight: bold;
}

.laber-for-right{
	width: 32px;
	text-align: right;
}

.img-preview {
  width: 50%;
  margin: 40px auto;
}
.red-button{
  padding: 0 30px;
}

.btc-amount {
  width: 100%;
  text-align: center;
  color: #999;
  margin-top: 25px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
}
.red-target {
  padding: 40px 30px 0;
  ul {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 16px;
    font-weight: bold;
    li {
      padding: 5px 0;
      text-align: center;
      width: 25%;
      &.active{
        background: #EC4A4A;
        border-radius: 100px;
        color: #FFF;
      }
    }
  }
}
.red-popup {
  height: calc(100vh - 40px);
  .title {
    font-size: 18px;
    font-weight: bold;
    padding: 15px 0 10px;
  }
  .info {
    padding: 15px 0 0;
    font-size: 16px;
    color: #636363;
    .left {
      min-width: 100px;
    }
  }
  .red-pass {
    padding: 40px 0;
  }
}
.withdraw-cancel-btn {
  background: #999!important;
  box-shadow: none;
  opacity: .6;
  margin-top: 15px;
}
.tip {
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 100%;
    font-size: 14px;
    flex-direction: row-reverse;
    color: #666;
    &:active{
      color: #000000;
    }
    img {
      margin-right: 30px;
      width: 12px;
      height: 12px;
      margin-left: 3px;
    }
  }
</style>
<style>
.bu-input:first-of-type input {
  text-align: center;
  font-size: 25px !important;
  line-height: 25px;
  vertical-align: center;
  color: #666;
  padding: 0 !important;
}
.bu-input:last-of-type input {
  text-align: center;
  font-size: 18px !important;
  line-height: 40px;
  vertical-align: center;
  color: #666;
  padding: 0 !important;
}
.bu-input .van-cell {
  outline: none !important;
  border-style: solid !important;
  border-width: 6px !important;
  border-color: white !important;
  flex: 1;
  padding:0 15px !important;
}
</style>
