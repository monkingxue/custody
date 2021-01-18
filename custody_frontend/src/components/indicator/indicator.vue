<template>
  <div v-if="visible">
    <div class="indicator-wrapper">
      <loading />
      <span
        v-if="text"
        class="indicator-text"
      >{{ text }}</span>
    </div>
    <white-mask type="white" />
  </div>
</template>
<script>
import Loading from '../loading'
import Mask from '../mask'

export default {
  components: {
    'loading': Loading,
    'white-mask': Mask
  },
  props: {
    text: String
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>
<style>
  .indicator-wrapper {
    top: 50%;
    left: 50%;
    padding: 20px;
    padding-top: 30px;
    position: fixed;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 7px;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index: 3000;
  }

  .indicator-text {
    display: block;
    color: #fff;
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
  }
</style>
