<template>
  <div class="chain-name">
    <div
      v-if="chainInfo && chainInfo.length > 1"
    >
      <div class="title">
        <span>链名称</span>
        <img
          src="../../assets/images/icon18.png"
          width="13"
          height="13"
          @click="onOpenPopup"
        >
      </div>
      <div class="select">
        <div
          v-for="item in chainInfo"
          :key="item.chain_name"
          class="item"
          :class="[item.chain_name === active && 'active']"
          @click="() => onSelect(item)"
        >
          {{ item.chain_name }}
        </div>
      </div>
    </div>
    <PopUp
      ref="popup"
      title="三种 USDT 说明"
    >
      <template>
        <p>OMNI_USDT：使用比特币网络，地址以 1 或者 3 开头，转账速度 0.6 ～ 2 小时，安全级别最高，提币手续费 6 USDT，建议大额低频的资金转账使用。</p>

        <p>ERC20_USDT：使用以太坊网络，地址以 0x 开头，转账速度半小时以内，安全级别低于比特币网络，提币手续费 2 USDT，建议中等额度资金转账使用。</p>

        <p>TRON_USDT：使用波场网络，地址以 T 开头，转账速度 10 分钟以内，安全级别低于前两者，提币手续费 1 USDT，建议小额资金使用。</p>
      </template>
    </PopUp>
  </div>
</template>

<style scoped lang="less">
.chain-name {
  margin-top: 30px;
  .title{
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #222222;
    img {
      margin-left: 5px;
    }
  }
  .select{
    margin-top: 10px;
    display: flex;
    align-items: center;
    .item {
      background: #F1F2F4;
      border-radius: 4px;
      opacity: 0.6;
      font-size: 16px;
      color: #222222;
      flex: 1;
      border: 1px solid #eee;
      margin: 0 10px;
      text-align: center;
      padding: 8px 0;
      &:first-child{
        margin-left: 0;
      }
      &:last-child{
        margin-right: 0;
      }
    }
    .active {
      border: 1px solid #4140BB;
      border-radius: 4px;
      font-size: 16px;
      color: #4140BB;
    }
  }
  /deep/ .dialog-content {
    p {
      padding: 10px 0;
    }
  }
}
</style>

<script>
import { PopUp } from 'components'
export default {
  components: {
    PopUp
  },
  props: {
    chainInfo: Array,
    active: String
  },
  methods: {
    onSelect(e) {
      this.$emit('select', e)
    },
    onOpenPopup() {
      this.$refs.popup.onOpen()
    }
  }
}
</script>
