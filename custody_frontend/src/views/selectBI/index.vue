<template>
  <div class="container-white">
    <header>
      <div class="header-bar">
        <div class="header-bar-content">
          <a
            class="top__back"
            @click="onBack"
          />
          <div class="search-box">
            <img
              v-if="!searchKey"
              class="search-icon"
              src="../../assets/images/pair/icon-search.png"
            >
            <input
              ref="input"
              v-model="searchKey"
              class="search-input"
              placeholder="搜索"
              autoFocus
            >
          </div>
        </div>
      </div>
      <div class="header-pad" />
    </header>
    
    <div class="comm-list">
      <div
        v-for="item in biLists"
        :key="item.name"
        @click="() => select(item)"
      >
        <div
          v-if="searchKey === '' || item.name.indexOf(searchKey.toUpperCase()) > -1"
          class="order-list touch"
        >
          <div class="item-left">
            <img :src="item.icon_url">
            <div class="info title">
              <span>{{ item.name }}</span>
            </div>
          </div>
          <span
            v-if="
              (target === 'deposit' && !item.deposit_enabled) ||
                (target === 'withdraw' && !item.withdraw_enabled)
            "
            class="suspend"
          >
            暂未开放
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from "core"
import { Dialog } from "vant"

export const BIBI_USER_SELECT_TIBI = "BIBI_USER_SELECT_TIBI"
export const BIBI_USER_SELECT_CHONGBI = "BIBI_USER_SELECT_CHONGBI"

export default {
  data() {
    return {
      target: "",
      searchKey: ""
    }
  },
  computed: {
    setting() {
      return DI.get("store").state.setting.setting
    },
    biLists() {
      return this.setting["assets"] || []
    }
  },
  mounted() {
    const { query } = this.$route
    this.target = query.target
    // DI.get("utils").setTitle(this.$t("selectBI"))
    DI.get("utils").setBackAction(() => {
      this.$router.replace({
        name: this.target,
        query: {
          target: query.item
        }
      })
    })
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
    onSearchClick() {
      this.$router.push({
        name: "search",
        query: {
          type: "favorite"
        }
      })
    },
    select(item) {
      if (this.target === "withdraw") {
        if (!item.withdraw_enabled) {
          Dialog.alert({
            message: `${item.name}提币功能近期开放`
          })
          return
        }
        DI.get("offlineStorage").set(BIBI_USER_SELECT_TIBI, item.name)
      }
      if (this.target === "deposit") {
        if (!item.deposit_enabled) {
          Dialog.alert({
            message: `${item.name}冲币功能近期开放`
          })
          return
        }
        DI.get("offlineStorage").set(BIBI_USER_SELECT_CHONGBI, item.name)
      }
      this.$router.replace({
        name: this.target,
        query: {
          target: item.name
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.header-bar {
  position: fixed;
  height: 44px;
  background-color: #4140bb;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;

  .header-pad {
    width: 100%;
    height: 44px;
  }
  .header-bar {
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

  .header-bar-content{
    height: 100%;
    display: flex;
    align-items: center;
  }
  .top__back {
    width: 42px;
    height: 44px;
    &::before {
      content: "";
      display: block;
      margin: 14px 0 0 16px;
      width: 10px;
      height: 16px;
      background: url(../../assets/images/back.png) no-repeat;
      background-size: 10px 16px;
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100vw - 42px - 45px);
    margin-left: 15px;
    height: 28px;
    margin-right: 20px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);

    .search-icon {
      position: absolute;
      width: 20px;
      left: 50%;
      top: 12px;
      opacity: 0.5;
      margin-left: -18px;
    }
    .search-text {
      opacity: 0.5;
      font-size: 12px;
      color: #ffffff;
    }
    .search-input {
      background: transparent;
      border: none;
      caret-color: #00C3D2;
      color: #FFF;
      width: 100%;
      font-size: 12px;
      text-align: center;
      height: 28px;
    }
  }
}
.van-tab--active span {
  font-weight: bold;
}
.comm-list {
  padding: 0 30px;
}
.order-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 66px;
  border-bottom: 0.5px solid #eee;
  .item-left {
    align-items: center;
    display: flex;
  }
  img {
    width: 28px;
    height: 28px;
  }
  .title {
    margin-left: 12px;
  }
  .suspend {
    color: rgba(34, 34, 34, 0.6);
    font-size: 12px;
  }
}
</style>