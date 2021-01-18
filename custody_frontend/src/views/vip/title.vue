<template>
  <div class="vip-title">
    <span
      class="block"
      :style="{background: blockColor}"
    />
    <span
      :style="{color}"
      class="title"
    >
      <slot />
    </span>
    <span
      class="block"
      :style="{background: blockColor}"
    />
  </div>
</template>

<style>
</style>

<script>
export default {
  props: {
    blockColor: {
      type: String,
      default: "#FFF"
    },
    color: {
      type: String,
      default: "#FFF"
    }
  }
}
</script>
<style scoped lang="less">
.vip-title {
  text-align: center;
  padding: 5px 0;
  .title {
    font-size: 18px;
    font-weight: bold;
    padding: 0 5px;
    vertical-align: middle;
  }
  .block {
    font-size: 16px;
    display: inline-block;
    width: 7px;
    height: 7px;
    transform: rotate(45deg);
  }
}
</style>

