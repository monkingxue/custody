<template>
  <div
    class="pair-list-placeholder-wrapper"
  >
    <div
      v-for="index in 9"
      :key="index"
      class="pair-list-placeholder"
      :style="{
        margin: `0 ${margin}px`
      }"
    >
      <content-loader
        :height="80"
        :width="180"
        :speed="1"
        primary-color="#f3f3f3"
        secondary-color="#e6e6e6"
        class="right-placeholder"
      >
        <rect
          x="35"
          y="25"
          rx="4"
          ry="4"
          width="30"
          height="10"
        />
        <rect
          x="15"
          y="43"
          rx="4"
          ry="4"
          width="50"
          height="10"
        />
        <rect
          x="130"
          y="25"
          rx="4"
          ry="4"
          width="45"
          height="10"
        />
        <rect
          x="90"
          y="43"
          rx="4"
          ry="4"
          width="85"
          height="10"
        />
      </content-loader>
      <content-loader
        :height="80"
        :width="102"
        :speed="1"
        primary-color="#f3f3f3"
        secondary-color="#e6e6e6"
        class="left-placeholder"
      >
        <circle
          cx="12"
          cy="39"
          r="12"
        />
        <rect
          x="32"
          y="33"
          rx="5"
          ry="5"
          width="70"
          height="12"
        />
      </content-loader>
    </div>
  </div>
</template>

<style>
</style>

<script>
import { ContentLoader } from "vue-content-loader"
export default {
  components: {
    ContentLoader
  },
  props: {
    margin: {
      type: Number,
      default: 30
    }
  }
}
</script>
<style lang="less">
.pair-list-placeholder-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #FFF;
}
.pair-list-placeholder {
  flex: 1;
  flex-direction: row;
  height: 80px;
  border-bottom: 1px solid #F3F3F3;

  .left-placeholder {
    position: absolute;
    width: 102px;
    height: 80px;
  }
  .right-placeholder {
    width: 180px;
    height: 80px;
    float: right;
  }
}
</style>
