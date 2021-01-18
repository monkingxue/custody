<template>
  <div id="app">
    <app-download-banner />
    <app-header />
    <main>
      <transition
        :name="transitionName"
        mode="out-in"
      >
        <router-view />
      </transition>
    </main>
    <van-toast id="van-toast" />
    <app-navigator />
  </div>
</template>

<script>

import { Toast } from 'vant'
import { Navigator, Header, AppDownloadBanner } from 'components'
export default {
  name: 'App',
  components: {
    'app-download-banner': AppDownloadBanner,
    'app-navigator': Navigator,
    'app-header': Header
  },
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {//使用watch 监听$router的变化
    $route(to) {
      // 特殊页面不需要动画
      if (['search'].indexOf(to.name) > -1) {
        this.transitionName = ''
        return
      }
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index && to.meta.index > 0) {
        this.transitionName = 'fade'
      } else {
        this.transitionName = ''
      }
    }
  },
  mounted() {

    Toast.setDefaultOptions({
      duration: 1000
    })
  }
}
</script>

<style>
main > .container-white {
  background: white;
  -webkit-touch-callout: none;
}

main > .container-gray {
  background:#f1f2f4
}

/* Transitions */

.next-leave-to {
  animation: leaveToLeft 400ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

.next-enter-to {
  animation: enterFromRight 400ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.prev-leave-to {
  animation: leaveToRight 400ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.prev-enter-to {
  animation: enterFromLeft 400ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

@keyframes leaveToLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-25%);
  }
}

@keyframes enterFromLeft {
  from {
    transform: translateX(-25%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes leaveToRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes enterFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .08s ease-in-out;
  filter: blur(20px);
}
.fade-enter, .fade-leave-to {
  opacity: .8;
}
</style>
