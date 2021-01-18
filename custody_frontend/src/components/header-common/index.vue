<template>
  <header>
    <div
      class="back-bar special"
      :class="backgroundClass"
    >
      <span class="back">
        <a
          class="top__back"
          @click="onBack"
        />
      </span>
      <h2>{{ title }}</h2>
      <div
        v-if="right.text"
        class="edit img-btn-dark"
        @click="(() => {right.action()})"
      >
        {{ right.text }}
      </div>
      <a
        v-if="right.share"
        class="top__share"
        @click="(() => {right.action()})"
      />
    </div>
    <div
      class="header-pad"
    />
  </header>
</template>

<script >
export default {
  props: {
    backgroundClass: {
      type: String,
      default: ''
    },
    title: String,
    left: Object
  },
  data() {
    return {
      right: {}
    }
  },
  methods: {
    onBack() {
      if (this.left && this.left.action) {
        this.left.action()
      } else {
        const { from } = this.$route.query
        if (from) {
          this.$router.push({
            name: from
          })
          return
        }
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style>
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
  /* background-color: #3f46b4; */
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
  width: 70%;
  margin: 0 auto;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: normal;
}

.top__back {
  float: left;
  width: 42px;
  height: 44px;
}

.top__back:before {
  content: "";
  display: block;
  margin: 15px 0 0 16px;
  width: 10px;
  height: 16px;
  background: url(../../assets/images/back.png) no-repeat;
  background-size: 10px 16px;
}

.top__share:before {
  content: "";
  display: block;
  position: absolute;
  top: 12px;
  right: 14px;
  width: 18px;
  height: 21px;
  background: url(../../assets/images/icon-share.png) no-repeat;
  background-size: 100%;
}

.is-white .top__back:before {
  content: "";
  display: block;
  margin: 15px 0 0 16px;
  width: 14px;
  height: 22px;
  background: url(../../assets/images/back-black.png) no-repeat;
  background-size: 14px 22px;
}
.is-yellow.back-bar {
  background-color: #D6AF74;
}
.is-blue.back-bar {
  background-color:  #4691F9;
}
.edit {
  position: absolute;
  top: 13px;
  right: 13px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
</style>
