<template>
  <div class="empty-box">
    <img 
      src="../../assets/images/empty.svg" 
      width="60"
    >
    <span>{{ text || $t('noRecords') }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.empty-box {
  font-size: 14px;
  color: rgba(34, 34, 34, 0.3);
  text-align: center;
  padding: 30px 0;
  img {
    margin: 0 auto 10px;
  }
}
</style>