<template>
  <div class="dev">
    <h2>Dev</h2>
    <p>Last Bundle Time: {{ bundleTime }}</p>
    <h2>UA</h2>
    <p>{{ ua }}</p>
    <h2>Language</h2>
    <p>{{ language }}</p>
    <h2>HASH</h2>
    <p>{{ hash }}</p>
    <h2>Current</h2>
    <p>{{ url }}</p>
    <h2>Test API</h2>
    <p class="mb10">
      <a @click="() => goToTest('onebtc')">
        http://onebtc.iamkun.com
      </a>
    </p>
    <p class="mb10">
      <a @click="() => goToTest('onebtc1')">
        http://onebtc1.iamkun.com
      </a>
    </p>
    <p class="mb10">
      <a @click="() => goToTest('onebtc2')">
        http://onebtc2.iamkun.com
      </a>
    </p>
    <p class="mb10">
      <a @click="() => goToTest('onebtc3')">
        http://onebtc3.iamkun.com
      </a>
    </p>
    <h2>Prod API</h2>
    <p class="mb10">
      <a @click="() => goToTest('onebtc4')">
        http://onebtc4.iamkun.com
      </a>
    </p>
    <h2>Custom Url</h2>
    <p class="mb10">
      <van-cell-group>
        <van-field
          v-model="customUrl"
          label="打开网址"
          placeholder="http://"
          right-icon="arrow"
          @click-right-icon="() => goToUrl()"
        />
      </van-cell-group>
    </p>
  </div>
</template>

<script>
import { DI } from "core"
export default {
  data() {
    return {
      bundleTime: this.$dayjs(process.env.BUNDLE_TIME).format(),
      hash: process.env.BUNDLE_HASH,
      ua: window.navigator.userAgent,
      language: window.navigator.language,
      url: window.location.href,
      customUrl: ''
    }
  },
  mounted() {
    DI.get("utils").setTitle("任意门")
  },
  methods: {
    methodA() {
      return
    },
    goToTest(link) {
      window.location = `http://${link}.iamkun.com`
    },
    goToUrl() {
      window.location = this.customUrl
    }
  }
}
</script>

<style scoped>
.dev {
  background-color: white;
  padding: 0 10px;
}
h2 {
  padding: 20px 0;
  font-size: 16px;
  font-weight: bold;
}
p {
  font-size: 14px;
}
a {
  font-size: 16px;
  text-decoration: underline;
}
</style>
