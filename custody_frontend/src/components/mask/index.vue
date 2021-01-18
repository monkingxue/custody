<template>
  <div class="mask">
    <div :class="type|| 'black'" />
  </div>
</template>
<script>
export default {
  props: {
    type: String
  }
}
</script>
<style>
  .mask {
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 99;
  }
  .make .white {
    opacity: 0;
  }
  .mask .black{
    opacity: 0.5;
    width: 100%;
    height: 100%;
    background-color: #000;
  }
</style>
