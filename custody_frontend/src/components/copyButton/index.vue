<template>
  <span>
    {{ hideText ? '' : (displayText || text) }}
    <span
      :id="clipboardId"
      class="copy-button icon-copy copy-item"
      :data-clipboard-text="text"
      @click="copy"
    />
  </span>
</template>
<style>
.copy-item {
  display: inline-block;
}
.copy-item:after {
  content: ' ';
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
<script>
import Clipboard from 'clipboard'
import { Toast } from 'vant'

export default {
  props: {
    text: {
      type: [Number, String],
      default: ''
    },
    displayText: {
      type: [Number, String],
      default: ''
    },
    hideText: {
      type: [Boolean],
      default: false
    }
  },
  computed: {
    clipboardId() {
      return `clipboardId-${Date.now()}-${Math.round(Math.random() * 1000)}`
    }
  },
  methods: {
    copy() {
      const clipboard = new Clipboard(`#${this.clipboardId}`)
      clipboard.on('success', () => {
        Toast(this.$t('copySuccess'))
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        clipboard.destroy()
      })
    }
  }
}
</script>
