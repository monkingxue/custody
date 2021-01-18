<template>
  <div class="preview">
    <img
      v-if="imgStr"
      :src="imgStr"
    >
  </div>
</template>

<script>

export default {
  data() {
    return {
      imgStr: ''
    }
  },
  mounted() {
    const { img } = this.$route.params
    if (img) {
      this.imgStr = img
    }
  }
}
</script>

<style scoped lang="less">
.preview {
  img {
    width: 100%;
  }
}
</style>
