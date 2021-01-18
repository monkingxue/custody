<template>
  <div
    class="tab-container-item"
  >
    <slot />
  </div>
</template>

<script>

export default {
  props: {
    id: {
      type: [String, Number],
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
