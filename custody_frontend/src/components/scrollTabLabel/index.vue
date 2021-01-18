<template>
  <div
    class="buy-sell"
  >
    <ul>
      <li
        v-for="(item, i) in tabs"
        :key="item.value || item"
        :ref="`tabs-${i}`"
        :class="[{active: target === (item.value || item)}, 'img-btn-dark']"
        @click="() => onSwitchTargetClick(item.value || item)"
      >
        <span class="tabs-item touch-opacity">
          {{ item.text || item }}
          <span
            v-if="item.subText"
            class="sub-text"
          >
            (<span>{{ item.subText }}</span>)
          </span>
        </span>
      </li>
      <span
        v-if="tabs.length"
        class="bot"
        :style="{
          width: `${width}px`,
          transform: `translateX(${transform || 0}px)`,
          transition : transition
        }"
      />
    </ul>
  </div>
</template>
<script>
const TRANSITION = 'all .2s ease-in-out'
export default {
  props: {
    target: {
      type: String
    },
    tabs: {
      type: Array
    },
    dragPercentOffset: {
      type: Number
    }
  },
  data() {
    return {
      width: 36,
      transform: 0,
      fixedTransform: 0,
      transition: 'none',
      init: false
    }
  },
  computed: {
    index() {
      return this.tabs.findIndex((a) => (a.value || a)  === this.target)
    }
  },
  watch: {
    tabs: {
      handler() {
        this.cal()
      }
    },
    target: {
      immediate: true,
      handler() {
        this.cal()
      }
    },
    dragPercentOffset(e) {
      this.transition = 'none'
      const targetTab = this.$refs[`tabs-${this.index}`][0]
      this.transform = this.fixedTransform - (e * targetTab.offsetWidth)
      return
    }
  },
  methods: {
    cal() {
      if (this.index < 0) return
      this.$nextTick(() => {
        const targetTab = this.$refs[`tabs-${this.index}`][0]
        const leftSpace = this.$refs[`tabs-0`][0].getBoundingClientRect().left
        const targetTabRect = targetTab.getBoundingClientRect()
        this.width = targetTab.querySelector('span').offsetWidth
        this.transform = targetTabRect.left - leftSpace
        this.fixedTransform = this.transform
        if (this.init) {
          this.transition = TRANSITION
        }
        this.init = true
      })
    },
    onSwitchTargetClick(target) {
      this.$emit('change', target)
    }
  }
}
</script>

<style scoped lang="less">
.buy-sell {
  ul {
    display: flex;
    color: rgba(255,255,255,.6);
    font-weight: bold;
    position: relative;
    align-items: center;
    li {
      padding: 5px 20px 5px 0;
      cursor: pointer;
      &.active {
        color: #FFF;
      }
      .sub-text span{
        color: #F7931A;
      }
    }
    .bot {
      background: #FFF;
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      border-radius: 10px;
      margin-top: 5px;
    }
  }
}
</style>
