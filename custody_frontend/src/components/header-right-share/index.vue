<template>
  <div
    v-if="isFromApp"
    class="header-right-app-share-btn"
    @click="appShare"
  >
    <img src="../../assets/images/icon-share.png">
  </div>
</template>

<style scoped lang="less">
.header-right-app-share-btn {
  z-index: 99;
  position: fixed;
  top: 12px;
  right: 20px;
  width: 18px;
  height: 40px;
}
</style>

<script>
import { DI } from 'core'

export default {
  computed: {
    isFromApp() {
      return DI.get('utils').isFromApp()
    }
  },
  methods: {
    appShare() {
      DI.get("utils").appShare()
    }
  }
}
</script>
