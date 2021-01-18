<template>
  <div
    class="my-invite"
  >
    <HeaderCommon
      title="我的邀请"
    />
    <div class="top-reward">
      <img
        class="reward-title"
        src="../../assets/images/invite-title-all.png"
      >
      <div class="reward-amount din">
        {{ btc }} BTC
      </div>
      <img
        v-if="vipLevel >= 0 && vipLevel < 5"
        class="reward-level"
        :src="levelImg[vipLevel]"
      >
      <img
        v-else
        class="reward-level"
        src="../../assets/images/icon-invite-lv.png"
      >
      <div class="reward-info">
        <span>好友数：{{ inviteCount }}</span>
        <div class="devider" />
        <span>返佣：{{ inviteInfo.rate }}%</span>
      </div>
      <div class="progress">
        <div class="label active">
          黑铁
        </div>
        <div
          class="bar active"
          :class="{full: vipLevel > 0}"
        />
        <div
          class="label"
          :class="{active: vipLevel > 0}"
        >
          青铜
        </div>
        <div
          class="bar"
          :class="{
            active: vipLevel > 0,
            full: vipLevel > 1
          }"
        />
        <div
          class="label"
          :class="{active: vipLevel > 1}"
        >
          白银
        </div>
        <div
          class="bar"
          :class="{
            active: vipLevel > 1,
            full: vipLevel > 2
          }"
        />
        <div
          class="label"
          :class="{active: vipLevel > 2}"
        >
          黄金
        </div>
        <div
          class="bar"
          :class="{
            active: vipLevel > 2,
            full: vipLevel > 3
          }"
        />
        <div
          class="label"
          :class="{active: vipLevel > 3}"
        >
          钻石
        </div>
      </div>
      <van-button
        size="large"
        round
        class="orange-btn invite-btn"
        @click="goToInvite"
      >
        立即邀请
      </van-button>
      <div class="reward-tip">
        还需邀请{{ inviteInfo.count - inviteCount }}位实名好友，可晋升为{{ nextInviteInfo.name }}会员
      </div>
      <div
        class="reward-qa"
        @click="showTip"
      >
        <span>邀请奖励说明</span>
        <img src="../../assets/images/icon-qa.png">
      </div>
    </div>
    <div class="invite-history">
      <div class="main-history">
        <div class="nav">
          <span
            class="mr5 font12 graycolor touchBlack"
            :class="[
              invitelistShow ? 'bold font16 blackcolor' : '',
              isInviteTabRedDot() && 'reddot'
            ]"
            @click="inviteActive"
          >
            我的邀请
          </span>
          <span
            class="ml5 font12 graycolor touchBlack"
            :class="[
              historylistShow ? 'bold font16 blackcolor' : '',
              isRebateTabRedDot() && 'reddot'
            ]"
            @click="historyActive"
          >
            返佣明细
          </span>
        </div>
        <div class="line" />
        <div v-if="invitelistShow">
          <ul
            v-if="invitelist.length"
            class="history-list"
          >
            <li
              v-for="item in invitelist"
              :key="item.customer.id"
            >
              <span>{{ formatMobile(item.customer) }}</span>
              <span>{{ item.customer.name ? item.customer.name[0] : '*' }}**</span>
              <span>
                <span v-if="item.customer.name">+ {{ item.amount }} {{ item.currency }}</span>
                <span v-else>未实名</span>
              </span>
            </li>
          </ul>
          <div
            v-if="invitelist.length === 0"
            class="no-record"
          >
            <img
              src="../../assets/images/empty.svg"
              width="60"
            >
            <span>{{ $t('noRecords') }}</span>
          </div>
          <div
            v-if="showMore"
            class="history-more"
            @click="getMoreInvite"
          >
            {{ $t('viewMore') }} &gt;
          </div>
        </div>

        <div v-if="historylistShow">
          <div
            v-if="historylist.length === 0"
            class="no-record"
          >
            <img
              src="../../assets/images/empty.svg"
              width="60"
            >
            <span>{{ $t('noRecords') }}</span>
          </div>
          <div
            v-else
            class="history-list"
          >
            <ul>
              <li
                v-for="item in historylist"
                :key="`${item.created_at}${item.customer.id}`"
              >
                <span>
                  {{ $dayjs.unix(item.created_at).format('MM月DD日 HH:mm:ss') }}
                </span>
                <span>{{ item.customer.name ? item.customer.name[0] : '*' }}**</span>
                <span class="time">+{{ item.amount }}{{ item.currency }}</span>
              </li>
            </ul>
          </div>
          <div
            v-if="showMoreHistory"
            class="history-more"
            @click="getMoreHistory"
          >
            {{ $t('viewMore') }} &gt;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { HeaderCommon } from 'components'
import { Dialog } from 'vant'
import RedDot from './reddot'

const LEVEL = [
  { count: 1, rate: 0, name: '黑铁' },
  { count: 10, rate: 20, name: '青铜' },
  { count: 100, rate: 30, name: '白银' },
  { count: 1000, rate: 40, name: '黄金' },
  { count: 1000000, rate: 50, name: '钻石' },
  { count: 1000000, rate: 50, name: '最强' }
]

export default {
  components: {
    HeaderCommon
  },
  mixins: [RedDot],
  data() {
    return {
      vipLevel: 0,
      levelImg: [
        require('../../assets/images/icon-invite-lv0.png'),
        require('../../assets/images/icon-invite-lv1.png'),
        require('../../assets/images/icon-invite-lv2.png'),
        require('../../assets/images/icon-invite-lv3.png'),
        require('../../assets/images/icon-invite-lv4.png')
      ],
      index: 1,
      invitelistShow: true,
      historylistShow: false,
      historyIndex: 1
    }
  },
  computed: {
    showMore() {
      return this.invitelist.length < this.inviteTotal
    },
    showMoreHistory() {
      return this.historylist.length < this.rebateTotal
    },
    nextInviteInfo() {
      return LEVEL[this.vipLevel + 1]
    },
    inviteInfo() {
      return LEVEL[this.vipLevel]
    },
    inviteCount() {
      return this.account.invite_count
    },
    account() {
      return DI.get('auth').getUser()
    },
    btc() {
      return this.inviteData.btc_total || '*'
    },
    invitelist() {
      return this.inviteData.items || []
    },
    historylist() {
      return this.rebateData.items || []
    }
  },
  watch: {
    inviteCount: {
      immediate: true,
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.calLevel()
        }
      }
    }
  },
  methods: {
    inviteActive() {
      this.invitelistShow = true
      this.historylistShow = false
      this.setInviteTabClick()
    },
    historyActive() {
      this.invitelistShow = false
      this.historylistShow = true
      this.setRebateTabClick()
    },
    calLevel() {
      const len = LEVEL.length
      for (let i = 0; i < len; i += 1) {
        if (this.inviteCount < LEVEL[i].count) {
          break
        }
        this.vipLevel = i + 1
      }
    },
    formatMobile(account){
      return account.identity && account.identity.split('-')[1]
    },
    showTip() {
      Dialog.alert({
        title: '邀请奖励说明',
        messageAlign: 'left',
        message: `邀请1～9位实名好友，成为青铜会员，获每位好友交易手续费的20%。

邀请10～99位实名好友，成为白银会员，获每位好友交易手续费的30%。

邀请100～999位实名好友，成为黄金会员，获每位好友交易手续费的40%。

邀请1000位以上实名好友，成为钻石会员，获每位好友交易手续费的50%。`
      })
    },
    getMoreInvite() {
      this.index += 1
      DI.get('store').dispatch('SYNC_INVITE', { page: this.index })
    },
    getMoreHistory() {
      this.historyIndex += 1
      DI.get('store').dispatch('SYNC_REBATE', { page: this.historyIndex })
    },
    goToInvite() {
      this.$router.push({
        name: 'invite'
      })
    }
  }
}
</script>
<style scoped lang="less">
.my-invite {
  .invite-btn {
    width: 60%;
    margin: 10px 0 5px;
    height:46px;
    border:1px solid #3f46b4!important;
    color:#FFF!important;
    background:#3f46b4!important;
    border-radius: 4px;
    box-shadow: none;
  }
  .top-reward {
    background: url(../../assets/images/invite-my-bg.png) repeat;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    color: #FFF;
    .reward-title {
      width: 50%;
      margin-top:35px;
    }
    .reward-amount {
      font-size: 30px;
      padding: 20px 0;
      color: #FFD7AB;
      overflow:hidden
    }
    .reward-level {
      width: 30%;
    }
    .reward-info {
      padding: 20px 0;
      font-size: 14px;
      .devider {
        display: inline-block;
        width: 2px;
        height: 16px;
        margin: 0 8px 0 10px;
        background: #666676;
        vertical-align: text-top;
      }
    }
    .reward-tip {
      padding: 5px 0;
      font-size: 12px;
      color:rgba(255, 255, 255, 0.6);
    }
    .reward-qa{
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      padding-bottom: 15px;
      &:active{
        color: #FFF;
      }
      img {
        display: inline-block;
        height: 13px;
        vertical-align: middle;
      }
    }
  }
  .progress {
    padding-bottom: 10px;
    width: 95%;
    font-size: 12px;
    .label {
      display: inline-block;
      color: #666676;
      width: 8%;
      vertical-align: sub;
        text-align: center;
    }
    .bar {
      display: inline-block;
      background: #666676;
      height: 2px;
      width: 6%;
      position: relative;
        margin: 0 1%;
      }
      .label.active {
        color: #FFF;
      }
      .bar.full {
        background: #FFF;
      }
      .bar.active:after {
        content: '';
        background: #FFF;
        height: 2px;
      width: 50%;
      position: absolute;
      left: 0;
      }
  }
  .invite-history {
    min-height: 40vh;
    background: #FFF;
    padding: 0 30px;

    .main-history {
      .nav span {
        display: inline-block;
        line-height: 22px;
        padding: 20px 0;
      }
      .nav span::after {
        top: 50%;
        margin-top: -12px;
        margin-right: -2px;
      }
      .history-title {
        width: 40%;
        margin: 0 auto;
      }
      .line {
        margin: 0 0 20px;
        width: 100%;
        border-bottom: 1px solid #eee;
      }
      .history-list {
        font-size: 12px;
        color: rgba(34, 34, 34, 0.6);
        text-align: left;
        li {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
        }
        span {
          display: flex;
          flex: 1.4 1;
          &:nth-child(2){
            flex-grow: 0.5;
          }
          &:last-child{
            flex-grow: 1.2;
            justify-content: flex-end;
          }
        }
      }
      .history-more {
        margin-top: 20px;
        font-size: 12px;
        color: rgba(34, 34, 34, 0.6);
        text-align: center;
      }
      .no-record {
        img {
          display: block;
          margin: 0 auto;
        }
        span {
          display: block;
          padding: 20px 0;
          color: #999;
          text-align: center;
        }
      }
    }
  }
}
</style>
<style>
.touchBlack:active {
  color:#222;
}
</style>
