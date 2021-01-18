<template>
  <div
    v-show="$parent.swiping || id === $parent.currentActive"
    class="tab-container-item"
  >
    <slot />
  </div>
</template>

<script>

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.tab-container-item {
  flex-shrink: 0;
  width: 100%;
}
</style>
