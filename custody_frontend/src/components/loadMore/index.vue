<template>
  <div
    class="load-more"
  >
    <van-loading
      size="14px"
      class="loading"
    />
    <span>{{ $t('loading') }}...</span>
  </div>
</template>
<style lang="less" scope>
.load-more {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0 10px;
  background: #FFF;
  .loading {
    display: inline-block;
    margin-right: 8px;
  }
  color: #999;
  font-size: 14px;
}
</style>
