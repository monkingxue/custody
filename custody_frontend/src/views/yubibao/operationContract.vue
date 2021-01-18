<template>
  <div class="ybb">
    <div class="operation">
      <div>
        <div class="top-list">
          <div class="flex-all list-item">
            <div>起息日</div>
            <div class="detail">
              {{ startDate }}
            </div>
          </div>
          <div class="flex-all list-item">
            <div>到期日</div>
            <div class="detail">
              {{ endDate }}
            </div>
          </div>
          <div class="flex-all list-item">
            <div>预计到期收益</div>
            <div class="detail">
              {{ displayIntrest }} USDT
            </div>
          </div>
        </div>
        <div class="comm-inputcon mt20 din">
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
          立即存入
        </van-button>
        <div class="bottom-tip">
          单笔最低投资 <span>100</span> USDT
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
          <div>转入金额</div>
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
          确认存入
        </van-button>
      </div>
    </PopUpFull>
  </div>
</template>

<script>
import { DI } from "core"
import {
  PopUpFull,
  PasswordInput,
  Indicator,
  Message
} from 'components'
import BalanceMixin from './balanceMixin'

export default {
  components: {
    PopUpFull,
    PasswordInput
  },
  mixins: [BalanceMixin],
  data() {
    return {
      coin: '',
      amount: null,
      password: '',
      id: 0,
      startDate: this.$dayjs().format('YYYY-MM-DD')
    }
  },
  computed: {
    endDate() {
      return this.$dayjs().add(this.contractItem.contract_days, 'day').format('YYYY-MM-DD')
    },
    displayIntrest() {
      if (!this.amount) return 0
      return DI.get('filters').strip(this.amount * this.contractItem.contract_days / 365 * this.contractItem.base_interest_rate, 4)
    },
    displayIntrestCny() {
      return this.displayIntrest
    },
    placeHolder() {
      return `本次最大可转 ${this.maxTransferAmount}`
    },
    maxTransferAmount() {
      return DI.get('filters').strip(this.storeAccount.available_balance[this.coin], 10)
    },
    transactionEnable() {
      return this.password.length === 6
    },
    passwordPopupEnable() {
      return Number(this.amount) > 0 && Number(this.amount) <= Number(this.maxTransferAmount)
    },
    storeAccount() {
      return DI.get('auth').getUser()
    },
    coinSetting() {
      if (!this.storeYubibaoSetting.length || !this.coin) return {}
      return this.storeYubibaoSetting.find(_ => _.coin_name === this.coin)
    },
    contractItem() {
      if (!this.storeYubibaoContract.contract_templates || !this.id) return {}
      return this.storeYubibaoContract.contract_templates.find(_ => Number(_.id) === Number(this.id))
    }
  },
  mounted() {
    const { coin, id } = this.$route.query
    this.coin = coin
    this.id = id
    DI.get("utils").setTitle("余币宝")
  },
  methods: {
    makeTransaction() {
      Indicator.open(this.$t("loading"))
      DI.get("yubibaoHttp")
        .makeContractTransaction({
          currency: this.coin,
          amount: Number(this.amount),
          side: 'in',
          fund_password: this.password,
          template_id: this.id
        })
        .then((res) => {
          this.$refs.popupPassword.onClose()
          this.$router.push({ name: 'yubibaoResult', params: {
            currency: this.coin,
            amount: this.amount,
            side: 'in',
            contractDays: this.contractItem.contract_days,
            contractId: res.contract_id
          } })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    onTransferAll() {
      this.amount = this.maxTransferAmount
    },
    onBtnClick() {
      if (Number(this.amount) < 100) {
        Message('单笔最低投资100USDT')
        return
      }
      if (!this.passwordPopupEnable) {
        Message('请输入正确的金额')
        return
      }
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
  .top-list {
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
    .bottom-tip {
      font-size: 12px;
      color: #7A7A7A;
      margin-top: 15px;
      text-align: center;
      span {
        color: #D6AF74;
      }
    }
  }
  .password-popup {
    padding: 30px;
  }
}

</style>
