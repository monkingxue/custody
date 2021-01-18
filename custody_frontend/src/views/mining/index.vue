<template>
  <div class="mining-wrap">
    <div class="bi-sum">
      <div
        class="flex-align balance-item din"
        @click="() => showDialog('transfer', 'BTC')"
      >
        <img
          :src="getBiIcon('BTC')"
          width="18"
        >
        <span class="unit"> BTC </span>
        <ScrollNumber
          :height="10"
          :width="6"
          class="num"
          :number="bountyBalance['BTC']"
        />
      </div>
      <div
        class="flex-align balance-item din"
        @click="() => showDialog('transfer', 'USDT')"
      >
        <img
          :src="getBiIcon('USDT')"
          width="18"
        >
        <span class="unit"> USDT </span>
        <ScrollNumber
          :height="10"
          :width="6"
          class="num"
          :number="bountyBalance['USDT']"
        />
      </div>
      <div
        class="flex-align desc"
        @click="() => showDialog('desc')"
      >
        <img
          src="../../assets/images/mining/icon-desc.png"
          width="20"
        >
        挖矿说明
      </div>
    </div>

    <div
      v-if="tasks.length && ballPositions.length"
      class="floating-wrap"
    >
      <div
        v-for="(item, index) in tasks"
        :key="item.id || item.create_time"
        :ref="`crystal_${index}`"
        class="elem floating"
        :style="{
          left: `${biPosition(item) ? '44%' : ballPositions[index]['x'] + 'px'}`,
          top: `${biPosition(item) ? '46%' : ballPositions[index]['y'] + 'px'}`
        }"
      >
        <div
          v-if="!hasRandomTaskFlag && crystalType(item) === 'NEW' && isNewDisplay(item)"
          :class="[
            'crystal_box countdown',
            miningCurInfo(item)['ballClass'],
          ]"
        >
          <!-- new crystal -->
          <div
            class="circle"
            :style="{ width: `${ballDia}px`, height: `${ballDia}px` }"
          >
            <img
              :src="miningCurInfo(item)['icon']"
              :height="crystalHeight"
            >
          </div>
          <span :style="{ fontSize: `${crystalFont}px` }">
            {{ countdownText }}
            <br> 新币生成中
          </span>
          <div
            class="circle-line"
            :style="{
              width: `${ballDia}px`,
              height: `${ballDia}px`,
              marginLeft: `-${Math.round(ballDia / 2)}px`
            }"
          />
        </div>
        <div
          v-if="crystalType(item) !== 'NEW'"
          :class="[
            'crystal_box',
            miningCurInfo(item)['ballClass'],
          ]"
          @click="() => collectCrystal(item, index)"
        >
          <div
            class="circle"
            :style="{ width: `${ballDia}px`, height: `${ballDia}px` }"
          >
            <img
              :src="miningCurInfo(item)['icon']"
              :height="crystalHeight"
            >
          </div>
          <span
            class="amount din"
            :style="{ fontSize: `${crystalFont}px` }"
          >
            {{ item.bonus_amount }} {{ item.coin_name }}
          </span>
          <!-- task status:1 -->
          <div
            v-if="crystalType(item) === 'TASK' && item.status === 1"
            class="circle-flashing"
            :style="{
              width: `${ballDia}px`,
              height: `${ballDia}px`,
              marginLeft: `-${Math.round(ballDia / 2)}px`
            }"
          />
        </div>
      </div>
    </div>

    <div class="instructions">
      活动最终解释权归aBTC所有 <br>
      使用多个账户恶意挖币会导致资产冻结
    </div>

    <CustomDialog
      :type="dialogType"
      :callback="dialogCallback"
      :coin-name="coinName"
      :bonus-amount="bonusAmount"
    />
    <PopUp
      ref="popupVip"
      title="温馨提示"
      btn-text="如何升级"
      @confirm="onVipPopupConfirm"
    >
      <div class="popup-vip tc">
        天天挖币为平台VIP用户专享福利
      </div>
    </PopUp>
  </div>
</template>
<script>
import { DI } from "core"
import { ScrollNumber, Message, PopUp } from "components"
import { Toast } from "vant"
import CustomDialog from "./customDialog"
// import TEMP_TASKS from "./tempTasks"

const WIN_WIDTH = window.innerWidth
const WIN_HEIGHT = window.innerHeight

const GAME_AREA_MAX_W = WIN_WIDTH * 0.95
const GAME_AREA_MAX_H = WIN_HEIGHT - 110 - 10
const BALLS_MAX_NUM = 15 // 12 + 3
const BALL_DIA_L = 48
const BALL_DIA_S = 36
const BALL_W = 66 // 0.12345678 BTC width
const BALL_H_OTHER = 20 // 12 + 4 + 4

const MINING_INFO = {
  BTC: {
    icon: require("../../assets/images/mining/ball-yellow.png"),
    ballClass: "yellow"
  },
  USDT: {
    icon: require("../../assets/images/mining/ball-green.png"),
    ballClass: "green"
  },
  TASK: {
    icon: require("../../assets/images/mining/ball-purple.png"),
    ballClass: "purple"
  },
  NEW: {
    icon: require("../../assets/images/mining/ball-yellow.png"),
    ballClass: "yellow"
  }
}

export default {
  components: {
    CustomDialog,
    ScrollNumber,
    PopUp
  },
  data() {
    return {
      miningInfo: MINING_INFO,
      ballPositions: [],
      bountyBalance: {
        'BTC': "--",
        'USDT': "--"
      },
      tasks: [],
      randomTaskNum: 0,
      hasRandomTaskFlag: true,
      bountyTaskNum: 0,
      hasBountyTaskFlag: true,

      countdownText: "",
      countdownTimer: null,
      dialogType: "",
      coinName: "",
      bonusAmount: "",
      dialogCallback: null,
      syncBalanceTimer: null
    }
  },
  computed: {
    storeAccount() {
      return DI.get('auth').getUser()
    },
    gameAreaWidth() {
      return GAME_AREA_MAX_W
    },
    ballWidth() {
      return BALL_W
    },
    gameAreaHeight() {
      return (this.gameAreaWidth * GAME_AREA_MAX_H) /
        (this.ballWidth * (BALL_DIA_L + BALL_H_OTHER)) <
        BALLS_MAX_NUM * 3
        ? GAME_AREA_MAX_H
        : GAME_AREA_MAX_H - WIN_WIDTH * 0.42
    },
    ballDia() {
      // ball diameter
      return (this.gameAreaWidth * this.gameAreaHeight) /
        (this.ballWidth * (BALL_DIA_L + BALL_H_OTHER)) <
        BALLS_MAX_NUM * 2.5
        ? BALL_DIA_S
        : BALL_DIA_L
    },
    ballHeight() {
      return this.ballDia + BALL_H_OTHER
    },
    crystalHeight() {
      return this.ballDia === BALL_DIA_L ? 30 : 22
    },
    crystalFont() {
      return this.ballDia === BALL_DIA_L ? 9 : 8
    }
  },
  mounted() {
    this.getBountyTasks()
    this.refreshBalance()
    this.syncBalanceTimer = setInterval(() => {
      this.refreshBalance()
    }, 1000 * 10)

    this.$nextTick(() => {
      DI.get("utils").setTitle("天天挖币")
      DI.get("utils").setBody("bacmining")
      if (DI.get("utils").isFromApp()) {
        DI.get("vue").$emit("set-header-right", {
          share: true,
          action: this.appShare
        })
      }
    })

    DI.get("vue").$on("set-dialog-type", () => {
      this.resetDialogData()
    })
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.syncBalanceTimer)
    clearTimeout(this.countdownTimer)
    next()
  },
  methods: {
    biPosition(item) {
      return !this.hasBountyTaskFlag && !this.hasRandomTaskFlag && this.crystalType(item) === "NEW"
    },
    getBiIcon(coin) {
      return DI.get('BI_LOCAL_ICON')[coin]
    },
    crystalType(item) {
      if (item.task_type === 'next_random_bounty') {
        return "NEW"
      }
      if (item.task_type && item.task_type !== 'random_bounty') {
        return "TASK"
      }
      return item.coin_name
    },
    miningCurInfo(item) {
      if (this.crystalType(item) === 'TASK') {
        return this.miningInfo["TASK"]
      } else if (this.crystalType(item) === 'NEW') {
        return this.miningInfo["NEW"]
      }
      return this.miningInfo[item.coin_name]
    },
    refreshBalance() {
      DI.get("miningHttp")
        .getBountyBalance()
        .then(res => {
          res.coins && res.coins.forEach((item) => {
            this.bountyBalance[item.currency] = item.amount
          })
        })
        .catch(Message)
    },
    setRandomTasksFlag() {
      let randomTaskNum = 0
      this.tasks.forEach((item) => {
        if (item.task_type === 'random_bounty') {
          randomTaskNum++
        }
      })
      this.randomTaskNum = randomTaskNum
      this.bountyTaskNum = this.tasks.length - 1 - randomTaskNum
      if (randomTaskNum <= 0) {
        this.hasRandomTaskFlag = false
        this.startCountdown()
      } else {
        this.hasRandomTaskFlag = true
      }
      if (this.bountyTaskNum <= 0) {
        this.hasBountyTaskFlag = false
      } else {
        this.hasBountyTaskFlag = true
      }
    },
    getBountyTasks() {
      DI.get("miningHttp")
        .getBountyTasks()
        .then(res => {
          // this.tasks = res.tasks.length > 10 ? res.tasks : TEMP_TASKS
          this.tasks = res.tasks
          this.getBallPositions(this.tasks.length)
          this.setRandomTasksFlag()
        })
        .catch(Message)
    },
    postBountyTask(item, index) {
      const crystalElem = this.$refs[`crystal_${index}`][0]
      const flyingClass = `flying-${item.coin_name.toLowerCase()}`
      if (crystalElem.classList.contains('loading')) {
        return
      }
      crystalElem.classList.add('loading')

      DI.get("miningHttp")
        .postBountyTask({ id: item.id, status: 2 })
        .then(() => {
          setTimeout(() => {
            crystalElem.classList.add(flyingClass)
            crystalElem.classList.remove("shake")
          }, 200)
          setTimeout(() => {
            crystalElem.classList.add("elem-hide")
            if (item.task_type === "random_bounty") {
              this.randomTaskNum--
            } else if (item.task_type !== "next_random_bounty") {
              this.bountyTaskNum--
            }
            if (this.randomTaskNum <= 0) {
              this.hasRandomTaskFlag = false
              this.startCountdown()
            }
            if (this.bountyTaskNum <= 0) {
              this.hasBountyTaskFlag = false
            }
          }, 780)
          setTimeout(() => {
            this.refreshBalance()
          }, 800)
        })
        .catch(Message)
        .then(() => {
          crystalElem.classList.remove("shake")
        })
    },
    postTransferBounty(currency) {
      DI.get("miningHttp")
        .postTransferBounty({ currency })
        .then(() => {
          Toast.success("划转成功")
          setTimeout(() => {
            this.refreshBalance()
          }, 800)
        })
        .catch(Message)
    },
    isNewDisplay(item) {
      const timeCur = Math.floor(new Date().getTime() / 1000)
      return item.create_time > timeCur
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    getBallPositions(tasksLen) {
      // random all balls position
      const gameWidth = this.gameAreaWidth - this.ballWidth
      const gameHeight = this.gameAreaHeight - this.ballHeight
      const len = tasksLen || BALLS_MAX_NUM

      let protectionTimes = 0
      let ballPositions = []
      while (ballPositions.length < len) {
        let overlapping = false
        const positionX = this.getRandomInt(gameWidth)
        const positionY = this.getRandomInt(gameHeight)

        for (let l = 0; l < ballPositions.length; l++) {
          const item = ballPositions[l]
          if (
            Math.abs(positionX - item.x) < this.ballWidth &&
            Math.abs(positionY - item.y) < this.ballHeight
          ) {
            overlapping = true
            break
          }
        }
        if (!overlapping) {
          ballPositions.push({ x: positionX, y: positionY })
        }

        protectionTimes++
        if (protectionTimes > 10000) {
          break
        }
      }
      this.ballPositions = ballPositions
      // console.log("ballPositions length: ", this.ballPositions.length) // eslint-disable-line no-console
    },
    showDialog(type, item) {
      if (type === 'transfer') {
        this.bonusAmount = this.bountyBalance[item]
        this.coinName = item
        this.dialogType = `transfer${item}`
        this.dialogCallback = () => {
          this.postTransferBounty(item)
        }
        return
      }
      this.dialogType = type
    },
    resetDialogData() {
      this.dialogType = ""
      this.coinName = ""
      this.bonusAmount = ""
      this.dialogCallback = null
    },
    collectCrystal(item, index) {
      const vipLevel = this.storeAccount.credit_vip_level
      if (!vipLevel || vipLevel < 1) {
        this.$refs.popupVip.onOpen()
        return
      }
      if (this.crystalType(item) === 'NEW') {
        return
      }
      if (item.task_type && item.status === 0) {
        this.bonusAmount = item.bonus_amount
        this.coinName = item.coin_name
        this.showDialog(item.task_type)
        return
      }
      const crystalElem = this.$refs[`crystal_${index}`][0]
      crystalElem.classList.remove("floating")
      crystalElem.classList.add("shake")
      this.postBountyTask(item, index)
      // const flyingClass = `flying-${item.coin_name.toLowerCase()}`
      // setTimeout(() => {
      //   crystalElem.classList.add(flyingClass)
      //   crystalElem.classList.remove("shake")
      // }, 500)
      // setTimeout(() => {
      //   crystalElem.classList.add("elem-hide")
      //   if (item.task_type === "random_bounty") {
      //     this.randomTaskNum--
      //   } else if (item.task_type !== "next_random_bounty") {
      //     this.bountyTaskNum--
      //   }
      //   if (this.randomTaskNum <= 0) {
      //     this.hasRandomTaskFlag = false
      //     this.startCountdown()
      //   }
      //   if (this.bountyTaskNum <= 0) {
      //     this.hasBountyTaskFlag = false
      //   }
      // }, 1100)
    },
    formatTime(time) {
      const hour = Math.floor(time / 3600) || 0
      const minute = Math.floor((time % 3600) / 60) || 0
      const second = Math.floor((time % 3600) % 60) || 0

      return `${hour < 10 ? "0" + hour : hour}:${
        minute < 10 ? "0" + minute : minute
      }:${second < 10 ? "0" + second : second}`
    },
    startCountdown() {
      if (this.countdownTimer) {
        return
      }
      const randomBounty = this.tasks.find(item => item.task_type === "next_random_bounty")
      if (!randomBounty) {
        return
      }
      const timestamp = randomBounty.create_time
      if (timestamp - new Date().getTime() / 1000 < 0) {
        return
      }

      clearTimeout(this.countdownTimer)
      this.countdownTimer = null
      this.countdownText = this.formatTime(
        Math.round(timestamp - new Date().getTime() / 1000)
      )

      const countdownTimerFn = () => setTimeout(() => {
        const timeDiff = Math.round(timestamp - new Date().getTime() / 1000)
        if (timeDiff <= 0) {
          this.countdownText = ""
          clearTimeout(this.countdownTimer)
          this.countdownTimer = null
          this.getBountyTasks()
          return
        }
        this.countdownText = this.formatTime(timeDiff)
        this.countdownTimer = countdownTimerFn()
      }, 1000)

      this.countdownTimer = countdownTimerFn()
    },
    appShare() {
      setTimeout(() => {
        DI.get("utils").appScreenshot()
      }, 100)
    },
    onVipPopupConfirm() {
      this.$router.push({ name: 'vip' })
    }
  }
}
</script>

<style scoped lang="less">
.mining-wrap {
  min-height: calc(100vh - 42vw - 44px);
  background: url("../../assets/images/mining/bg.jpg") left bottom no-repeat
    #001f3a;
  background-size: 100%;
  padding: 0 5% 42vw;
  position: relative;

  .instructions {
    position: absolute;
    bottom: 30px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 14px;
    width: 90%;
    text-align: center;
    font-size: 10px;
    font-weight: 500;
  }

  .bi-sum {
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 10px;
    padding: 20px 0;
    & > div {
      width: calc(32% - 13px);
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 13px;
      height: 26px;
      padding: 0px 10px 0px 3px;
      white-space: nowrap;
      img {
        margin-right: 5px;
      }
    }
    .balance-item {
      min-width: 104px;
    }
    .unit {
      line-height: 26px;
    }
    .desc {
      padding-left: 8px;
      width: calc(26% - 18px);
    }
    .num {
      margin-left: 4px;
      margin-top: -3px;
    }
  }

  .floating-wrap {
    position: relative;
    z-index: 2;
    min-height: calc(100vh - 42vw - 110px);
  }
  .elem {
    position: absolute;
    width: 66px;
    text-align: center;
    z-index: 1;
    will-change: transform;
    span {
      display: block;
      font-size: 9px;
      height: 12px;
      line-height: 12px;
      margin-top: 4px;
      color: #fff;
    }
  }
  .elem-hide {
    display: none;
  }
  .floating {
    animation: anim-floating 2s linear infinite running;
  }
  .shake {
    animation: anim-shake 0.5s linear infinite;
  }
  .flying-btc {
    animation: anim-flying-btc 0.6s linear;
    // animation-name: anim-shake, anim-flying-btc;
    // animation-duration: 0.5s, 0.6s;
    // animation-timing-function: linear, linear;
    // animation-delay: 0s, 0.5s;
    // animation-iteration-count: 1, 1;
    // animation-fill-mode: forwards, forwards;
  }
  .flying-usdt {
    animation: anim-flying-usdt 0.6s linear;
  }
  .circle-flashing{
    position: absolute;
    left: 50%;
    top: 0;
    border-radius: 50%;
    animation: anim-flashing 1s linear infinite running;
  }
  .circle,
  .circle-line {
    border-radius: 25px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .amount {
    white-space: nowrap;
  }
  .yellow .circle {
    box-shadow: 0 0 9px 0 #ffaf00 inset;
  }
  .green .circle {
    box-shadow: 0 0 9px 0 #6bdfb7 inset;
  }
  .purple .circle {
    box-shadow: 0 0 9px 0 #ff8edc inset;
  }
  // new crystal
  .countdown {
    position: relative;
    .circle {
      box-shadow: none;
    }
    .circle-line {
      position: absolute;
      left: 50%;
      top: 0;
      box-shadow: inset 0 0 0 2px rgba(107, 223, 183, 0.5);
      mask-image: linear-gradient(top, #000000, rgba(0, 0, 0, 0.1));
      animation: anim-rotate 2.5s infinite linear;
    }
    &.green .circle-line {
      box-shadow: inset 0 0 0 2px rgba(107, 223, 183, 0.5);
    }
    &.yellow .circle-line {
      box-shadow: inset 0 0 0 2px rgba(255, 175, 0, 0.5);
    }
  }

  @keyframes anim-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes anim-floating {
    0%,
    to {
      transform: translateY(0);
    }
    25% {
      transform: translateY(-3px);
    }
    75% {
      transform: translateY(3px);
    }
  }
  @keyframes anim-shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-3px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
  @keyframes anim-flying-btc {
    100% {
      // transform: scale(0.3);
      // opacity: 0;
      left: 8%;
      top: -30px;
    }
  }
  @keyframes anim-flying-usdt {
    100% {
      // transform: scale(0.3);
      // opacity: 0.1;
      left: 44%;
      top: -30px;
    }
  }
  @keyframes anim-flashing {
    from {
      box-shadow: 0 0 9px #333;
    }
    50% {
      box-shadow: 0 0 18px #ff99df;
    }
    to {
      box-shadow: 0 0 9px #333;
    }
  }
}
</style>
