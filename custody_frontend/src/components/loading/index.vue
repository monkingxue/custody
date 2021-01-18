<template>
  <div class="loadEffect">
    <div><span :style="`background: ${color};`" /></div>
    <div><span :style="`background: ${color};`" /></div>
    <div><span :style="`background: ${color};`" /></div>
    <div><span :style="`background: ${color};`" /></div>
    <div><span :style="`background: ${color};`" /></div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#fff"
    }
  }
}
</script>

<style lang="less">
.loadEffect {
  width: 10px;
  height: 10px;
  margin: 0 auto;
  position: relative;
  display: inline-block;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    animation: load 1s linear infinite;

    span{
      display: inline-block;
      width: 50%;
      height: 50%;
      border-radius: 50%;
      background: #FFF;
      position: absolute;
      left: 50%;
      margin-top: -100%;
      margin-left: -100%;
    }

    &:nth-child(1){
      animation-delay:0.1s;
    }

    &:nth-child(2){
      animation-delay:0.2s;
    }

    &:nth-child(3){
      animation-delay:0.3s;
    }

    &:nth-child(4){
      animation-delay:0.4s;
    }

    &:nth-child(5){
      animation-delay:0.5s;
    }

  }

}

@keyframes load{
  0%{
    transform: rotate(0deg);
  }
  10%{
    transform: rotate(45deg);
  }
  50%{
    opacity: 1;
    transform: rotate(160deg);
  }
  62%{
    opacity: 0;
  }
  65%{
    opacity: 0;
    transform: rotate(200deg);
  }
  90%{
    transform: rotate(340deg);
  }
  100%{
    transform: rotate(360deg);
  }

}

</style>
