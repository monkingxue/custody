<template>
  <div class="ybb">
    <div class="top-pad" />
    <div class="block-info">
      <div class="block-box tc">
        <div class="main">
          <div class="title">
            投资金额({{ coinBalance.currency }})
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
        <div class="other flex-just">
          <div>
            <div
              class="top flex-all"
            >
              <span>累计收益({{ coinBalance.currency }})</span>
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
              v-if="storeAccount.credit_vip_level > 2"
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
      <div class="detail-list">
        <div class="list-item flex-all list-title">
          <div class="left">
            投资详情
          </div>
          <div
            class="detail touch"
            @click="onGoToIntro"
          >
            投资规则
          </div>
        </div>
        <div class="list-item flex-all">
          <div>开始计息时间</div>
          <div class="detail">
            {{ coinBalance.start_date }}
          </div>
        </div>
        <div class="list-item flex-all">
          <div>到期时间</div>
          <div class="detail">
            {{ coinBalance.end_date }}
          </div>
        </div>
        <div class="list-item flex-all">
          <div>预计收益</div>
          <div class="detail">
            {{ coinBalance.estimate_interest }} USDT
          </div>
        </div>
        <div class="list-item flex-all">
          <div>到期本息</div>
          <div class="detail">
            {{ coinBalance.estimate_balance }} USDT
          </div>
        </div>
      </div>
    </div>
    <div class="operation-bottom">
      <div>
        <div class="flex-all group">
          <van-button
            :class="['img-btn-dark', 'brown-btn']"
            size="large"
            round
            @click="onGoToIntro"
          >
            再投一笔
          </van-button>
          <van-button
            :class="['img-btn-dark', 'brown-light-btn']"
            size="large"
            round
            @click="onBtnClick"
          >
            提前赎回
          </van-button>
        </div>
        <div class="flex-align group">
          <div class="empty">
            empty
          </div>
          <div class="tip">
            提前赎回将损失收益
          </div>
        </div>
      </div>
    </div>
    <PopUpFull
      ref="popupPassword"
      header-title="资金密码验证"
      header-color="is-yellow"
      @close="onPopupPasswordClose"
    >
      <div class="password-popup">
        <div class="flex-all">
          <div>赎回金额</div>
          <div>{{ coinBalance.balance }} {{ coinBalance.currency }}</div>
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
          确认赎回
        </van-button>
      </div>
    </PopUpFull>
    <PopUp
      ref="popupInterest"
      btn-class="brown-light-btn"
      title="温馨提示"
      btn-text="取消"
    >
      <div class="mb20 tc">
        提前赎回将导致收益损失
      </div>
      <van-button
        :class="['img-btn-dark', 'brown-btn']"
        size="large"
        round
        @click="onOpenPassPopup"
      >
        确认赎回
      </van-button>
    </PopUp>
  </div>
</template>

<script>
import { DI } from "core"
import {
  PopUp,
  PopUpFull,
  PasswordInput,
  Indicator,
  Message
} from 'components'
import BalanceMixin from './balanceMixin'

export default {
  components: {
    PopUp,
    PopUpFull,
    PasswordInput
  },
  mixins: [BalanceMixin],
  data() {
    return {
      password: '',
      id: 0
    }
  },
  computed: {
    actualInterest() {
      return (this.coinBalance.base_interest_rate * 100).toFixed(3)
    },
    transactionEnable() {
      return this.password.length === 6
    },
    storeAccount() {
      return DI.get('auth').getUser()
    },
    coinBalance() {
      if (!this.id || !this.storeYubibaoBalance.contract) return {}
      return this.storeYubibaoBalance.contract.find(_ => Number(_.contract_id) === Number(this.id)) || {}
    }
  },
  mounted() {
    const { id } = this.$route.query
    this.id = id
    DI.get("utils").setTitle("余币宝")
    DI.get('vue').$emit('set-header-right', {
      text: '明细',
      action: this.onGoToHistory
    })
    DI.get('utils').setBackAction(() => {
      this.$router.push({
        name: 'yubibao',
        query: {
          from: 'wallet'
        }
      })
    })
  },
  methods: {
    onGoToHistory() {
      this.$router.push({ name: 'yubibaoHistory', query: {
        currency: this.coinBalance.currency,
        contractId: this.coinBalance.contract_id
      } })
    },
    onGoToIntro() {
      this.$router.push({ name: 'yubibaoIntro', query: {
        coin: this.coinBalance.currency,
        fromRoute: 'yubibaoOperation',
        id: this.coinBalance.contract_template_id,
        type: 'D'
      } })
    },
    makeTransaction() {
      Indicator.open(this.$t("loading"))
      DI.get("yubibaoHttp")
        .makeContractTransaction({
          currency: this.coin,
          side: 'out',
          fund_password: this.password,
          contract_id: this.coinBalance.contract_id
        })
        .then(() => {
          this.$router.push({ name: 'yubibaoResult', params: {
            currency: this.coinBalance.currency,
            amount: this.coinBalance.balance,
            side: 'out',
            contractId: this.coinBalance.contract_id
          } })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    onBtnClick() {
      this.$refs.popupInterest.onOpen()
    },
    onOpenPassPopup() {
      this.$refs.popupPassword.onOpen()
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
    .detail-list {
      margin-bottom: 100px;
      .list-item {
        border-bottom: 1px solid #EEEEEE;
        height: 65px;
        color: #888;
        font-size: 14px;
        .detail {
          color: #222222;
          text-align: right;
        }
      }
      .list-title {
        height: 48px;
        .left {
          font-weight: bold;
          font-size: 14px;
          color: #222222;
        }
        .detail {
          font-size: 12px;
          color: #D6AF74;
        }
      }
    }
  }
  .password-popup {
    padding: 30px;
  }
  .operation-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding-bottom: 10px;
    .group {
      margin: 0 10px 0px;
      .empty {
        flex: 1;
        opacity: 0;
      }
      .tip {
        flex: 1;
        opacity: 0.6;
        font-size: 12px;
        color: #7A7A7A;
        text-align: center;
      }
      >button {
        margin: 10px 10px 5px
      }
    }
  }
}

</style>
