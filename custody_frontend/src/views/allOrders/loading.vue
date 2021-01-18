<template>
  <div class="placeholder-wrapper">
    <div
      v-for="index in 10"
      :key="index"
    >
      <content-loader
        :height="70"
        :width="300"
        :speed="2"
        primary-color="#f3f3f3"
        secondary-color="#ecebeb"
        class="svg"
      >
        <circle
          cx="32"
          cy="35"
          r="13"
        />
        <rect
          x="56"
          y="15"
          rx="9"
          ry="9"
          width="130"
          height="19"
        />
        <rect
          x="56"
          y="43"
          rx="6"
          ry="6"
          width="110"
          height="12"
        />
      </content-loader>
    </div>
  </div>
</template>
<script>
import { ContentLoader } from "vue-content-loader"

export default {
  components: {
    ContentLoader
  }
}
</script>