<template>
  <div class="vip">
    <div class="background">
      <div class="bg-vip1">
        <div
          class="bg-vip2"
          :class="{activeBg: currentCard >= 2}"
        >
          <div
            class="bg-vip3"
            :class="{activeBg: currentCard >= 3}"
          >
            <div
              class="bg-vip4"
              :class="{activeBg: currentCard >= 4}"
            >
              <div
                class="bg-vip5"
                :class="{activeBg: currentCard >= 5}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <SwiperTab
        v-if="currentCard"
        v-model="currentCard"
        swipeable
        :pad="swiperPad"
      >
        <SwiperItem
          v-for="(item, index) in [1,2,3,4,5]"
          :id="item"
          :key="item"
        >
          <div class="card-item">
            <div class="card-item-main">
              <img :src="(getDisplayExtra(item) ? cardImg : cardImgO)[index]">
            </div>
            <div class="card-extra">
              {{ getDisplayExtra(item) }}
            </div>
            <div class="card-info">
              <div
                :style="{
                  paddingTop: `${paddingTop}px`,
                  paddingLeft: `${paddingLeft}px`
                }"
              >
                <div
                  v-if="vipLevel[index]"
                  class="progress"
                >
                  <div class="label">
                    等级要求：
                  </div>
                  <p class="din">
                    持仓 {{ vipStatue.balance_btc_total | toFixed(4) }} / {{ vipLevel[index][1] }} BTC
                  </p>
                  <p
                    v-if="vipLevel[index][2]"
                    class="din"
                  >
                    30天交易额 {{ vipStatue.trade_volume_btc_total | toFixed(4) }} / {{ vipLevel[index][2] }} BTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SwiperItem>
      </SwiperTab>
    </div>
    <div class="main">
      <div class="special">
        <Title>产品特权 ({{ specialCount }}/4)</Title>
        <div class="flex-left-right showcase">
          <div
            class="touch-opacity"
            :class="{unavaliable: currentCard < 1}"
            @click="() => onGoToDetail('fee')"
          >
            <img :src="feeImg[currentCard - 1]">
            <span>手续费折扣</span>
          </div>
          <div
            class="touch-opacity"
            :class="{unavaliable: currentCard < 1}"
            @click="() => onGoToDetail('interest')"
          >
            <img :src="interestImg[currentCard - 1]">
            <span>存币生息</span>
          </div>
          <div
            class="touch-opacity"
            :class="{unavaliable: currentCard < 2}"
            @click="() => onGoToDetail('air')"
          >
            <img :src="airImg[currentCard - 1]">
            <span>空投奖励</span>
          </div>
          <div
            class="touch-opacity"
            :class="{unavaliable: currentCard < 2}"
            @click="() => onGoToDetail('gift')"
          >
            <img :src="giftImg[currentCard - 1]">
            <span>礼品赠送</span>
          </div>
        </div>
      </div>
      <div class="intro">
        <div class="vip-title1">
          <Title>VIP权益</Title>
        </div>
        <table class="vip-table">
          <thead>
            <tr>
              <th>权益类型</th>
              <th>VIP{{ currentCard }}</th>
              <th>下一等级 VIP{{ currentCard + 1 }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>手续费</th>
              <td>{{ serviceFee(currentCard) }} %</td>
              <td>{{ getDisplayNextLevel(`${serviceFee(currentCard + 1)} %`) }}</td>
            </tr>
            <tr>
              <th>空投占比</th>
              <td>{{ air[currentCard] }} %</td>
              <td>{{ getDisplayNextLevel(`${air[currentCard + 1]} %`) }}</td>
            </tr>
            <tr>
              <th>余币宝限额</th>
              <td>
                <div
                  v-for="(bi) in storeYubibaoSetting"
                  :key="bi.coin_name"
                >
                  {{ `${bi.vip_settings[currentCard - 1].share} ${bi.coin_name}` }}
                </div>
              </td>
              <td>
                <div
                  v-for="(bi) in storeYubibaoSetting"
                  :key="bi.coin_name"
                >
                  {{ getDisplayNextLevel(`${bi.vip_settings[currentCard].share} ${bi.coin_name}`) }}
                </div>
              </td>
            </tr>
            <tr>
              <th>余币利息增幅</th>
              <td>{{ ybbAdd[currentCard] }} %</td>
              <td>{{ getDisplayNextLevel(`${ybbAdd[currentCard + 1]} %`) }} </td>
            </tr>
          </tbody>
        </table>
        <div class="vip-title2">
          <Title>升级说明</Title>
        </div>
        <p class="intro-tip">
          注：任意数字货币资产均会被实时换算成BTC资产计入
          <br>
          每天 00:00 时刻更新 VIP 等级
        </p>
        <table class="vip-table">
          <thead>
            <tr>
              <th>VIP等级</th>
              <th>所需持仓资产</th>
              <th>30天交易额</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in vipLevel"
              :key="index"
            >
              <th>VIP {{ item[0] }}</th>
              <td>{{ item[1] }} BTC</td>
              <td>{{ item[2] }} BTC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Swiper, Indicator, Message } from 'components'
import BalanceMixin from '../yubibao/balanceMixin'
import Title from "./title"
const { SwiperTab, SwiperItem } = Swiper
const maxWidth = window.innerWidth
export default {
  components: {
    Title,
    SwiperTab,
    SwiperItem
  },
  mixins: [BalanceMixin],
  data() {
    return {
      paddingTop: maxWidth * 0.17,
      paddingLeft: maxWidth * 0.11,
      swiperPad: maxWidth * 0.08,
      currentCard: 0,
      vipStatue: {},
      cardImg: [
        require('../../assets/images/vip/card-vip1.png'),
        require('../../assets/images/vip/card-vip2.png'),
        require('../../assets/images/vip/card-vip3.png'),
        require('../../assets/images/vip/card-vip4.png'),
        require('../../assets/images/vip/card-vip5.png')
      ],
      cardImgO: [
        require('../../assets/images/vip/card-vip1-o.png'),
        require('../../assets/images/vip/card-vip2-o.png'),
        require('../../assets/images/vip/card-vip3-o.png'),
        require('../../assets/images/vip/card-vip4-o.png'),
        require('../../assets/images/vip/card-vip5-o.png')
      ],
      feeImg: [
        require('../../assets/images/vip/fee-1.png'),
        require('../../assets/images/vip/fee-2.png'),
        require('../../assets/images/vip/fee-3.png'),
        require('../../assets/images/vip/fee-4.png'),
        require('../../assets/images/vip/fee-5.png')
      ],
      interestImg: [
        require('../../assets/images/vip/interest-1.png'),
        require('../../assets/images/vip/interest-2.png'),
        require('../../assets/images/vip/interest-3.png'),
        require('../../assets/images/vip/interest-4.png'),
        require('../../assets/images/vip/interest-5.png')
      ],
      airImg: [
        require('../../assets/images/vip/air-1.png'),
        require('../../assets/images/vip/air-2.png'),
        require('../../assets/images/vip/air-3.png'),
        require('../../assets/images/vip/air-4.png'),
        require('../../assets/images/vip/air-5.png')
      ],
      giftImg: [
        require('../../assets/images/vip/gift-1.png'),
        require('../../assets/images/vip/gift-2.png'),
        require('../../assets/images/vip/gift-3.png'),
        require('../../assets/images/vip/gift-4.png'),
        require('../../assets/images/vip/gift-5.png')
      ],
      ybbAdd: DI.get('VIP_YUBIBAO_ADD_INTEREST'),
      air: DI.get('VIP_AIR')
    }
  },
  computed: {
    specialCount() {
      if (this.currentCard > 1) return 4
      return 2
    },
    setting() {
      return DI.get("store").state.setting.setting
    },
    vipLevel() {
      return this.setting.vip_level_ladder
    },
    account() {
      return DI.get("auth").getUser()
    },
    storePairBasic() {
      return DI.get("store").state.pair.pairBasic
    },
    pairInfo() {
      return this.storePairBasic['BTC_USDT'] || {}
    }
  },
  mounted() {
    DI.get("utils").setTitle("我的VIP")
    this.getRebateList()
    const vipLevel = this.account.credit_vip_level
    this.currentCard = vipLevel > 0 ? vipLevel : 1
  },
  methods: {
    serviceFee(level) {
      const discount = this.setting[`vip_bibi_offer.level_${level}`]
      if (!discount) return '-'
      return +(
        ((this.pairInfo.trade_fee * discount) / 100 +
          this.pairInfo.exchange_trade_fee) *
        100
      ).toFixed(3)
    },
    getDisplayNextLevel(text) {
      if (this.currentCard >= 5) return '敬请期待'
      return text
    },
    getDisplayExtra(item) {
      if (item === this.account.credit_vip_level) return '当前等级'
      return ''
    },
    getRebateList() {
      Indicator.open(this.$t('loading'))
      DI.get('accountHttp')
        .getVipStatus()
        .then((res) => {
          if (res.vip_level > 0) {
            this.currentCard = res.vip_level
          }
          this.vipStatue = res
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    onGoToDetail(name) {
      this.$router.push({ name: 'vipDetail',
        query: {
          name
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.vip {
  .main {
    position: relative;
    padding: 0 20px 20px;
  }
  .card{
    padding: 30px 0 0;
    .card-item {
      width: 98%;
      margin: 0 auto;
      position: relative;
      .card-item-main {
        padding: 2%;
      }
      img {
        width: 100%;
        box-shadow: 0 0px 7px 0 rgba(0, 0, 0, 0.35);
        border-radius: 8px;
      }
      .card-extra {
        top: 5.5%;
        right: 3.5%;
        position: absolute;
        color: #FFF;
        font-size: 11px;
        font-weight: bold;
      }
      .card-info {
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #222;
        .progress {
          margin-top: 3%;
          p{
            padding: 0;
            margin:0;
          }
        }
        .label {
          color: #999;
          padding: 3px 0;
        }
      }
    }
  }
  .special {
    padding-top: 35px;
    .showcase {
      padding-top: 20px;
      color: #FFF;
      img {
        width: 70%;
        display: block;
        margin: 0 auto;
      }
      span {
        margin-top: 4px;
        font-size: 12px;
        display: block;
        text-align: center;
      }
      .unavaliable {
        opacity: .3;
      }
    }
  }
  .intro {
    padding-top: 35px;
    .intro-tip {
      padding: 10px 0 25px;
      color: #FFF;
      font-size: 12px;
      text-align: center;
    }
  }
  .background {
    height: 100vh;
    width: 100%;
    position: fixed;
    overflow: hidden;
    div {
      transition: opacity 1s ease-in-out;
      height: 100%;
      width: 100%;
    }
  }
  .vip-title1 {
    margin-bottom: 20px;
  }
  .vip-title2 {
    margin-top: 20px;
  }
  .activeBg {
    opacity: 1!important;
  }
  .bg-vip1 {
    background: linear-gradient(to right, #f4e3d8, #a28d83);
  }
  .bg-vip2 {
    opacity: 0;
    background: linear-gradient(to right, #d3dee5, #828f9a);
  }
  .bg-vip3 {
    opacity: 0;
    background: linear-gradient(to right, #ffd66c, #ffb438);
  }
  .bg-vip4 {
    opacity: 0;
    background: linear-gradient(to right, #c5e0ed, #87b0c5);
  }
  .bg-vip5 {
    opacity: 0;
    background: linear-gradient(to right, #cbdbff, #8facea);
  }
}
</style>

