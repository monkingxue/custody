<template>
  <div class="yubibao-result">
    <div
      v-if="currency"
      class="content"
    >
      <div class="top-content">
        <img
          width="68"
          src="../../assets/images/yubibao/detail-success.png"
        >
        <span v-if="isIn && !contractId">存币成功</span>
        <span v-else-if="!isIn && contractId">赎回成功</span>
        <span v-else>转出成功</span>
      </div>
      <div class="progress">
        <template v-if="isIn">
          <div class="block">
            <div class="main">
              存入 {{ amount }} {{ currency }}
            </div>
            <div class="sub">
              {{ nowDate }}
            </div>
            <img
              class="start"
              src="../../assets/images/yubibao/detail-wait.png"
            >
          </div>
          <div class="block">
            <div class="main">
              开始计算收益
            </div>
            <div class="sub">
              {{ nextDateStart }}
            </div>
            <img
              class="empty"
              src="../../assets/images/yubibao/detail-empty.png"
            >
          </div>
          <div
            v-if="contractDays"
            class="block"
          >
            <div class="main">
              本息到账
            </div>
            <div class="sub">
              {{ nextContractDateStart }}
            </div>
            <div class="empty end">
              <img
                src="../../assets/images/yubibao/detail-empty.png"
              >
            </div>
          </div>
          <div
            v-else
            class="block"
          >
            <div class="main">
              收益到账
            </div>
            <div class="sub">
              {{ nextNextDateStart }}
            </div>
            <div class="empty end">
              <img
                src="../../assets/images/yubibao/detail-empty.png"
              >
            </div>
          </div>
        </template>
        <template v-else>
          <div class="block">
            <div class="main">
              <template v-if="contractId">
                提前赎回 {{ amount }} {{ currency }}
              </template>
              <template v-else>
                转出 {{ amount }} {{ currency }}
              </template>
            </div>
            <div class="sub">
              {{ nowDate }}
            </div>
            <img
              class="start"
              src="../../assets/images/yubibao/detail-done.png"
            >
          </div>
          <div class="block">
            <div class="main">
              钱包到账
            </div>
            <div class="sub">
              {{ nowDate }}
            </div>
            <div class="empty end">
              <img
                src="../../assets/images/yubibao/detail-done.png"
              >
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="entrance">
      <div class="main">
        <van-button
          :class="['img-btn-dark', 'mt20', 'brown-btn']"
          size="large"
          round
          @click="onBtnClick"
        >
          完成
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"

export default {
  data() {
    return {
      side: '',
      amount: '',
      currency: '',
      nowDate: this.$dayjs().format('YYYY.MM.DD HH:mm'),
      nextDateStart: this.$dayjs().add(1, 'day').startOf('day').format('YYYY.MM.DD HH:mm'),
      nextNextDateStart: this.$dayjs().add(2, 'day').startOf('day').format('YYYY.MM.DD HH:mm')
    }
  },
  computed: {
    isIn() {
      return this.side === 'in'
    },
    nextContractDateStart() {
      return this.$dayjs().add(this.contractDays, 'day').startOf('day').format('YYYY.MM.DD HH:mm')
    }
  },
  mounted() {
    const { params } = this.$route
    this.currency = params.currency
    this.side = params.side
    this.amount = params.amount
    this.contractDays = params.contractDays
    this.contractId = params.contractId
    let title = '转出余币宝'
    if (this.isIn) title = '存币'
    if (!this.isIn && this.contractId) title = '赎回成功'
    DI.get("utils").setTitle(title)
  },
  methods: {
    onBtnClick() {
      DI.get('store').dispatch('SYNC_YUBIBAO_BALANCE')
      if (this.contractId || this.contractDays) {
        if (this.isIn) {
          this.$router.push({ name: 'yubibaoOperationContractDetail', query: {
            coin: this.currency,
            id: this.contractId
          } })
          return
        }
        this.$router.push({
          name: 'yubibao',
          query: {
            from: 'wallet'
          }
        })
        return
      }
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="less">
.yubibao-result {
  padding: 40px;
  .top-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      font-size: 20px;
      color: #36D58F;
      margin-top: 12px;
    }
  }
  .progress {
    margin-left: 10px;
    border-left: 2px solid RGBA(214,175,116,.3);
    padding-left: 20px;
    .block {
      position: relative;
      margin-top: 70px;
      .main {
        font-size: 16px;
        color: #222222;
      }
      .sub {
        margin-top: 5px;
        opacity: 0.6;
        font-size: 10px;
        color: #222222;
      }
    }
    .start {
      position: absolute;
      top: 0px;
      left: -32px;
      width: 24px;
      background: #FFF;
    }
    .empty {
      position: absolute;
      top: 0px;
      left: -32px;
      width: 24px;
    }
    .end {
      height: 50px;
      background: #FFF;
    }
  }
  .entrance {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #FFF;
    .main {
      padding: 10px 30px 40px;
    }
  }
}
</style>
