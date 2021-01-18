<template>
  <div class="favorite">
    <div
      ref="favorite"
      class="elementInView"
    />
    <ListLoading
      v-if="isLoading"
    />
    <div v-if="!isLoading">
      <div
        v-for="(item, index) in storeFavoritePairList"
        :key="item.symbol"
      >
        <ListEach
          :info="item"
          :is-last="index + 1 === storeFavoritePairList.length"
          :lowest="false"
        />
      </div>
      <div
        class="add-area"
        @click="onAddFavorite"
      >
        <div>
          <img src="../../assets/images/pair/icon-add.png">
          <span>添加自选币种</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import { DI } from 'core'
import ListLoading from './item-list-loading'
import ListEach from './item-list-each'
import elementInView from '@kpi/u/elementInView'

let intervalId
export default {
  components: {
    ListLoading,
    ListEach
  },
  computed: {
    isLoading() {
      if (!this.isAuthenticated) return false
      return !this.storeFavoritePairList
    },
    storeFavoritePairList() {
      return DI.get("store").state.pairV2.favoritePairList
    },
    isAuthenticated() {
      return DI.get('auth').isAuthenticated()
    }
  },
  methods: {
    initChild() {
      if (!this.isAuthenticated) return
      this.fetchData()
      this.initInterval()
    },
    fetchData() {
      DI.get('store').dispatch('SYNC_FAVORITE_PAIR')
    },
    initInterval() {
      if (intervalId) return
      intervalId = setInterval(() => {
        if (!this.$refs.favorite || !elementInView(this.$refs.favorite)) {
          clearInterval(intervalId)
          intervalId = null
        } else {
          this.fetchData()
        }
      }, 1000 * 5)
    },
    onAddFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: 'login' })
        return
      }
      this.$router.push({
        name: "search"
      })
    }
  }
}
</script>
<style lang="less" scoped>
.favorite {
  min-height: 95vh;
  .add-area {
    margin-top: 60px;
    padding-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 37px;
      display: block;
      margin: 0 auto;
      padding-bottom: 20px;
    }
    span {
      font-size: 14px;
      color: #00C3D2;
      text-align: center;
    }
  }
}
</style>
