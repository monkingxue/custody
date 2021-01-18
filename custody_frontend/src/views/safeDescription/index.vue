<template>
  <div class="safe">
    <div class="section2">
      <img src="../../assets/images/about-s2.png">
      <span @click="goToBugcrowd">&nbsp;</span>
    </div>
  </div>
</template>

<script>
import { DI } from "core"
export default {
  data() {
    return {}
  },
  mounted() {
    DI.get("utils").setTitle("钱包安全说明")
  },
  methods: {
    goToBugcrowd() {
      window.location = "https://www.bugcrowd.com/"
    }
  }
}
</script>

<style scoped lang="less">
.safe {
  min-height: 100vh;
  background-color: #2b1a60;
  padding: 30px 0;
  div.section2 {
    position: relative;
    margin: 0 20px;
    span {
      position: absolute;
      display: block;
      left: 9%;
      bottom: 13%;
      width: 45%;
      height: 26px;
    }
  }
}
</style>