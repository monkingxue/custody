<template>
  <header v-if="visible">
    <div
      class="back-bar special"
      :class="{
        'is-white': isWhite,
        'is-red': isRed,
        'is-darkblue': isDarkBlue,
        'is-miningblue': isMiningBlue,
        'is-black': isBlack,
        'is-yellow': isYellow,
        'is-purple': isPurple,
        'is-blue': isBlue,
      }"
    >
      <span class="back">
        <a
          class="top__back"
          @click="onBack"
        />
      </span>
      <h2>{{ title }}</h2>
      <div
        v-if="right.text"
        class="edit img-btn-dark"
        @click="(() => {right.action()})"
      >
        {{ right.text }}
      </div>
      <a
        v-if="right.share"
        class="top__share"
        @click="(() => {right.action()})"
      />
    </div>
    <div
      v-show="!hidePad"
      class="header-pad"
    />
  </header>
</template>

<script >
import { DI } from 'core'
export default {
  data() {
    return {
      title: '',
      left: {},
      right: {},
      hidePad: false
    }
  },
  computed: {
    visible() {
      if (this.$template === 'cobo' && this.$route.name === 'login') return false
      return ['home', 'explore', 'pair', 'wallet', 'account', 'imgPreview', 'landingA', 'landingRed', 'exchange', 'chart', 'search', 'buy', 'guide', 'myInvite', 'selectBI', 'stockDetail'].indexOf(this.$route.name) < 0
    },
    isWhite() {
      return ['login'].indexOf(this.$route.name) > -1
    },
    isRed() {
      return ['redEnvelope', 'redEnvelopePoster'].indexOf(this.$route.name) > -1
    },
    isDarkBlue() {
      return ['aboutUs'].indexOf(this.$route.name) > -1
    },
    isMiningBlue() {
      return ['mining'].indexOf(this.$route.name) > -1
    },
    isPurple() {
      return ['posterBibi'].indexOf(this.$route.name) > -1
    },
    isBlack() {
      return ['vip', 'vipDetail'].indexOf(this.$route.name) > -1
    },
    isYellow() {
      return ['yubibao', 'yubibaoOperation', 'yubibaoIntro', 'yubibaoResult', 'yubibaoHistory',
        'yubibaoOperationContract', 'yubibaoOperationContractDetail'].indexOf(this.$route.name) > -1
    },
    isBlue() {
      return ['portfolio'].indexOf(this.$route.name) > -1
    }
  },
  watch: {
    $route() {
      this.setBodyClass('white')
      this.left = {}
      this.right = {}
      this.hidePad = false
    }
  },
  mounted() {
    this.$nextTick(() => {
      DI.get('vue').$on('set-title', (title) => {
        this.title = title
      })
      DI.get('vue').$on('set-body', (name) => {
        this.setBodyClass(name)
      })
      DI.get('vue').$on('toggle-body-class', (name) => {
        this.toggleBodyClass(name)
      })
      DI.get('vue').$on('hide-pad', () => {
        this.hidePad = true
      })
      DI.get('vue').$on('set-header-left', (slot) => {
        setTimeout(() => {
          this.left = slot
        }, 10)
      })
      DI.get('vue').$on('revert-header-left', () => {
        setTimeout(() => {
          this.left = {}
        }, 10)
      })
      DI.get('vue').$on('set-header-right', (slot) => {
        setTimeout(() => {
          this.right = slot
        }, 10)
      })
    })
  },
  methods: {
    setBodyClass(name) {
      try {
        document.body.className = name
      } finally {
        // empty
      }
    },
    toggleBodyClass(name) {
      document.body.classList.toggle(name)
    },
    onBack() {
      if (this.left && this.left.action) {
        this.left.action()
      } else {
        const { from } = this.$route.query
        if (from) {
          this.$router.push({
            name: from
          })
          return
        }
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style>
.header-pad {
  width: 100%;
  height: 44px;
}
.back-bar {
  margin: 0 auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  overflow: hidden;
  color: #fff;
  /* background-color: #3f46b4; */
  background-color: #4140bb;
  z-index: 98;
}

.app-share-wrap .back-bar .back {
  display: none;
}
.app-share-wrap .share-btn {
  display: none;
}

.is-white.back-bar {
  background-color: #fff;
  color: #999;
}

.is-red.back-bar {
  background-color: #EC4A4A;
}

.is-darkblue.back-bar {
  background-color: #051694;
}
.is-miningblue.back-bar {
  background-color: #001F3A;
}
.is-black.back-bar {
  background-color: #3A384E;
}
.is-yellow.back-bar {
  background-color: #D6AF74;
}
.is-purple.back-bar {
  background-color: #4200AA;
}
.is-blue.back-bar {
  background-color:  #4691F9;
}
.back-bar .back {
  position: absolute;
  top: -2px;
  left: 0px;
  text-align: center;
}

.back-bar h2 {
  width: 70%;
  margin: 0 auto;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: normal;
}

.top__back {
  float: left;
  width: 42px;
  height: 44px;
}

.top__back:before {
  content: "";
  display: block;
  margin: 15px 0 0 16px;
  width: 10px;
  height: 16px;
  background: url(../../assets/images/back.png) no-repeat;
  background-size: 10px 16px;
}

.top__share:before {
  content: "";
  display: block;
  position: absolute;
  top: 12px;
  right: 14px;
  width: 18px;
  height: 21px;
  background: url(../../assets/images/icon-share.png) no-repeat;
  background-size: 100%;
}

.is-white .top__back:before {
  content: "";
  display: block;
  margin: 15px 0 0 16px;
  width: 14px;
  height: 22px;
  background: url(../../assets/images/back-black.png) no-repeat;
  background-size: 14px 22px;
}
.edit {
  position: absolute;
  top: 13px;
  right: 13px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
</style>
