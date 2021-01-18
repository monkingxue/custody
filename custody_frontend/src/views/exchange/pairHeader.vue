<template>
  <header>
    <div class="back-bar">
      <span class="back">
        <a
          class="top__back"
          @click="onBack"
        />
      </span>
      <h2 @click="goToSearch">
        {{ title }}<img src="../../assets/images/pair/icon-choose.png">
      </h2>
      <div
        class="favorite"
        @click.stop="onFavoriteChange"
      >
        <img
          v-if="favoriteDisplay"
          src="../../assets/images/pair/icon-faved.png"
        >
        <img
          v-else
          src="../../assets/images/pair/icon-fav-white.png"
        >
      </div>
    </div>
    <div class="header-pad" />
  </header>
</template>

<script>
import { DI } from "core"
import { Message } from "components"
import { Toast } from "vant"
export default {
  props: {
    title: String,
    base: String
  },
  data() {
    return {
      favoriteDisplay: false
    }
  },
  computed: {
    storeFavoritePairList() {
      return DI.get("store").state.pairV2.favoritePairList
    }
  },
  watch: {
    storeFavoritePairList: {
      immediate: true,
      handler() {
        this.favInit()
      }
    }
  },
  mounted() {
    if (DI.get('auth').getToken().token) {
      DI.get('store').dispatch('SYNC_FAVORITE_PAIR')
    }
  },
  methods: {
    onBack() {
      const { from } = this.$route.query
      if (from) {
        this.$router.push({
          name: from
        })
        return
      }
      this.$router.go(-1)
    },
    favInit() {
      if(!this.storeFavoritePairList || !this.storeFavoritePairList.length) {
        return
      }
      const include = this.storeFavoritePairList.filter(item => item.symbol === this.base)
      this.favoriteDisplay = include.length > 0 ? true : false
    },
    onFavoriteChange() {
      if (this.favoriteDisplay) {
        DI.get("assetHttp")
          .deleteFavoritePair({
            asset: this.base
          })
          .then(() => {
            Toast(this.$t('removedFromFavorites'))
          })
          .catch(Message)
      } else {
        DI.get("assetHttp")
          .updateFavoritePair({
            asset: this.base
          })
          .then(() => {
            Toast(this.$t('addToFavorites'))
          })
          .catch(Message)
      }
      this.favoriteDisplay = !this.favoriteDisplay
    },
    goToSearch() {
      if (this.$route.name === "stockDetail") {
        this.$router.replace({
          name: "search",
          query: {
            type: "pair"
          }
        })
      } else {
        const type = this.$route.name === "chart" ? "pair" : "exchange"
        this.$router.replace({
          name: "search",
          query: {
            type,
            asset: this.base
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.header-pad {
  width: 100%;
  height: 44px;
}
.back-bar {
  margin: 0 auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  overflow: hidden;
  color: #fff;
  background-color: #4140bb;
  z-index: 98;
}

.back-bar .back {
  position: absolute;
  top: -2px;
  left: 0px;
  text-align: center;
}

.back-bar h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: normal;
  img {
    margin-left: 5px;
    width: 12px;
  }
}

.top__back {
  float: left;
  width: 42px;
  height: 44px;
  &::before {
    content: "";
    display: block;
    margin: 15px 0 0 16px;
    width: 10px;
    height: 16px;
    background: url(../../assets/images/back.png) no-repeat;
    background-size: 10px 16px;
  }
}

.favorite {
  position: absolute;
  top: 8px;
  right: 14px;
  img {
    width: 28px;
  }
}

.screenshot {
  position: absolute;
  top: 10px;
  right: 58px;
  img {
    width: 18px;
  }
}

</style>
