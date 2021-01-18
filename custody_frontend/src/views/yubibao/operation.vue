<template>
  <div class="ybb">
    <div class="top-pad" />
    <div class="block-info">
      <div class="block-box tc">
        <div class="main">
          <div class="title">
            投资金额({{ coin }})
          </div>
          <div class="amount din">
            {{ coinBalance.balance }}
          </div>
          <div class="yesterday">
            <div class="content">
              <span>昨日收益</span>
              <span class="din highlight">
                {{ coinBalance.yesterday_interest_cny }}
              </span>
              <span>元</span>
            </div>
          </div>
        </div>
        <div class="other flex-all">
          <div>
            <div
              class="top flex-all"
            >
              <span>累计收益({{ coin }})</span>
            </div>
            <div class="mid din">
              {{ coinBalance.interest }}
            </div>
            <div class="bottom">
              <span>≈ ¥ {{ coinBalance.interest_cny }}</span>
            </div>
          </div>
          <div>
            <div
              class="top flex-all"
            >
              <span>年化收益(%)</span>
            </div>
            <div class="mid din">
              {{ actualInterest }} %
            </div>
            <div
              v-if="coinVipSetting.extra_interest_rate > 1"
              class="bottom"
              @click="onGoToIntro"
            >
              <span class="vip">VIP{{ storeAccount.credit_vip_level }}</span>
              <span>加息中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="operation">
      <div class="switch flex-all">
        <scrollTabLabel
          class="bu-top buy-sell-witch"
          :tabs="tabsData"
          :target="switchTarget"
          @change="onSwitchTargetClick"
        />
        <div class="tip flex-all">
          <span>投资限额: {{ investLimit | strip(coinFloatCount) }} {{ coin }}</span>
          <img
            src="../../assets/images/icon18.png"
            width="12"
            height="12"
            @click="onVipClick"
          >
        </div>
      </div>
      <div>
        <div class="comm-inputcon mt30 din">
          <van-field
            v-model="amount"
            type="number"
            :placeholder="placeHolder"
          />
          <span
            class="add-all laber-for-right"
          >
            <span class="unit">{{ coin }}</span>
            <span @click="onTransferAll">全部</span>
          </span>
        </div>
        <van-button
          :class="['img-btn-dark', 'mt20', 'brown-btn']"
          size="large"
          round
          @click="onBtnClick"
        >
          {{ isIn ? '转入' : '转出' }}
        </van-button>
        <div class="bottom-tip">
          <template v-if="isIn">
            <span>预计收益到账时间</span>
            <span class="highlight">{{ nextInterestDay }}</span>
          </template>
          <span v-else>
            转出实时到账
          </span>
        </div>
      </div>
    </div>
    <PopUp
      ref="popupVip"
      btn-class="brown-btn"
      btn-text="提高额度"
      @confirm="onGoVip"
    >
      <div class="popup-vip">
        <div class="top">
          <img :src="vipLogo[storeAccount.credit_vip_level - 1]">
          <span>VIP {{ storeAccount.credit_vip_level }}</span>
        </div>
        <div class="list-mini flex-all">
          <div class="left">
            总限额
          </div>
          <div class="right din">
            {{ `${Number(coinVipSetting.share).toFixed(2)} ${coin}` }}
          </div>
        </div>
        <div class="list-mini flex-all">
          <div class="left">
            已投金额
          </div>
          <div class="right din">
            {{ `${Number(displayActualBalance).toFixed(2)} ${coin}` }}
          </div>
        </div>
        <div class="list-mini flex-all">
          <div class="left">
            剩余限额
          </div>
          <div class="right din">
            {{ `${Number(coinVipSetting.share - displayActualBalance).toFixed(2)} ${coin}` }}
          </div>
        </div>
      </div>
    </PopUp>
    <PopUp
      ref="popupInterest"
      btn-class="brown-btn"
      :title="popupInterestTitle"
    >
      <div class="popup-vip tc">
        {{ `${coinSetting.base_interest_rate * 100}% *  ${(coinVipSetting.extra_interest_rate * 100).toFixed(0)}%` }} = {{ actualInterest }} %
      </div>
    </PopUp>
    <PopUpFull
      ref="popupPassword"
      header-color="is-yellow"
      @close="onPopupPasswordClose"
    >
      <div class="password-popup">
        <div class="flex-all">
          <div>{{ isIn ? '转入' : '转出' }}金额</div>
          <div>{{ amount }} {{ coin }}</div>
        </div>
        <PasswordInput
          ref="popupPasswordInput"
          :hide-pass="true"
          class="red-pass mt30"
          :yellow-active="true"
          :auto-focus="false"
          @onChange="onPassChange"
        />
        <van-button
          :class="['img-btn-dark', 'mt30', 'brown-btn']"
          size="large"
          round
          :disabled="!transactionEnable"
          @click="makeTransaction"
        >
          确认{{ isIn ? '转入' : '转出' }}
        </van-button>
      </div>
    </PopUpFull>
  </div>
</template>

<script>
import { DI } from "core"
import {
  scrollTabLabel,
  PopUp, PopUpFull,
  PasswordInput,
  Indicator,
  Message
} from 'components'
import BalanceMixin from './balanceMixin'
// Math.min(0.00000000009) 迷之变成科学计数法
const min = (a, b) => {
  const result = a > b ? b : a
  if (result || result === 0) return result
  return NaN
}
export default {
  components: {
    scrollTabLabel,
    PopUp,
    PopUpFull,
    PasswordInput
  },
  mixins: [BalanceMixin],
  data() {
    return {
      coin: '',
      amount: null,
      switchTarget: 'in',
      nextInterestDay: this.$dayjs().add(2, 'd').format('MM-DD（dddd）'),
      password: '',
      tabsData: [
        { value: 'in', text: '转入' },
        { value: 'out', text: '转出' }
      ],
      vipLogo: [
        require('../../assets/images/yubibao/vip1.png'),
        require('../../assets/images/yubibao/vip2.png'),
        require('../../assets/images/yubibao/vip3.png'),
        require('../../assets/images/yubibao/vip4.png'),
        require('../../assets/images/yubibao/vip5.png')
      ],
      coinFloatCount: 4
    }
  },
  computed: {
    displayActualBalance() {
      return min(this.coinVipSetting.share, this.coinBalance.balance)
    },
    investLimit() {
      return this.coinVipSetting.share - this.displayActualBalance
    },
    popupInterestTitle() {
      return `VIP${ this.storeAccount.credit_vip_level } 利息加成`
    },
    placeHolder() {
      if (this.switchTarget === 'in') {
        return `本次最大可转 ${this.maxTransferAmount}`
      }
      return `可转出到钱包 ${this.maxTransferAmount}`
    },
    actualInterest() {
      return (this.coinVipSetting.extra_interest_rate * this.coinSetting.base_interest_rate * 100).toFixed(3)
    },
    maxTransferAmount() {
      if (this.switchTarget === 'in') {
        return min(
          this.storeAccount.available_balance[this.coin],
          this.investLimit
        )
      }
      return this.coinBalance.balance
    },
    transactionEnable() {
      return this.password.length === 6
    },
    passwordPopupEnable() {
      return Number(this.amount) > 0 && Number(this.amount) <= Number(this.maxTransferAmount)
    },
    isIn() {
      return this.switchTarget === 'in'
    },
    storeAccount() {
      return DI.get('auth').getUser()
    },
    coinBalance() {
      if (!this.coin || !this.storeYubibaoBalance.current) return {}
      return this.storeYubibaoBalance.current.find(_ => _.currency === this.coin)
    },
    coinSetting() {
      if (!this.storeYubibaoSetting.length || !this.coin) return {}
      return this.storeYubibaoSetting.find(_ => _.coin_name === this.coin)
    },
    coinVipSetting() {
      if (!this.storeAccount.credit_vip_level || !this.coinSetting.vip_settings) return []
      return this.coinSetting.vip_settings.find(_ => _.vip_level === this.storeAccount.credit_vip_level)
    }
  },
  mounted() {
    const { coin } = this.$route.query
    this.coin = coin
    DI.get("utils").setTitle("余币宝")
    DI.get('vue').$emit('set-header-right', {
      text: '明细',
      action: this.onGoToHistory
    })
  },
  methods: {
    onGoToHistory() {
      this.$router.push({ name: 'yubibaoHistory', query: {
        currency: this.coin
      } })
    },
    onGoToIntro() {
      this.$router.push({ name: 'yubibaoIntro', query: {
        coin: this.coin,
        fromRoute: 'yubibaoOperation'
      } })
    },
    makeTransaction() {
      Indicator.open(this.$t("loading"))
      DI.get("yubibaoHttp")
        .makeTransaction({
          currency: this.coin,
          amount: Number(this.amount),
          side: this.switchTarget,
          fund_password: this.password
        })
        .then(() => {
          // this.$refs.popupPassword.onClose()
          this.$router.push({ name: 'yubibaoResult', params: {
            currency: this.coin,
            amount: this.amount,
            side: this.switchTarget
          } })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    onInterestClick() {
      this.$refs.popupInterest.onOpen()
    },
    onVipClick() {
      this.$refs.popupVip.onOpen()
    },
    onTransferAll() {
      this.amount = this.maxTransferAmount
    },
    onBtnClick() {
      if (!this.passwordPopupEnable) {
        Message('请输入正确的金额')
        return
      }
      this.$refs.popupPassword.onOpen()
    },
    onSwitchTargetClick(e) {
      this.switchTarget = e
      this.amount = null
    },
    onGoVip() {
      this.$router.push({ name: 'vip' })
    },
    onPassChange(e) {
      this.password = e
    },
    onPopupPasswordClose() {
      this.$refs.popupPasswordInput.clear()
      this.password = ''
    }
  }
}
</script>
<style scoped lang="less">
.ybb {
  background: #ECEDEF;
  min-height: 95vh;
  .top-pad {
    width: 100%;
    height: 20px;
    background: #D6AF74;
  }
  .block-info {
    background: linear-gradient( #D6AF74 50%, #ECEDEF 50%);
    padding: 0 20px 20px;
  }
  .block-box {
    padding: 40px;
    background: #FFFFFF;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
    border-radius: 4px;
    .main {
      margin-bottom: 40px;
      .title{
        opacity: 0.3;
        font-size: 14px;
        color: #222222;
      }
      .amount{
        font-size: 38px;
        color: #222222;
        padding: 10px 0;
      }
      .yesterday{
        .content {
          display: inline;
          background: #FAFAFA;
          border-radius: 15px;
          padding: 10px 20px;
          font-size: 12px;
          color: #222222;
        }
        .highlight {
          color: #FF9B00
        }
      }
    }
    .other {
      color: #000000;
      .top{
        opacity: 0.3;
        font-size: 12px;
      }
      .mid{
        font-size: 16px;
        padding: 6px 0;
      }
      .bottom{
        span {
          opacity: 0.3;
          font-size: 10px;
        }
        .vip {
          background: #F6BF56;
          opacity: 1;
          padding: 2px 4px;
          color: #FFF;
          border-radius: 3px;
        }
      }
      .more {
        width: 8px;
        margin-left: 5px
      }
    }
  }
  .operation {
    background: #FFF;
    padding: 0 30px 30px;
    .add-all {
      color: #D6AF74;
      font-size: 14px;
      line-height: 14px;
      .unit {
        color: #666;
        border-right: 1px solid #DDDDDD;
        padding: 3px 10px 4px;
        margin-right: 9px;
      }
    }
    /deep/ .comm-inputcon {
      border-radius: 3px;
      input {
        font-size: 14px;
      }
      .laber-for-right {
        display: flex;
        align-items: center;
      }
    }
    .switch {
      border-bottom: 1px solid #EEEEEE;
      .tip {
        span {
          margin-right: 5px;
          opacity: 0.6;
          font-size: 12px;
          color: #222222;
        }
      }
      /deep/ ul {
        font-size: 14px;
        li {
          padding: 15px 20px 15px 0;
        }
        .bot {
          background: #D6AF74;
        }
        .active span{
          color: #222222;
          font-weight: bold;
          opacity: 1;
        }
        span {
          color: #222222;
          font-weight: 100;
          opacity: 0.6;
        }
      }
    }
    .bottom-tip {
      font-size: 12px;
      color: #7A7A7A;
      margin-top: 15px;
      text-align: center;
      .highlight {
        color: #FF9B00;
      }
    }
  }
  .popup-vip {
    text-align: center;
    margin-top: -10px;
    color: #000000;
    .top {
      img {
        display: block;
        margin: 0 auto;
        width: 65px;
      }
      font-size: 16px;
    }
    .list-mini {
      padding: 0;
      &:first-of-type {
        padding-top: 10px;
      }
      &:last-of-type {
        padding-bottom: 10px;
      }
      .left {
        opacity: 0.3;
        font-size: 12px;
      }
      .right {
        width: 55%;
        text-align: right;
      }
    }
  }
  .password-popup {
    padding: 30px;
  }
}

</style>
