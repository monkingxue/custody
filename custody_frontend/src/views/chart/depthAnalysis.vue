<template>
  <div 
    v-if="coinDepthAnalysis.total_books"
    class="analysis-wrap"
  >
    <h4>多空分析</h4>
    <div class="analysis-list">
      <div class="line">
        <span class="label">委托总量：</span>
        <div class="flex number-box">
          <span class="number din">
            $ {{ coinDepthAnalysis.total_books | formatMoney }}
          </span>
          <span
            :class="[
              'arrow',
              coinDepthAnalysis.total_books_change < 0 ? 'orange' : 'green'
            ]"
          >
            (<span class="din">{{ coinDepthAnalysis.total_books_change > 0 ? "+" : "" }}{{ coinDepthAnalysis.total_books_change }}</span>%)
          </span>
        </div>
      </div>
      <div class="line">
        <span class="label">委托买单总量：</span>
        <div class="flex number-box">
          <span class="number din">
            $ {{ coinDepthAnalysis.global_bids | formatMoney }}
          </span>
          <span
            :class="[
              'arrow',
              coinDepthAnalysis.global_bids_change < 0 ? 'orange' : 'green'
            ]"
          >
            (<span class="din">{{ coinDepthAnalysis.global_bids_change > 0 ? "+" : "" }}{{ coinDepthAnalysis.global_bids_change }}</span>%)
          </span>
        </div>
      </div>
      <div class="line">
        <span class="label">委托卖单总量：</span>
        <div class="flex number-box">
          <span class="number din">
            $ {{ coinDepthAnalysis.global_asks | formatMoney }}
          </span>
          <span
            :class="[
              'arrow',
              coinDepthAnalysis.global_asks_change < 0 ? 'orange' : 'green'
            ]"
          >
            (<span class="din">{{ coinDepthAnalysis.global_asks_change > 0 ? "+" : "" }}{{ coinDepthAnalysis.global_asks_change }}</span>%)
          </span>
        </div>
      </div>
      <div class="line">
        <span 
          class="label flex align-items-center"
          @click="showTips"
        >
          买卖单对比：<span class="icon-help" />
        </span>
        <div>
          <span :class="[coinDepthAnalysis.mdr < 0 ? 'orange' : 'green']">
            <span class="din">{{ coinDepthAnalysis.mdr > 0 ? "+" : "" }}{{ coinDepthAnalysis.mdr }}</span>%
          </span>
        </div>
      </div>
      <div class="progress mt10">
        <div class="bg">
          <div
            class="bg-green"
            :style="`width: ${coinDepthAnalysis.global_bids_percentage}%`"
          />
          <div
            class="bg-orange"
            :style="`width: ${coinDepthAnalysis.global_asks_percentage}%`"
          />
        </div>
        <div class="num">
          <span>
            &nbsp;<b>买：</b><span class="din">{{ coinDepthAnalysis.global_bids_percentage }}</span>%
          </span>
          <span>
            <b>卖：</b><span class="din">{{ coinDepthAnalysis.global_asks_percentage }}</span>%&nbsp;
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Dialog } from "vant"

export default {
  data() {
    return {
      base: null
    }
  },
  computed: {
    storeDepthAnalysis() {
      return DI.get("store").state.depth.analysis
    },
    coinDepthAnalysis() {
      return this.storeDepthAnalysis[this.base] || {}
    }
  },
  mounted() {
    const { params } = this.$route
    const { symbol } = params
    this.base = DI.get("utils").getBaseFromSymbol(symbol)
  },
  methods: {
    showTips() {
      Dialog.alert({
        message: `买卖单对比 =（买单总量 - 卖单总量）/（买单总量 + 卖单总量）`,
        messageAlign: "left",
        confirmButtonText: "好的"
      })
    }
  }
}
</script>

<style scoped lang="less">
@orange: #ff654c;
@green: #36d58f;
@mainText: #222;
@grayText: rgba(34, 34, 34, 0.6);
@lightGrayText: rgba(34, 34, 34, 0.3);

.analysis-wrap {
  margin-bottom: 15px;
  h4 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
  }
  .label {
    color: @grayText;
    .icon-help {
      width: 12px;
      height: 12px;
      background-color: #222;
      mask: url("../../assets/images/icon/icon-help.svg") no-repeat center;
    }
  }
  .number-box {
    min-width: 40%;
    justify-content: space-between;
  }
  .number {
    min-width: 95px;
  }
  .arrow {
    min-width: 65px;
    text-align: right;
  }
  .arrow::before {
    content: "";
    padding: 0;
    display: inline-block;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }
  .green {
    color: @green;
    &.arrow::before {
      border-bottom: 7px solid @green;
      margin-bottom: 1px;
    }
  }
  .orange {
    color: @orange;
    &.arrow::before {
      margin-top: 1px;
      border-top: 7px solid @orange;
    }
  }
  .progress {
    position: relative;
    .bg,
    .num {
      display: flex;
      justify-content: space-between;
    }
    .bg > div {
      height: 26px;
    }
    .num {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 26px;
      & > span{
        height: 26px;
        line-height: 26px;
        font-size: 12px;
        color: #fff;
        white-space: nowrap;
      }
    }
  }
  .bg-green {
    background-color: @green;
  }
  .bg-orange {
    background-color: @orange;
    text-align: right;
  }
}
</style>

