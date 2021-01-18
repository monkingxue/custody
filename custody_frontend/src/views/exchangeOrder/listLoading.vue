<template>
  <div class="container-white">
    <div
      v-for="index in placeholdersNum"
      :key="index"
    >
      <content-loader
        :height="120"
        :width="363"
        :speed="2"
        primary-color="#f3f3f3"
        secondary-color="#ecebeb"
      >
        <rect
          x="1"
          y="20"
          rx="10"
          ry="10"
          width="40"
          height="22"
        />
        <rect
          x="46"
          y="20"
          rx="10"
          ry="10"
          width="115"
          height="22"
        />
        <rect
          x="1"
          y="60"
          rx="7"
          ry="7"
          width="60"
          height="15"
        />
        <rect
          x="1"
          y="81"
          rx="10"
          ry="10"
          width="73"
          height="22"
        />
      </content-loader>
    </div>
  </div>
</template>
<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader
  },
  props: {
    placeholdersNum: {
      type: [Number],
      default: 2
    }
  }
}
</script>
