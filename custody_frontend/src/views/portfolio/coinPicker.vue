<template>
  <div>
    <PopUpFull
      ref="popup"
      header-color="is-blue"
      header-title="编辑币种"
      @close="onPopupClose"
    >
      <div class="coin-list">
        <div
          v-for="item in coinArr"
          :key="item.name"
          class="item flex-all"
        >
          <div class="left flex-all">
            <div class="icon">
              <img :src="getIconUrl(item)">
            </div>
            <div class="name">
              <div class="top">
                {{ item.name }}
              </div>
              <div class="bottom">
                {{ item.cn_name }}
              </div>
            </div>
          </div>
          <div class="right">
            <van-switch
              :value="getSwitchStatus(item)"
              active-color="#4CD964"
              inactive-color="#d6d6d6"
              size="25px"
              @change="(e) => onSwitchChange(e, item)"
            />
          </div>
        </div>
      </div>
    </PopUpFull>
  </div>
</template>

<script>
import { DI } from 'core'
import {
  PopUpFull
} from 'components'
export default {
  components: {
    PopUpFull
  },
  props: {
    coinSelection: {
      type: Array
    }
  },
  data() {
    return {
      checked: true,
      coinArr: []
    }
  },
  computed: {
    storeOtcCoinSetting() {
      return DI.get("store").state.setting.otcCoinSetting || []
    }
  },
  watch: {
    storeOtcCoinSetting: {
      immediate: true,
      handler() {
        this.filterOtcCoin()
      }
    }
  },
  mounted() {
    DI.get("store").dispatch("SYNC_OTC_COIN_SETTING")
  },
  methods: {
    onSwitchChange(e, item) {
      this.$emit('change', e, item)
    },
    getSwitchStatus(item) {
      return !!this.coinSelection.find(i => i.currency === item.name)
    },
    getIconUrl(name) {
      return DI.get('utils')
        .getCoinIconUrlFromSetting(name)
    },
    filterOtcCoin() {
      if (this.storeOtcCoinSetting.length) {
        const mainstreamBi = []
        const innovationBi = []
        this.storeOtcCoinSetting.forEach(item => {
          if (item.name === 'USDT') {
            return
          }
          if (item.otc_tag === 'mainstream') {
            mainstreamBi.push(item)
          } else {
            innovationBi.push(item)
          }
        })
        this.coinArr = mainstreamBi.concat(innovationBi)
        this.setInitValue()
        this.$emit('ready')
      }
    },
    setInitValue() {
      if (this.coinSelection.length || !this.coinArr.length) return
      this.onSwitchChange(true, this.coinArr.find(i => i.name === 'BTC'))
    },
    onOpen() {
      this.$refs.popup.onOpen()
    },
    onPopupClose() {
      return
    }
  }
}
</script>
<style lang="less" scoped>
.coin-list {
  padding: 0 30px;
  .item {
    padding: 13px 0;
    border-bottom: 1px solid #EEEEEE;
    .icon {
      img {
        height: 28px;
        width: 28px;
      }
    }
    .name {
      margin-left: 10px;
      .top{
        font-size: 16px;
        color: #222222;
      }
      .bottom{
        opacity: 0.3;
        font-size: 10px;
        color: #000000;
      }
    }
    .right {
      margin-left: 10px;
    }
  }
}
</style>
